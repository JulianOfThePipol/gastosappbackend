import express from "express";
import {
    createNewUser,
    authenticate
  } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.post("/", createNewUser);
userRouter.post("/login", authenticate)

export default userRouter;