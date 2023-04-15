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
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    profession: {
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
        enum: ['freelancer', 'buyer']
    },
    company: {
        type: Boolean,
        required: true,
    },
    nofemployees: {
        type: String,
    },
    nofregistration: {
        type: String,
    },
    skills: {
        type: [{ name: String }],
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
}, {
    timestamps: true
});
//save passoword...
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = yield bcrypt_1.default.hash(this.password, 5);
        next();
    });
});
// Compare Password
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
//sellerIndividuala
exports.default = mongoose_1.default.model('users', userSchema);
