"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userOtpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Not Valid Email");
            }
        }
    },
    otp: {
        type: String,
        required: false
    },
    expire: Date
});
exports.default = mongoose_1.default.model('userotps', userOtpSchema);
