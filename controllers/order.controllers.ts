import { Request, Response, NextFunction } from "express";
import createError from "../utils/createErrors";
import catchAsyncErrors from "../middileware/catchAsyncErrors";
import Order from "../Models/order";

// all return func...
export const getAllorder = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      const { page, limit } = req.query;
      const limits = Number(limit) || 10;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * limits;
      const order: any = await Order.find().skip(skip).limit(Number(limits));
  
      res.status(200).json({
        success: true,
        message: "order retrieved successfully",
        order: order,
      });
    }
  );
  