import User from "../Models/usermodel";
import createError from "../utils/createErrors";
import mongoose from "mongoose";
import Token from "../Models/token";
import catchAsyncErrors from "../middileware/catchAsyncErrors";
import { verifySignature } from "../utils/web3";
import sendToken from "../utils/sendtoken";
import { getUserbalance } from "../utils/Helper";

export const createUser = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    const { wallet, signature, nonce } = req.body;
    let user = await User.findOne({ wallet });
    // Verify the signature
    const isSignatureValid = await verifySignature(wallet, signature, nonce);
    console.log(isSignatureValid);

    if (!isSignatureValid) {
      return next(createError(404, "user signature not valid"));
    }

    if (!user) {
      // Create the user
      const newUser = new User({
        wallet,
        balances: [], // Add any additional fields or default values here
      });
      const tokens = await Token.find({});
      const initialBalances = tokens.map((token) => ({
        token: token._id.toString(),
        amount: 0,
      }));

      newUser.balances = initialBalances;
      user = await newUser.save();
    }

    sendToken(user, 201, res);
  }
);

export const getUserinfo = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    const user = await User.findById(req.user._id).populate("balances.token");
    if (!user) {
      return next(createError(404, "user not valid"));
    }
    res.status(201).json({
      success: true,
      message: "user get successfully",
      user,
    });
  }
);

export const getUserNFTbalance = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    const nft = await getUserbalance();
    if (!nft) {
      return next(createError(404, "nft not found"));
    }

    const filerdNFTArray = nft.result.filter(
      (item: any) => item.token_address === process.env.nftaddress
    );

    res.status(201).json({
      success: true,
      message: "user get successfully",
      nft: filerdNFTArray,
    });
  }
);
