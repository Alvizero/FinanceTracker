import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createDatabasePool } from "./config/database";
import { createAuthRoutes } from "./routes/auth.routes";
import { createAccountsRoutes } from "./routes/accounts.routes";
import { createTransactionsRoutes } from "./routes/transaction.routes";
import { createAdminRoutes } from "./routes/admin.routes";
import { createUserRoutes } from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database pool
const pool = createDatabasePool();

// Routes
app.use("/api/auth", createAuthRoutes(pool));
app.use("/api/accounts", createAccountsRoutes(pool));
app.use("/api/transactions", createTransactionsRoutes(pool));
app.use("/api/admin", createAdminRoutes(pool));
app.use("/api/user", createUserRoutes(pool));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});
