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
exports.totaluser = void 0;
const usermodel_1 = __importDefault(require("../Models/usermodel"));
const catchAsyncErrors_1 = __importDefault(require("../middileware/catchAsyncErrors"));
exports.totaluser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const freelancerCount = yield usermodel_1.default.countDocuments({ userType: "freelancer" });
    const buyerCount = yield usermodel_1.default.countDocuments({ userType: "buyer" });
    res.status(200).json({
        success: true,
        data: {
            freelancers: freelancerCount,
            buyers: buyerCount
        }
    });
}));
