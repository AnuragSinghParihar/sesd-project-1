"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
const subject_service_1 = require("../services/subject.service");
const service = new subject_service_1.SubjectService();
class SubjectController {
    constructor() {
        this.create = async (req, res) => {
            const subject = await service.create(req.body.name, req.userId);
            res.json(subject);
        };
        this.getAll = async (req, res) => {
            res.json(await service.getAll(req.userId));
        };
        this.delete = async (req, res) => {
            const id = req.params.id;
            await service.delete(id);
            res.json({ message: "Deleted" });
        };
    }
}
exports.SubjectController = SubjectController;
