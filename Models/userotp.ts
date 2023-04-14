import mongoose from "mongoose";
import validator from 'validator'


const userOtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value:string){
            if(!validator.isEmail(value)){
                throw new Error("Not Valid Email")
            }
        }
    },
    otp:{
        type:String,
        required:false
    },
    expire:Date
});




export default mongoose.model('userotps', userOtpSchema);