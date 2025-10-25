import { Router, Response } from "express";
import bcrypt from "bcrypt";
import { Pool } from "mysql2/promise";
import { authenticateToken, AuthRequest } from "../middleware/auth";

export const createUserRoutes = (pool: Pool) => {
  const router = Router();

  // Get user settings
  router.post("/settings", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const [rows] = await pool.execute(
        "SELECT id, username, isadmin FROM users WHERE id = ?",
        [req.userId]
      );

      const users = rows as any[];
      if (users.length === 0) {
        return res.status(404).json({ error: "Utente non trovato" });
      }

      res.json(users[0]);
    } catch (err) {
      console.error("Errore caricamento impostazioni:", err);
      res.status(500).json({ error: "Errore del server" });
    }
  });

  // Reset own password
  router.put("/reset-password", authenticateToken, async (req: AuthRequest, res: Response) => {
    const { newPassword } = req.body;

    try {
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ 
          error: "La password deve contenere almeno 6 caratteri" 
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        Number(process.env.BCRYPT_ROUNDS) || 10
      );

      await pool.execute(
        "UPDATE users SET passwordhash = ? WHERE id = ?",
        [hashedPassword, req.userId]
      );

      res.json({ message: "Password modificata con successo" });
    } catch (err) {
      console.error("Errore reset password:", err);
      res.status(500).json({ error: "Errore del server" });
    }
  });

  return router;
};
