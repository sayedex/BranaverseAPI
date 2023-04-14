import mongoose from "mongoose";
const { Schema } = mongoose;

export interface UserRef extends mongoose.Document {
    referringUser:any;
    referredUser:any;
    status:'pending' | 'approved' | 'rejected';
    points:any
    
}


const referralSchema = new Schema({
  referringUser: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      referredUser: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      points: {
        type: Number,
        required: false
      }

},{
  timestamps:true
});

export default mongoose.model('referrals', referralSchema);
