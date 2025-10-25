import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "mysql2/promise";
import { authenticateToken, AuthRequest } from "../middleware/auth";

export const createAuthRoutes = (pool: Pool) => {
  const router = Router();

  // Login
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Credenziali mancanti" });
      }

      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username=?",
        [username]
      );

      const user = (rows as any)[0];
      if (!user) {
        return res.status(401).json({ error: "Credenziali non valide" });
      }

      const valid = await bcrypt.compare(password, user.passwordhash);
      if (!valid) {
        return res.status(401).json({ error: "Credenziali non valide" });
      }

      // ✅ SOLUZIONE PIÙ SEMPLICE: Inline tutto
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "fallback-secret-key",
        { expiresIn: "7d" }  // ← Hardcoded, più semplice
      );

      res.json({ message: "Login effettuato", token });
    } catch (err) {
      console.error("Errore login:", err);
      res.status(500).json({ error: "Errore durante il login" });
    }
  });

  // Check admin status
  router.post("/check-admin", authenticateToken, async (req: AuthRequest, res: Response) => {
    const { username } = req.body;

    try {
      const [rows] = await pool.execute(
        "SELECT isadmin FROM users WHERE username = ?",
        [username]
      );

      const users = rows as any[];
      if (users.length === 0) {
        return res.status(404).json({ error: "Utente non trovato" });
      }

      res.json({ isAdmin: users[0].isadmin === 1 });
    } catch (err) {
      console.error("Errore verifica admin:", err);
      res.status(500).json({ error: "Errore del server" });
    }
  });

  return router;
};
