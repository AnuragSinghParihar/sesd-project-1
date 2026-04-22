import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

// Connect to DB (non-blocking for serverless)
connectDB().catch((err) => console.error("DB connection failed:", err));

// Only listen when running locally (not on Vercel)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
}

// Export for Vercel serverless
export default app;
