import { Request, Response, NextFunction } from "express";
import Product from "../Models/product";
import User from "../Models/usermodel";
import Order from "../Models/order";
import tokenSchema from "../Models/token";
import createError from "../utils/createErrors";
import catchAsyncErrors from "../middileware/catchAsyncErrors";
import ApiFeatures from "../utils/apisysteam";
import { shuffle } from "lodash"; // Import the shuffle function from lodash library

//web3
import { wallet } from "../utils/web3provider";
import { ethers } from "ethers";
import { createSignature, generateNonce, Mint } from "../utils/web3";
import crypto from "crypto";
import axios from "axios";
import { getTokenPrice } from "../utils/Helper";
import { tokenaddresss } from "../utils/web3";
// Add a new product..
export const addProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tokenid, value, productid } = req.body;
    // Check if the token ID already exists
    const existingToken = await Product.findOne({ productid });
    if (existingToken) {
      return next(createError(404, "product exits already"));
    }
    // we have to throw error if unable to get price Fetch all tokens from the Token
    // collection
    const tokens = await tokenSchema.find();
    const getnativeTokenPriceinUSD = await getTokenPrice(tokenaddresss);

    if (!getnativeTokenPriceinUSD) {
      return next(
        createError(404, "getnativeTokenPriceinUSD can't fetch try again...")
      );
    }

    // Calculate the payment token prices dynamically based on the USD price
    const calculatedTokens = tokens.map(({ symbol, stable, decimal, id }) => ({
      symbol,
      price: stable ? value * 1 : value / getnativeTokenPriceinUSD,
      decimal,
      id,
    }));

    // create data
    const product = new Product({
      ...req.body,
      USD:value,
      paymentTokens: calculatedTokens,
    });

    // update to DB..
    const savedProduct = await product.save();

    // Send a response to the client
    res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  }
);

// modify product
export const Updateproduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {  value } = req.body;
    // Check if the token ID already exists
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return next(createError(404, "product not found"));
    }

    if(!value) {
      return next(createError(404, "value not found"));
    }

    // we have to throw error if unable to get price Fetch all tokens from the Token
    // collection
    const tokens = await tokenSchema.find();

    const getnativeTokenPriceinUSD = await getTokenPrice(tokenaddresss);

    if (!getnativeTokenPriceinUSD) {
      return next(
        createError(404, "getnativeTokenPriceinUSD can't fetch try again...")
      );
    }

    // Calculate the payment token prices dynamically based on the USD price
    const calculatedTokens = tokens.map(({ symbol, stable, decimal, id }) => ({
      symbol,
      price: stable ? Number(value) * 1 : Number(value) / getnativeTokenPriceinUSD,
      decimal,
      id,
    }));

    // Assign the calculatedTokens to req.body.paymentTokens
    req.body.paymentTokens = calculatedTokens;
  

    // update to DB..
    const savedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    // Send a response to the client
    res
      .status(201)
      .json({
        success: true,
        message: "Product changed successfully",
        product:savedProduct,
      });
  }
);

// buy product for user - > the func will accept sinature from cokie let's see
export const Buynft = catchAsyncErrors(
  async (req: any, res: Response, next: NextFunction) => {
    
    const { productid, paymentid, amount } = req.body;
    // Product id -> index of every nft listing . id - > payment token id...
    const product = await Product.findOne({ productid: productid });
    if (!product) return next(createError(404, "product not exits"));

    // Find the user by ID
    const user: any = await User.findById(req.user._id );
    if (!user) return next(createError(404, "no user found"));

    const paymentToken: any = product.paymentTokens.find(
      (token: any) => token.id === paymentid
    );
    if (!paymentToken) return next(createError(404, "token not found"));

    // check user balance
    const userTokenBalance = user.balances.find(
      (balance: any) => balance.token.toString() === paymentid
    );


    if (!userTokenBalance) {
      return next(createError(404, "user balance not found"));
    }
    // Check if the user has sufficient balance to make the purchase
    if (userTokenBalance.amount < paymentToken.price * amount) {
      return next(createError(404, "Insufficient balance to buy the product"));
    }


    console.log("1");
    
    // mint helper...

    //create a nonce... // will replance with env file
    const nonceResponse = await axios.get(
    process.env.NonceAPI!
    );
    console.log(nonceResponse);
    
    const nonce = generateNonce(nonceResponse.data);

    if (!nonce) {
      return next(createError(404, "nonce not found"));
    }

    // create signer hash >
    // const signature =await createSignature(account,productid,amount,nonce)
    //test
    const signature = await createSignature(user.wallet, productid, amount, nonce);

    console.log("sig",signature);
    console.log("nonce",nonce);
    
    if (!signature) {
      return next(createError(404, "signature not found"));
    }

    // then call mitn func if done then cut balance...

  const mintnft = await Mint("mint",[user.wallet,productid,amount,"0x",nonce,signature]);
   if (!mintnft.isDone) {
       return next(createError(404, "mintnft failed try again.."));
    }
  
    const order = await Order.create({
      users: user._id,
      amount:amount,
      totalprice:paymentToken.price * amount,
      paymentToken: paymentToken.symbol,
      product: product._id,
      tx: "mintnft.tx",
      paidAt: Date.now(),
    });

    await product.incrementMinted(Number(amount));
    // Deduct the product price from the user's token balance
    userTokenBalance.amount -= paymentToken.price * amount;

    // Save the updated user document
    await user.save();

    // we will send mint transation  if passed we will cuted user balance okey?s

    res
      .status(201)
      .json({
        success: true,
        message: "Product brought successfully",
        product,
      });
  }
);

// modify price
export const testsignature = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const nonceResponse = await axios.get(
      "http://localhost:5000/api/product/nonce"
    );
    console.log(nonceResponse.data);

    // Usage example
    // const nonce = 11
    //create a nonce...
    function generateNonce(input: string) {
      const hash = crypto.createHash("sha256").update(input).digest("hex");
      const numericHash = parseInt(hash, 16);
      const nonce = numericHash % 10000000; // Limit nonce to the range of 0 to 9999999
      return nonce;
    }

    // Usage example
    const input = "AeHY8bfn1vvQQCfel";
    const nonce = generateNonce(input);

    const getprice = await getTokenPrice(
      "0x5e6602B762F76d8BFDC7321AA0B787B1E67b187F"
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Product brought successfully",
        getprice,
      });
  }
);

// remove a product

// modify price
export const removeproduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const productid = req.params.productId;

    // Check if the token ID already exists
    const product: any = await Product.findOne({ productid: productid });
    if (!product) {
      return next(createError(404, "product not found"));
    }

    // Remove the product
    await product.deleteOne();

    // Send a response to the client
    res
      .status(201)
      .json({
        success: true,
        message: "Product has been remove successfully",
        product,
      });
  }
);

// all return func...
export const getAllProducts = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const limits = Number(limit) || 10;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * limits;
    const product: any = await Product.find().skip(skip).limit(Number(limits));

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      product: product,
    });
  }
);

// all return func...
export const Getfeaturedproduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const limits = Number(limit) || 10;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * limits;
    const product: any = await Product.find({featured:true}).skip(skip).limit(Number(limits));
    const shuffledProducts = shuffle(product);
    const randomProducts = shuffledProducts.slice(0, 3);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      product: randomProducts,
    });
  }
);
/// get one product

export const getSingleProducts = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      product: product,
    });
  }
);