"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const StudySession_1 = require("../models/StudySession");
class SessionRepository {
    async create(data) {
        return StudySession_1.StudySession.create(data);
    }
    async findByUser(userId) {
        return StudySession_1.StudySession.find({ userId });
    }
    async findById(id) {
        return StudySession_1.StudySession.findById(id);
    }
    async update(id, data) {
        return StudySession_1.StudySession.findByIdAndUpdate(id, data, { new: true });
    }
}
exports.SessionRepository = SessionRepository;
