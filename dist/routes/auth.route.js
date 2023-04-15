"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const auth_1 = require("../middileware/auth");
const router = express_1.default.Router();
router.post("/register", auth_controllers_1.register);
router.post("/login", auth_controllers_1.login);
router.route("/logout").get(auth_controllers_1.logout);
router.post("/loginotp", auth_controllers_1.loginotp);
router.post("/OTP", auth_controllers_1.OTP);
//reset password
router.post("/passwordchange", auth_1.isAuthenticatedUser, auth_controllers_1.passwordchange);
router.post("/resetpassword", auth_controllers_1.resetpassword);
//AuthenticatedUser
router.route("/me").get(auth_1.isAuthenticatedUser, auth_controllers_1.getUserDetails);
//valid otp
router.post("/validOTP", auth_controllers_1.validOTP);
// admin
router
    .route("/admin/users")
    .get(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), auth_controllers_1.getAllUser);
router
    .route("/admin/user/:id")
    .get(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), auth_controllers_1.getSingleUser)
    .put(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), auth_controllers_1.updateUserRole)
    .delete(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), auth_controllers_1.deleteUser);
exports.default = router;
