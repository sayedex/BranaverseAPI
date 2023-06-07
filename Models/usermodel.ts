import mongoose from "mongoose";
const { Schema} = mongoose;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export interface UserDoc extends mongoose.Document {
  wallet: string;
  role: string;
  balances: { token: any; amount: number }[]; // Update the type definition


}

const balanceSchema = new Schema({
  token: {
    type: Schema.Types.ObjectId, // Update the type to Schema.Types.ObjectId
    ref: 'Token', // Update the reference to the Token model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});


const userSchema = new Schema(
  {
    wallet: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    balances: {
      type: [balanceSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// // Enable autopopulate plugin
// userSchema.plugin(require('mongoose-autopopulate'));
//sellerIndividuala

export default mongoose.model<UserDoc>("users", userSchema);
