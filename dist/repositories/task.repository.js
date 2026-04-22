"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const Task_1 = require("../models/Task");
class TaskRepository {
    async create(data) {
        return Task_1.Task.create(data);
    }
    async findByUser(userId) {
        return Task_1.Task.find({ userId });
    }
    async update(id, data) {
        return Task_1.Task.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return Task_1.Task.findByIdAndDelete(id);
    }
}
exports.TaskRepository = TaskRepository;
