import { Router } from "express";
import { getMeUser, logoutUser, userLogin, userRegister } from "../controllers/user.controller.js";
import { validateLogin, validateRegister } from "../middlewares/validator.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validateRegister,userRegister)
router.route("/login").post(validateLogin,userLogin)
router.route("/logout").get(verifyJWT,logoutUser)
router.route("/get-me").get(verifyJWT,getMeUser)


export default router;