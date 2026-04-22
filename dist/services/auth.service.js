"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
class AuthService {
    constructor() {
        this.repo = new user_repository_1.UserRepository();
    }
    async register(name, email, password) {
        if (!name || !email || !password) {
            throw new Error("Name, email, and password are required");
        }
        const exists = await this.repo.findByEmail(email);
        if (exists)
            throw new Error("User exists");
        const hashed = await bcrypt_1.default.hash(password, 10);
        return this.repo.create({
            name,
            email,
            password: hashed
        });
    }
    async login(email, password) {
        const user = await this.repo.findByEmail(email);
        if (!user)
            throw new Error("User not found");
        // Since password has select: false, we need to explicitly select it
        const userWithPassword = await this.repo.findById(user._id.toString(), true);
        if (!userWithPassword)
            throw new Error("User not found");
        const valid = await bcrypt_1.default.compare(password, userWithPassword.password);
        if (!valid)
            throw new Error("Invalid password");
        return jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    }
}
exports.AuthService = AuthService;
