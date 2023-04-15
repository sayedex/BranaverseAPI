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
    try {
     const db = await mongoose.connect(process.env.MONGO!);
      console.log("Connected to mongoDB!");
    } catch (error) {
      console.log(error);
    }
  };
  const corsOptions = {
    origin: "*", 
    credentials: true, // enable CORS with credentials
  };
  app.use(cors(corsOptions));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
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
  