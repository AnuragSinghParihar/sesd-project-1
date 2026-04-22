"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const session_service_1 = require("../services/session.service");
const service = new session_service_1.SessionService();
class SessionController {
    constructor() {
        this.start = async (req, res) => {
            res.json(await service.start(req.userId, req.body.subjectId));
        };
        this.getAll = async (req, res) => {
            res.json(await service.getAll(req.userId));
        };
        this.end = async (req, res) => {
            try {
                const id = req.params.id;
                const session = await service.end(id);
                res.json(session);
            }
            catch (e) {
                res.status(400).json({ message: e.message });
            }
        };
    }
}
exports.SessionController = SessionController;
