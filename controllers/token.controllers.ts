import { Request, Response, NextFunction } from "express";
import Token from "../Models/token";
import User from "../Models/usermodel";
import createError from "../utils/createErrors";
import catchAsyncErrors from "../middileware/catchAsyncErrors";
// Add a new skill

export const addtoken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { symbol } = req.body;

    // Check if the token already exists
    const existingToken = await Token.findOne({ symbol });

    if (existingToken) {
      throw new Error("Token ID already exists");
    }

    // create data
    const token = new Token({
      ...req.body,
    });
    // update to DB..
    const savedNewtoken = await token.save();
    // Send a response to the client
    res.status(201).json({
      success: true,
      message: "token added successfully",
      savedNewtoken,
    });
  }
);

export const TEst = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const address="0xB9c9a6dc679892ECEE90da41597d194EeA43baa910"
    const id="6471f7ee1d2cc27c778fa56b"
    //just test
    const Founduser: any = await User.findOne({ wallet: address}).populate("balances.token");
// Check if the token exists in the token balances
const tokenBalance = Founduser.balances.find((balance:any) => balance.token._id.toString() === id);


if (tokenBalance) {
  // Token balance exists, update the amount
  tokenBalance.amount += 100;
} else {
  // Token balance does not exist, create a new entry
  Founduser.balances.push({
    token: id,
    amount: 10,
  });
}
// Save the updated user
await Founduser.save();

    // Send a response to the client
    res.status(201).json({
      success: true,
      message: "token added successfully",
      Founduser,
    });
  }
);

// return token via ID

export const getToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    const tokendata = await Token.findOne({ _id: id });

    // Send a response to the client
    res.status(201).json({
      success: true,
      message: "token data fetched...",
      tokendata,
    });
  }
);
