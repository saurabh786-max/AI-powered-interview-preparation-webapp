import { body } from "express-validator";

export const validateRegister = [
    body("username").notEmpty().withMessage("username  is required "),
    body("email").trim().isEmail().withMessage("invalid Email "),
    body("password").isLength({min:6}).withMessage("password must be at least ^ character long ")
];

export const validateLogin = [
     body("username").notEmpty().withMessage("username  is required "),
     body("password").isLength({min:6}).withMessage("password must be at least ^ character long ")
];