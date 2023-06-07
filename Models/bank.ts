import mongoose, { Schema, Document } from "mongoose";

export interface BankDoc extends Document {
  name: string;
  id: string;
  uptoDateWithBlockNumber: number; // Add the field for storing the latest fetched block number
  chianId:number,
  token:{}
  // Add more fields as per your requirements
}

const bankSchema = new Schema<BankDoc>({
  name: {
    type: String,
    required: true,
  },
  id:{
    type: String,
    required: true,
  },
  token: {
    type: Schema.Types.ObjectId, // Update the type to Schema.Types.ObjectId
    ref: 'Token', // Update the reference to the Token model
    required: true,
  },
  uptoDateWithBlockNumber: {
    type: Number,
    required: true,
    default: 0, // Set the default value to 0 or any initial value you prefer
  },
  chianId:{
    type: Number,
    required: true,
    default: 97, // Set the default value to 0 or any initial value you prefer
  }
  // Add more fields as per your requirements
});

export default mongoose.model<BankDoc>("Bank", bankSchema);