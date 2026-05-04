import express from "express"
import mongoose, { connect } from "mongoose"
import { DB_NAME } from "../../contants.js"

const connectDB = async()=>{
try{
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

    console.log(`mongoDB connection successfull DB_HOST:${connectionInstance.connection.host}`)
}
catch(error){
    console.log("error in connecting to the host !!",error)
    process.exit(1)
}
}
export default connectDB