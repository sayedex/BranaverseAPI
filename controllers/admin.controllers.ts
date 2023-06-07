import Bank from "../Models/bank";
import createError from "../utils/createErrors";
import mongoose from "mongoose";
import Token from "../Models/token";
import catchAsyncErrors from "../middileware/catchAsyncErrors";

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


