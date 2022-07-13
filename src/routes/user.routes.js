import express from "express";
import {
    createNewUser,
    authenticate,
    confirmUser,
    forgotPassword,
    checkForgotToken,
    changeForgotPassword,
    userProfile,
    changeProfile
    
  } from "../controllers/user.controllers.js";
  import checkAuth from "../middleware/checkAuth.js";

const userRouter = express.Router();

userRouter.post("/", createNewUser);
userRouter.post("/login", authenticate);
userRouter.get("/confirmed/:token", confirmUser);
userRouter.post("/forgot", forgotPassword);
userRouter.get("/forgot/:token", checkForgotToken);
userRouter.post("/forgot/:token", changeForgotPassword);
userRouter.get("/profile", checkAuth, userProfile);
userRouter.post("/profile", checkAuth, changeProfile);

export default userRouter;