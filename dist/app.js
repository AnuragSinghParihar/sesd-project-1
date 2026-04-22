"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const subject_routes_1 = __importDefault(require("./routes/subject.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Root health-check / welcome route
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "Study Planner API is running",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            subjects: "/api/subjects",
            tasks: "/api/tasks",
            sessions: "/api/sessions",
        },
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/subjects", subject_routes_1.default);
app.use("/api/tasks", task_routes_1.default);
app.use("/api/sessions", session_routes_1.default);
exports.default = app;
