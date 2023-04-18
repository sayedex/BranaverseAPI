import express from "express";
import {
  register,
  login,
  getUserDetails,
  logout,
  OTP,
  resetpassword,
  loginotp,
  passwordchange,
  validOTP,
} from "../controllers/auth.controllers";
import { 
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser} from "../controllers/admin.controllers"
import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.route("/logout").get(logout);
router.post("/loginotp", loginotp);
router.post("/OTP", OTP);
//reset password
router.post("/passwordchange", isAuthenticatedUser, passwordchange);
router.post("/resetpassword", resetpassword);

//AuthenticatedUser
router.route("/me").get(isAuthenticatedUser, getUserDetails);

//valid otp
router.post("/validOTP",validOTP)




export default router;
