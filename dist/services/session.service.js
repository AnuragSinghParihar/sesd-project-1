"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const session_repository_1 = require("../repositories/session.repository");
class SessionService {
    constructor() {
        this.repo = new session_repository_1.SessionRepository();
    }
    async start(userId, subjectId) {
        return this.repo.create({
            userId,
            subjectId,
            startTime: new Date()
        });
    }
    async getAll(userId) {
        return this.repo.findByUser(userId);
    }
    async end(sessionId) {
        const session = await this.repo.findById(sessionId);
        if (!session) {
            throw new Error("Session not found");
        }
        const endTime = new Date();
        const startTime = new Date(session.startTime);
        const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // duration in seconds
        return this.repo.update(sessionId, {
            endTime,
            duration
        });
    }
}
exports.SessionService = SessionService;
