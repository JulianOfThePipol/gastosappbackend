import express from "express";
import {
    createNewUser,
  } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.post("/", createNewUser);

export default userRouter;