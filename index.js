import express from "express";
import conectarDb from "./src/config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./src/routes/user.routes.js";


const app = express();

dotenv.config({ path: "./.env" });

app.use(express.json());

conectarDb();

const whiteList = ["http://localhost:3000"];

const corsOption = {
    origin: function (origin, callback) {
      /* console.log(origin);
      if (whiteList.includes(origin)) { */
        // Puede consultar la api
        callback(null, true);
  /*     } else {
        callback(new Error("Error de Cors"));
      } */
    }
  };
  
  app.use(cors(corsOption));

  app.use("/api/user", userRouter);

  const port = process.env.PORT || 4000;
  app.listen(port);
  console.log(port)