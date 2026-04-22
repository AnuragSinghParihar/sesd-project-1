"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const service = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await service.register(name, email, password);
            res.json(user);
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }
            const token = await service.login(email, password);
            res.json({ token });
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}
exports.AuthController = AuthController;
