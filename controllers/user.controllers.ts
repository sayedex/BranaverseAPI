import User from "../Models/usermodel";
import createError from "../utils/createErrors";
import catchAsyncErrors from "../middileware/catchAsyncErrors";
export const totaluser = catchAsyncErrors(async(req:any, res:any, next:any) => {
  const freelancerCount = await User.countDocuments({ userType: "freelancer" });
  const buyerCount = await User.countDocuments({ userType: "buyer" });
  res.status(200).json({
    success: true,
    data: {
      freelancers: freelancerCount,
      buyers: buyerCount
    }
  });
} 
)
