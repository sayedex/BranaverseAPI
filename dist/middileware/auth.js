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
exports.isAuthenticatedUser = exports.authorizeRoles = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createErrors_1 = __importDefault(require("../utils/createErrors"));
const catchAsyncErrors_1 = __importDefault(require("../middileware/catchAsyncErrors"));
const usermodel_1 = __importDefault(require("../Models/usermodel"));
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next((0, createErrors_1.default)(`Role: ${req.user.role} is not allowed to access this resouce `, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
exports.isAuthenticatedUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        return next((0, createErrors_1.default)("Please Login to access this resource", 401));
    }
    const decodedData = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
    req.user = yield usermodel_1.default.findById(decodedData.id);
    next();
}));
