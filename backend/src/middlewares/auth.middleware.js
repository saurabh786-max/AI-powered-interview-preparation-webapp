import { tokenBlackList } from "../modles/balcklist.model.js";
import { User } from "../modles/user.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    (await req.cookies?.accessToken) ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new apiError(401, "unauthorised request");
  }
  const isBlackListed = await tokenBlackList.findOne({ token });
  if (isBlackListed) {
    throw new apiError(401, "Token is blacklisted");
  }

  try {
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN);
    console.log(decodedToken);
    const user = await User.findById(decodedToken.id).select(
      "-refreshToken -password",
    );
    if (!user) {
      throw new apiError(401, "invalid access token !!");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access Token");
  }
});

export default verifyJWT;
