import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";
import User from "../Models/usermodel";
import userotps from "../Models/userotp";
import Referral from "../Models/referral"
import createError from "../utils/createErrors"
import catchAsyncErrors from "../middileware/catchAsyncErrors";
import sendToken from "../utils/sendtoken";
import sendEmail from "../utils/sendMail"

export const register = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const {email,username} = req.body;
  const existuser = await User.findOne({ username: username , email:email});
  if(existuser) return next(createError(404, "user exits already"));
  const newUser = new User({
    ...req.body
  });
  await newUser.save();
  const referringUser = await User.findOne({ username: req.body.rusername });
  if (referringUser) {
    // Create a new referral document
    const newReferral = new Referral({
      referringUser: referringUser._id,
      referredUser: newUser._id,
      status: "pending",
      points: 10 // or whatever number of points you want to award
    });
    await newReferral.save();
    //Update Reffer ...
    await User.updateOne({
      _id: referringUser._id
    }, {
      $push: {
        refId: newReferral._id
      }
    });
  }

  res.status(201).send("User has been created.");
});



export const login = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const {username,otp} = req.body;
  const user = await User.findOne({ username: username });
  if(!otp || !username) return next(createError(404, "invalid anything"));
  if (!user) return next(createError(404, "invalid anything"));
  const isCorrect = bcrypt.compareSync(req.body.password, user.password);
  if (!isCorrect)
    return next(createError(400, "invalid anything"));
  const Mail = user.email;
  const OTPdocument:any = await userotps.findOne({
    email:Mail,
     otp,
    expire: { $gt: Date.now() }
    });

  if(OTPdocument){
    sendToken(user, 201, res);
    OTPdocument.expire =  undefined;
    OTPdocument.otp =  undefined;
    await OTPdocument.save();
  }else{
    return next(createError(404, "invalid OTP send"));
  }
})

// Logout User
export const logout = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
// user login OTP verify 
export const loginotp = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { username,password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) return next(createError(404, "invalid anything"));
  const isCorrect = bcrypt.compareSync(password, user.password);
  if (!isCorrect)
    return next(createError(400, "invalid anything"))
  const Mail = user.email;
  const existEmail = await userotps.findOne({ email: Mail });
  const OTP = Math.floor(100000 + Math.random() * 900000);
   const message =  `Hello ${user.firstName},\n\nThank you for choosing to log in to your BRANAVERSE account. To verify your identity and complete the login process, please enter the following OTP code:\n\n${OTP}\n\nIf you did not attempt to log in, please disregard this email and secure your account.\n\nThank you for being a valued member of BRANAVERSE!\n\nBest regards,\nThe BRANAVERSE Team`
   const expire = Date.now() + 15 * 60 * 1000;

    
  if(existEmail){
    const updateData:any = await userotps.findByIdAndUpdate({ _id: existEmail._id }, {
      otp: OTP,
      expire
  }, { new: true }
  );
  await updateData.save();

  try {
    sendEmail({
      email: user.email,
      subject: `BRANAVERSE Login Verification Code`,
      message,
    });
    res.status(200).json({
      success: true,
      message: "OTP was sended",
    })
  } catch {
    res.status(401).json({
      success: true,
      message: "something wrong try again",
    });
  }

  }else{
    const saveOtpData = new userotps({
      email: Mail, otp: OTP,
      expire
  });
  await saveOtpData.save();
  try {
    sendEmail({
      email: user.email,
      subject: `BRANAVERSE Login Verification Code`,
      message,
    });
    res.status(200).json({
      success: true,
      message: "OTP was sended",
    })
  } catch {
    res.status(401).json({
      success: true,
      message: "something wrong try again",
    });
  }
  }

});





