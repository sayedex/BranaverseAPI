"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getSingleUser = exports.getAllUser = exports.getUserDetails = exports.validOTP = exports.resetpassword = exports.passwordchange = exports.OTP = exports.loginotp = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const usermodel_1 = __importDefault(require("../Models/usermodel"));
const userotp_1 = __importDefault(require("../Models/userotp"));
const referral_1 = __importDefault(require("../Models/referral"));
const createErrors_1 = __importDefault(require("../utils/createErrors"));
const catchAsyncErrors_1 = __importDefault(require("../middileware/catchAsyncErrors"));
const sendtoken_1 = __importDefault(require("../utils/sendtoken"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
exports.register = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username } = req.body;
    const existuser = yield usermodel_1.default.findOne({ username: username, email: email });
    if (existuser)
        return next((0, createErrors_1.default)(404, "user exits already"));
    const newUser = new usermodel_1.default(Object.assign({}, req.body));
    yield newUser.save();
    const referringUser = yield usermodel_1.default.findOne({ username: req.body.rusername });
    if (referringUser) {
        // Create a new referral document
        const newReferral = new referral_1.default({
            referringUser: referringUser._id,
            referredUser: newUser._id,
            status: "pending",
            points: 10 // or whatever number of points you want to award
        });
        yield newReferral.save();
        //Update Reffer ...
        yield usermodel_1.default.updateOne({
            _id: referringUser._id
        }, {
            $push: {
                refId: newReferral._id
            }
        });
    }
    res.status(201).send("User has been created.");
}));
exports.login = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, otp } = req.body;
    const user = yield usermodel_1.default.findOne({ username: username });
    if (!otp || !username)
        return next((0, createErrors_1.default)(404, "invalid anything"));
    if (!user)
        return next((0, createErrors_1.default)(404, "invalid anything"));
    const isCorrect = bcrypt_1.default.compareSync(req.body.password, user.password);
    if (!isCorrect)
        return next((0, createErrors_1.default)(400, "invalid anything"));
    const Mail = user.email;
    const OTPdocument = yield userotp_1.default.findOne({
        email: Mail,
        otp,
        expire: { $gt: Date.now() }
    });
    if (OTPdocument) {
        (0, sendtoken_1.default)(user, 201, res);
        OTPdocument.expire = undefined;
        OTPdocument.otp = undefined;
        yield OTPdocument.save();
    }
    else {
        return next((0, createErrors_1.default)(404, "invalid OTP send"));
    }
}));
// Logout User
exports.logout = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
}));
// user login OTP verify 
exports.loginotp = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield usermodel_1.default.findOne({ username: username });
    if (!user)
        return next((0, createErrors_1.default)(404, "invalid anything"));
    const isCorrect = bcrypt_1.default.compareSync(password, user.password);
    if (!isCorrect)
        return next((0, createErrors_1.default)(400, "invalid anything"));
    const Mail = user.email;
    const existEmail = yield userotp_1.default.findOne({ email: Mail });
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const message = `Hello ${user.firstName},\n\nThank you for choosing to log in to your BRANAVERSE account. To verify your identity and complete the login process, please enter the following OTP code:\n\n${OTP}\n\nIf you did not attempt to log in, please disregard this email and secure your account.\n\nThank you for being a valued member of BRANAVERSE!\n\nBest regards,\nThe BRANAVERSE Team`;
    const expire = Date.now() + 15 * 60 * 1000;
    if (existEmail) {
        const updateData = yield userotp_1.default.findByIdAndUpdate({ _id: existEmail._id }, {
            otp: OTP,
            expire
        }, { new: true });
        yield updateData.save();
        try {
            (0, sendMail_1.default)({
                email: user.email,
                subject: `BRANAVERSE Login Verification Code`,
                message,
            });
            res.status(200).json({
                success: true,
                message: "OTP was sended",
            });
        }
        catch (_a) {
            res.status(401).json({
                success: true,
                message: "something wrong try again",
            });
        }
    }
    else {
        const saveOtpData = new userotp_1.default({
            email: Mail, otp: OTP,
            expire
        });
        yield saveOtpData.save();
        try {
            (0, sendMail_1.default)({
                email: user.email,
                subject: `BRANAVERSE Login Verification Code`,
                message,
            });
            res.status(200).json({
                success: true,
                message: "OTP was sended",
            });
        }
        catch (_b) {
            res.status(401).json({
                success: true,
                message: "something wrong try again",
            });
        }
    }
}));
// user OTP verify password reset..
exports.OTP = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("call");
    const { email } = req.body;
    const user = yield usermodel_1.default.findOne({ email: email });
    if (!user)
        return next((0, createErrors_1.default)(404, "invalid anything"));
    const existEmail = yield userotp_1.default.findOne({ email: email });
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const message = `Hello ${user.firstName},\n\nWe received a request to reset your password for your BRANAVERSE account. Please use the following OTP code to verify your identity and reset your password:\n\n${OTP}\n\nIf you did not request to reset your password, please disregard this email.\n\nThank you for being a valued member of BRANAVERSE!\n\nBest regards,\nThe BRANAVERSE Team`;
    const expire = Date.now() + 15 * 60 * 1000;
    if (existEmail) {
        const updateData = yield userotp_1.default.findByIdAndUpdate({ _id: existEmail._id }, {
            otp: OTP,
            expire
        }, { new: true });
        yield updateData.save();
        try {
            (0, sendMail_1.default)({
                email: user.email,
                subject: `BRANAVERSE Password Recovery`,
                message,
            });
            res.status(200).json({
                success: true,
                message: "Recovery was sended",
            });
        }
        catch (_c) {
            res.status(401).json({
                success: true,
                message: "something wrong try again",
            });
        }
    }
    else {
        const saveOtpData = new userotp_1.default({
            email, otp: OTP,
            expire
        });
        yield saveOtpData.save();
        try {
            (0, sendMail_1.default)({
                email: user.email,
                subject: `BRANAVERSE Password Recovery`,
                message,
            });
            res.status(200).json({
                success: true,
                message: "Recovery was sended",
            });
        }
        catch (_d) {
            res.status(401).json({
                success: true,
                message: "something wrong try again",
            });
        }
    }
    (0, sendtoken_1.default)(user, 201, res);
}));
//change password with old password
//User password reset
exports.passwordchange = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldpassword, password, confirmPassword } = req.body;
    if (!confirmPassword || !password)
        return next((0, createErrors_1.default)(404, "invalid anything"));
    const user = yield usermodel_1.default.findById(req.user.id).populate("refId");
    if (!user)
        return next((0, createErrors_1.default)(404, "invalid anything"));
    if (req.body.password !== req.body.confirmPassword) {
        return next((0, createErrors_1.default)("Password does not match", 401));
    }
    const isPasswordMatched = yield user.comparePassword(oldpassword);
    if (!isPasswordMatched)
        return next((0, createErrors_1.default)(401, "invalid password"));
    user.password = req.body.password;
    yield user.save();
    res.status(201).json({
        success: true,
        message: "password has been changed!",
    });
}));
//User password reset
exports.resetpassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, password, confirmPassword } = req.body;
    if (!otp || !email)
        return next((0, createErrors_1.default)(404, "invalid anything"));
    // const all = await userotps.find();
    const OTPdocument = yield userotp_1.default.findOne({
        email,
        otp,
        expire: { $gt: Date.now() }
    });
    if (OTPdocument) {
        const user = yield usermodel_1.default.findOne({ email: email });
        if (!user)
            return next((0, createErrors_1.default)(404, "invalid anything"));
        if (req.body.password !== req.body.confirmPassword) {
            return next((0, createErrors_1.default)("Password does not password", 400));
        }
        user.password = req.body.password;
        yield user.save();
        OTPdocument.expire = undefined;
        OTPdocument.otp = undefined;
        yield OTPdocument.save();
        res.status(200).json({
            success: true,
            message: "password has been chaged!",
        });
    }
    else {
        return next((0, createErrors_1.default)(404, "invalid OTP send"));
    }
}));
//User password reset
exports.validOTP = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!otp || !email)
        return next((0, createErrors_1.default)(404, "invalid anything"));
    const OTPdocument = yield userotp_1.default.findOne({
        email,
        otp,
        expire: { $gt: Date.now() }
    });
    if (OTPdocument) {
        res.status(200).json({
            success: true,
            message: "OTP are valid",
        });
    }
    else {
        return next((0, createErrors_1.default)(404, "invalid OTP send"));
    }
}));
// Get User Detail
exports.getUserDetails = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usermodel_1.default.findById(req.user.id).populate("refId");
    res.status(200).json({
        success: true,
        user,
    });
}));
// Get all users(admin)
exports.getAllUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield usermodel_1.default.find();
    res.status(200).json({
        success: true,
        users,
    });
}));
// Get single user (admin)
exports.getSingleUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usermodel_1.default.findById(req.params.id);
    if (!user) {
        return next((0, createErrors_1.default)(`User does not exist with Id: ${req.params.id}`, 401));
    }
    res.status(200).json({
        success: true,
        user,
    });
}));
// update User Role -- Admin
exports.updateUserRole = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    yield usermodel_1.default.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
}));
// Delete User --Admin
exports.deleteUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usermodel_1.default.findById(req.params.id);
    if (!user) {
        return next((0, createErrors_1.default)(`User does not exist with Id: ${req.params.id}`, 400));
    }
    //const imageId = user.avatar.public_id;
    //await cloudinary.v2.uploader.destroy(imageId);
    yield user.remove();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
}));
