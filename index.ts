import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import Product from "./routes/product.route";
import tokenAdding from "./routes/token.route";
import User from "./routes/user.route"
import order from "./routes/order.route"
import infoRoute from "./routes/info.route";
import cookieParser from "cookie-parser"
// blockchian monitor..
import {watch} from "./Monitor/watcher"

import cors from "cors";
export const REFFER_REWARD= 0.01;
const app = express();
dotenv.config();
const connect = async () => {
    try {
     const db = await mongoose.connect(process.env.MONGO!);
      console.log("Connected to mongoDB!");
    } catch (error) {
      console.log(error);
    }
  };
  const corsOptions = {
    origin: "http://localhost:3000", 
    credentials: true, // enable CORS with credentials
  };
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/product", Product);
  app.use("/api/token", tokenAdding);
  app.use("/api/user", User);
  app.use("/api/order", order);
  app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
  });
  

  app.listen(5000, async() => {
    // connect();
    connect();
    watch(["6471f7ee1d2cc27c778fa56b","6471f7ee1d2cc27c778fa56b","6471f7ee1d2cc27c778fa56b"]);
    console.log("Backend server is running!");
  });
  



  