import express from "express";
import {
    createNewUser,
    authenticate,
    confirmed,
    forgotPassword
  } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.post("/", createNewUser);
userRouter.post("/login", authenticate);
userRouter.get("/confirmed/:token", confirmed);
userRouter.post("/forgot", forgotPassword);

export default userRouter;