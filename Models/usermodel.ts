import mongoose from "mongoose";
const { Schema } = mongoose;
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  img?: string;
  country: string;
  profession:string;
  desc?: string;
  userType: 'freelancer' | 'buyer',
  refId?:any[];
  company?: boolean;
  nofemployees?:string
  nofregistration?:string
  skills?: string[];
  portfolio?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}



const userSchema = new Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
      },
  username: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  profession:{
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  userType: {
    type: String,
    required: false,
    enum: ['freelancer','buyer']

  },
  company: {
    type: Boolean,
    required: true,
  },
  nofemployees:{
    type: String,
  },
  nofregistration:{
    type: String,
  },
  skills: {
    type: [{name:String}],
    required: false,
  },
  portfolio: {
    type: Array,
    required: false
  },
  role: {
    type: String,
    default: "user",
  },
  refId: [{
    type: Schema.Types.ObjectId,
    ref: "referrals",
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,


},{
  timestamps:true
});


//save passoword...
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 5);
  next();
});
// Compare Password

userSchema.methods.comparePassword = async function (password:any) {
  return await bcrypt.compare(password, this.password);
};

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


//sellerIndividuala

export default mongoose.model<UserDoc>('users', userSchema);
