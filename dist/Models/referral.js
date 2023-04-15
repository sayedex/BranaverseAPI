"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const referralSchema = new Schema({
    referringUser: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    referredUser: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    points: {
        type: Number,
        required: false
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('referrals', referralSchema);
