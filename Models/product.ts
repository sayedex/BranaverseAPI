import mongoose from "mongoose";
const { Schema } = mongoose;
interface PaymentToken {
  symbol: string;
  price: number | string;
  decimal: number;
}

export interface ProductDoc extends mongoose.Document {
  name: string;
  productid: number;
  minted: number;
  description: string;
  imgUrl: string;
  maxmint: number;
  Type: string;
  paymentTokens: PaymentToken[];
  id: string;
  rarity: string;
  series: string;
  character: string;
  mint: string;
  incrementMinted(amount: number): Promise<void>;
  USD:number

}

const paymentTokenSchema = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  price: {
    type: Number, // Use Decimal128 for precise decimal values
    required: true,
  },
  decimal: {
    type: Number,
    required: true,
  },
  id: {
    type: String,
    require: true,
  },
});

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  productid: {
    type: Number,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  minted: {
    type: Number,
    required: true,
    default :0,
  },
  description: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  rarity: {
    type: String,
    require: true,
  },
  character: {
    type: String,
    require: true,
  },
  mint: {
    type: String,
    require: true,
  },
  maxmint: {
    type: Number,
    required: true,
  },
  USD: {
    type: Number,
    required: true,
  },
  series: {
    type: String,
    required: true,
  },
  paymentTokens: {
    type: [paymentTokenSchema],
    required: true,
  },
});

productSchema.methods.incrementMinted = async function (amount:number) {
  this.minted += amount;
  await this.save();
};

// Compare Password

productSchema.methods.comparePassword = async function (password: any) {};

// JWT TOKEN
productSchema.methods.getJWTToken = function () {};

//sellerIndividuala

export default mongoose.model<ProductDoc>("Product", productSchema);
