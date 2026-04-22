"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectRepository = void 0;
const Subject_1 = require("../models/Subject");
class SubjectRepository {
    async create(data) {
        return Subject_1.Subject.create(data);
    }
    async findByUser(userId) {
        return Subject_1.Subject.find({ userId });
    }
    async delete(id) {
        return Subject_1.Subject.findByIdAndDelete(id);
    }
}
exports.SubjectRepository = SubjectRepository;
