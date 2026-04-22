import express from "express";

import authRoutes from "./routes/auth.routes";
import subjectRoutes from "./routes/subject.routes";
import taskRoutes from "./routes/task.routes";
import sessionRoutes from "./routes/session.routes";

const app = express();

app.use(express.json());

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

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);

export default app;

