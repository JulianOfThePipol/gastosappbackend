import express from "express";
import {
    createNewUser,
    authenticate,
    confirmUser,
    forgotPassword,
    checkForgotToken,
    changeForgotPassword
  } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.post("/", createNewUser);
userRouter.post("/login", authenticate);
userRouter.get("/confirmed/:token", confirmUser);
userRouter.post("/forgot", forgotPassword);
userRouter.get("/forgot/:token", checkForgotToken);
userRouter.post("/forgot/:token", changeForgotPassword)

export default userRouter;