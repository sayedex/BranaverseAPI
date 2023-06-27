import Bank from "../Models/bank";
import createError from "../utils/createErrors";
import mongoose from "mongoose";
import Token from "../Models/token";
import catchAsyncErrors from "../middileware/catchAsyncErrors";
import Product from "../Models/product";
import User from "../Models/usermodel";
import Order from "../Models/order";

export const addBank = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    const { id } = req.body;

    const newBank = new Bank({
        ...req.body,
    });

    await newBank.save();
    res.status(201).json({
      success: true,
      message: "user Bank successfully",
      newBank,
    });
  }
);

export const getAllinfo = catchAsyncErrors(
  async (req: any, res: any, next: any) => {

    const productCount = await Product.countDocuments();
    const OrderCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
 const info ={
  product:productCount,
  order:OrderCount,
  user:userCount
 }

    res.status(201).json({
      success: true,
      message: "all info fetched successfully",
      data:info
    });
  }
);



