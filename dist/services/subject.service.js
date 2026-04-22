"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const subject_repository_1 = require("../repositories/subject.repository");
class SubjectService {
    constructor() {
        this.repo = new subject_repository_1.SubjectRepository();
    }
    async create(name, userId) {
        return this.repo.create({ name, userId });
    }
    async getAll(userId) {
        return this.repo.findByUser(userId);
    }
    async delete(id) {
        return this.repo.delete(id);
    }
}
exports.SubjectService = SubjectService;
