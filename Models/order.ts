import mongoose from "mongoose";
const { Schema } = mongoose;

interface order {
  users: {};
  product: {};
  tx:string,
  paidAt:any,
  amount:number,
  totalprice:number,
  paymentToken:string

}

const order = new Schema<order>({
  users: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  paidAt: {
    type: Date,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  tx: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  totalprice: {
    type: Number,
    required: true,
  },
  paymentToken:{
    type: String,
    required: true,
  }

});

export default mongoose.model<order>("order", order);
