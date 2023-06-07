import mongoose from "mongoose";
const { Schema } = mongoose;

interface Token {
    symbol: string;
    name: string;
    stable:boolean,
    decimal: number;
    address:string
    users:{},
    bank:{}
  }

  const Token = new Schema<Token>({
    symbol: {
      type: String,
      required: true,
    },
    stable:{
        type: Boolean,
        required: true,
    },
    name: {
      type: String,
      required: true,
    },
    decimal: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    users: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      bank: {
        type: Schema.Types.ObjectId,
        ref: "bank",
      },
  });



export default mongoose.model<Token>('Token', Token);