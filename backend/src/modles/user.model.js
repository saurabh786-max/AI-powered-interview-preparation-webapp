import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
 username:{
    type:String,
    unique:[true,"username already taken"],
    required:true,
 },
 email:{
    type:String,
    unique:[true,"email already registered"]
 },
 password:{
    type:String,
    required:true,
 },
 refreshToken:{
    type:String
 }
},{timestamps:true})

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function(){
   return jwt.sign(
      {id:this._id, username:this.username},
      process.env.ACCESS_TOKEN,
      {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
   )
}
userSchema.methods.generateRefreshToken = async function(){
   return jwt.sign(
      {id:this._id, username:this.username},
      process.env.REFRESH_TOKEN,
      {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
   )
}

export const User = mongoose.model("User",userSchema);