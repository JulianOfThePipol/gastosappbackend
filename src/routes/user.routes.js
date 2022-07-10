import express from "express";
import {
    createNewUser,
    authenticate,
    confirmed
  } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.post("/", createNewUser);
userRouter.post("/login", authenticate);
userRouter.get("/confirmed/:token", confirmed);

export default userRouter;