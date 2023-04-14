import express from "express";
import {
  register,
  login,
  getUserDetails,
  logout,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
  OTP,
  resetpassword,
  loginotp,
  passwordchange,
  validOTP
} from "../controllers/auth.controllers";
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


// admin
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;
