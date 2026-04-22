"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
const connectDB = async () => {
    if (isConnected)
        return;
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables");
        throw new Error("MONGO_URI is not defined");
    }
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
