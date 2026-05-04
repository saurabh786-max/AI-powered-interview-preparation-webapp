import express, { json, urlencoded } from "express";
import dotenv from "dotenv"
import router from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config({
    path:"./.env"
})

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use("/api/v1/users",router)

export default app;