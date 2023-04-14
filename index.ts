import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import authRoute from "./routes/auth.route";
import infoRoute from "./routes/info.route";
import cookieParser from "cookie-parser"
import cors from "cors";
const app = express();
dotenv.config();
const connect = async () => {
  console.log(process.env.MONGO!);
  
    try {
     const db = await mongoose.connect(process.env.MONGO!);
      console.log("Connected to mongoDB!");
    } catch (error) {
      console.log(error);
    }
  };
  const corsOptions = {
    origin: 'http://localhost:3000', // your client's URL
    credentials: true // enable CORS with credentials
  };
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/auth", authRoute);
  app.use("/api/info", infoRoute);
  app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
  });
  

  app.listen(5000, () => {
    // connect();
    connect();
    console.log("Backend server is running!");
  });
  