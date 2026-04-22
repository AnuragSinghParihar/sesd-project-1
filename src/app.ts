import express from "express";
import path from "path";

import authRoutes from "./routes/auth.routes";
import subjectRoutes from "./routes/subject.routes";
import taskRoutes from "./routes/task.routes";
import sessionRoutes from "./routes/session.routes";

const app = express();

app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);

// Serve frontend for all non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
