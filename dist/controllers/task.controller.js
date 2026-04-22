"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
const service = new task_service_1.TaskService();
class TaskController {
    constructor() {
        this.create = async (req, res) => {
            res.json(await service.create({
                ...req.body,
                userId: req.userId
            }));
        };
        this.getAll = async (req, res) => {
            res.json(await service.getAll(req.userId));
        };
        this.update = async (req, res) => {
            const id = req.params.id;
            res.json(await service.update(id, req.body));
        };
        this.delete = async (req, res) => {
            const id = req.params.id;
            await service.delete(id);
            res.json({ message: "Deleted" });
        };
    }
}
exports.TaskController = TaskController;
