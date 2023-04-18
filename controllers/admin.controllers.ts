import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";
import User from "../Models/usermodel";
import Skill from '../Models/skill';
import createError from "../utils/createErrors"
import catchAsyncErrors from "../middileware/catchAsyncErrors";
// Add a new skill
export const setSkill = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the skill data from the request body
    const { name, description } = req.body;
    const findone = await Skill.findOne({name:name});
    if(findone) return next(createError(404, "skill exits already"));
    // Create a new skill document
    const skill = await Skill.create({
      name,
      description
    });
  
    // Send a response to the client
    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      skill
    });
  });


  // Get all users(admin)
  export const getSkill = catchAsyncErrors(async (req: any, res: Response, next: NextFunction) => {
    const skill = await Skill.find();
  
    res.status(200).json({
      success: true,
      skill,
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