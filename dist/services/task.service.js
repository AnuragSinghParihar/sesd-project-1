"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repositories/task.repository");
class TaskService {
    constructor() {
        this.repo = new task_repository_1.TaskRepository();
    }
    async create(data) {
        return this.repo.create(data);
    }
    async getAll(userId) {
        return this.repo.findByUser(userId);
    }
    async update(id, data) {
        return this.repo.update(id, data);
    }
    async delete(id) {
        return this.repo.delete(id);
    }
}
exports.TaskService = TaskService;
