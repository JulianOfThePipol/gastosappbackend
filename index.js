import * as dotenv from 'dotenv'
import express from "express";
import conectarDb from "./src/config/db.js";
import cors from "cors";
import {userRouter, categoryListRouter, expenseListRouter} from './src/routes/index.js';



dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());

conectarDb();

const corsOption = {
    origin: function (origin, callback) {
        callback(null, true);
    }
  };
  
  app.use(cors(corsOption));

  app.use("/api/user", userRouter);
  app.use("/api/category", categoryListRouter);
  app.use("/api/expenses", expenseListRouter)

  const port = process.env.PORT || 4000;
  app.listen(port);
