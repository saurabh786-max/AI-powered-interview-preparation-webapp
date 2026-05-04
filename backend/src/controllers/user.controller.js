import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../modles/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import { tokenBlackList } from "../modles/balcklist.model.js";
 const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path:"/"
  };

const generateAccessTokenAndRefreshToken = async function(id){
 try {
   const user = await User.findById(id);
   if (!user) {
  throw new apiError(404, "User not found");
}
   const accessToken = await user.generateAccessToken();
   const refreshToken = await user.generateRefreshToken();
 
   user.refreshToken = refreshToken;
   await user.save({validateBeforeSave:false});
   return {accessToken,refreshToken};
 } catch (error) {
   throw new apiError(500,"unable to create access and refresh Token"),error
 }
}

const userRegister = asyncHandler(async(req,res)=>{
const{username,email,password} = req.body;
 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    throw new apiError(400, errorMessages.join(", "));
  }
const existedUser =await User.findOne({email});
  if(existedUser){
    throw new apiError(402,"user already exists")
  }

  const user =await User.create(
   {
     username,
    email,
    password
   }
  )

  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if(!createdUser){
    throw new apiError(500,"something went wrong while creating the user")
  }

  return res.status(201)
  .json( new apiResponse(201,createdUser,"user registered successfully !!"))
})

const userLogin = asyncHandler(async(req,res)=>{
  const{username,password}= req.body;
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    const errorMessage = errors.array().map((err)=>err.msg);
    throw new apiError(400,
      errorMessage.join(", ")
    )
  }
  const user = await User.findOne({username});
  if(!user){
    throw new apiError(404,"user not existed please register");
  }
  
  const validUser = await user.checkPassword(password);

  if(!validUser){
    throw new apiError(401,"invalid user credential");
  }

  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-refreshToken -password");
 
  
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new apiResponse(200,loggedInUser,"user Logged in successfully !!"))
  
})

const logoutUser = asyncHandler(async (req, res) => {
  //   clear cookies for the user
  // also reset the refreshtokne field from the database
  // add the token to the blacklist 
  const token = req.token;
  console.log(token)
  if(token){
    const decoded = jwt.decode(token);
    await tokenBlackList.create({
      token,
      expiresAt: new Date(decoded.exp * 1000)
    })
  }
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );


  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "user loggedOut successfully !!"));
});

const getMeUser = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user._id).select("-refreshToken -password");
  res.status(200)
  .json(new apiResponse(200,user,"user details are shown !!"))
  
})
export {userLogin,logoutUser,userRegister,getMeUser}