// user OTP verify password reset..
export const OTP = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  console.log("call");
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return next(createError(404, "invalid anything"));
  const existEmail = await userotps.findOne({ email: email });
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const message = `Hello ${user.firstName},\n\nWe received a request to reset your password for your BRANAVERSE account. Please use the following OTP code to verify your identity and reset your password:\n\n${OTP}\n\nIf you did not request to reset your password, please disregard this email.\n\nThank you for being a valued member of BRANAVERSE!\n\nBest regards,\nThe BRANAVERSE Team`;
  const expire = Date.now() + 15 * 60 * 1000;

  if(existEmail){
    const updateData:any = await userotps.findByIdAndUpdate({ _id: existEmail._id }, {
      otp: OTP,
      expire
  }, { new: true }
  );
  await updateData.save();

  try {
    sendEmail({
      email: user.email,
      subject: `BRANAVERSE Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: "Recovery was sended",
    })
  } catch {
    res.status(401).json({
      success: true,
      message: "something wrong try again",
    });
  }

  }else{
    const saveOtpData = new userotps({
      email, otp: OTP,
      expire
  });
  await saveOtpData.save();
  try {
    sendEmail({
      email: user.email,
      subject: `BRANAVERSE Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: "Recovery was sended",
    })
  } catch {
    res.status(401).json({
      success: true,
      message: "something wrong try again",
    });
  }
  }


  sendToken(user, 201, res);
});


//change password with old password
//User password reset
export const passwordchange = catchAsyncErrors(async (req: any, res: Response, next: NextFunction) => {
  const {oldpassword,password,confirmPassword} = req.body;
  if(!confirmPassword  || !password) return next(createError(404, "invalid anything"));
    const user:any = await User.findById(req.user.id).populate("refId");
    if (!user) return next(createError(404, "invalid anything"));
   if (req.body.password !== req.body.confirmPassword) {
      return next(createError("Password does not match", 401));
    }
    const isPasswordMatched = await user.comparePassword(oldpassword);
    if (!isPasswordMatched)
      return next(createError(401, "invalid password"));
    

    user.password = req.body.password;
    await user.save();

    res.status(201).json({
      success: true,
      message: "password has been changed!",
    });

})



//User password reset
export const resetpassword = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const {email,otp,password,confirmPassword} = req.body;
  if(!otp || !email) return next(createError(404, "invalid anything"));
  // const all = await userotps.find();
  const OTPdocument:any = await userotps.findOne({
     email,
     otp,
    expire: { $gt: Date.now() }
    });

  if(OTPdocument){
    const user = await User.findOne({ email: email });
    if (!user) return next(createError(404, "invalid anything"));

    if (req.body.password !== req.body.confirmPassword) {
      return next(createError("Password does not password", 400));
    }
    user.password = req.body.password;
    await user.save();
    OTPdocument.expire =  undefined;
    OTPdocument.otp =  undefined;
    await OTPdocument.save();
    res.status(200).json({
      success: true,
      message: "password has been chaged!",
    });
  }else{
    return next(createError(404, "invalid OTP send"));
  }

})

//User password reset
export const validOTP = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const {email,otp} = req.body;
  if(!otp || !email) return next(createError(404, "invalid anything"));
  const OTPdocument:any = await userotps.findOne({
     email,
     otp,
    expire: { $gt: Date.now() }
    });

  if(OTPdocument){
    res.status(200).json({
      success: true,
      message: "OTP are valid",
    });
  }else{
    return next(createError(404, "invalid OTP send"));
  }
})




// Get User Detail
export const getUserDetails = catchAsyncErrors(async (req: any, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id).populate("refId");
  res.status(200).json({
    success: true,
    user,
  });
});



// Get all users(admin)
export const getAllUser = catchAsyncErrors(async (req: any, res: Response, next: NextFunction) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
// Get single user (admin)
export const getSingleUser = catchAsyncErrors(async (req: any, res: any, next: NextFunction) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(createError(`User does not exist with Id: ${req.params.id}`, 401));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
export const updateUserRole = catchAsyncErrors(async (req: any, res: any, next: NextFunction) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


// Delete User --Admin
export const deleteUser = catchAsyncErrors(async (req: any, res: any, next: NextFunction) => {
  const user: any = await User.findById(req.params.id);

  if (!user) {
    return next(
      createError(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  //const imageId = user.avatar.public_id;
  //await cloudinary.v2.uploader.destroy(imageId);

  await user.remove()

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});