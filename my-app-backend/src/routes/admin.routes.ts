import { Router, Response } from "express";
import bcrypt from "bcrypt";
import { Pool } from "mysql2/promise";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const ACCOUNT_TYPES = [
  "bancaintesa", "revolut", "paypal",
  "portafogliocarte", "portafogliomonete",
  "musignacarte", "musignamonete", "sterline"
];

const requireAdmin = async (req: AuthRequest, res: Response, pool: Pool): Promise<boolean> => {
  const [userRows] = await pool.execute(
    "SELECT isadmin FROM users WHERE id = ?",
    [req.userId]
  );

  const currentUser = (userRows as any[])[0];
  if (!currentUser || currentUser.isadmin !== 1) {
    res.status(403).json({ error: "Accesso negato" });
    return false;
  }
  return true;
};

export const createAdminRoutes = (pool: Pool) => {
  const router = Router();

  // Get all users
  router.get("/users", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!(await requireAdmin(req, res, pool))) return;

      const [rows] = await pool.execute(
        "SELECT id, username, isadmin, createdat FROM users ORDER BY createdat DESC"
      );

      res.json(rows);
    } catch (err) {
      console.error("Errore caricamento utenti:", err);
      res.status(500).json({ error: "Errore del server" });
    }
  });

  // Create user
  router.post("/users", authenticateToken, async (req: AuthRequest, res: Response) => {
    const { username, password, isAdmin } = req.body;

    try {
      if (!(await requireAdmin(req, res, pool))) return;

      if (!username || !password) {
        return res.status(400).json({ error: "Dati incompleti" });
      }

      const [existingRows] = await pool.execute(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );

      if ((existingRows as any[]).length > 0) {
        return res.status(400).json({ error: "Username già esistente" });
      }

      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_ROUNDS) || 10
      );

      const [result] = await pool.execute(
        "INSERT INTO users (username, passwordhash, isadmin) VALUES (?, ?, ?)",
        [username, hashedPassword, isAdmin ? 1 : 0]
      );

      const userId = (result as any).insertId;

      // Create accounts
      for (const accountType of ACCOUNT_TYPES) {
        await pool.execute(
          "INSERT INTO accounts (userid, accounttype, balance) VALUES (?, ?, 0)",
          [userId, accountType]
        );
      }

      const [newUserRows] = await pool.execute(
        "SELECT id, username, isadmin, createdat FROM users WHERE id = ?",
        [userId]
      );

      res.status(201).json((newUserRows as any[])[0]);
    } catch (err) {
      console.error("Errore creazione utente:", err);
      res.status(500).json({ error: "Errore del server" });
    }
  });

  // Delete user
  router.delete("/users/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;

    try {
      if (!(await requireAdmin(req, res, pool))) return;

      if (req.userId === parseInt(userId)) {
        return res.status(400).json({ error: "Non puoi eliminare il tuo account" });
      }

      await pool.execute("DELETE FROM transactions WHERE userid = ?", [userId]);
      await pool.execute("DELETE FROM accounts WHERE userid = ?", [userId]);
      await pool.execute("DELETE FROM users WHERE id = ?", [userId]);

      res.json({ message: "Utente eliminato con successo" });
    } catch (err) {
      console.error("Errore eliminazione utente:", err);
      res.status(500).json({ error: "Errore del server" });
    }
  });

  // Toggle admin status
  router.put("/users/:id/toggle-admin", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;

    try {
      if (!(await requireAdmin(req, res, pool))) return;

      if (req.userId === parseInt(userId)) {
        return res.status(400).json({ error: "Non puoi modificare i tuoi privilegi" });
      }

      await pool.execute("UPDATE users SET isadmin = NOT isadmin WHERE id = ?", [userId]);

      const [updatedRows] = await pool.execute(
        "SELECT id, username, isadmin FROM users WHERE id = ?",
        [userId]
      );

      res.json((updatedRows as any[])[0]);
    } catch (err) {
      console.error("Errore modifica privilegi:", err);
      res.status(500).json({ error: "Errore del server" });
    }
  });

  // Reset user password
  router.put("/users/:id/reset-password", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;
    const { newPassword } = req.body;

    try {
      if (!(await requireAdmin(req, res, pool))) return;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "La password deve contenere almeno 6 caratteri" });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        Number(process.env.BCRYPT_ROUNDS) || 10
      );

      await pool.execute(
        "UPDATE users SET passwordhash = ? WHERE id = ?",
        [hashedPassword, userId]
      );

      res.json({ message: "Password resettata con successo" });
    } catch (err) {
      console.error("Errore reset password:", err);
      res.status(500).json({ error: "Errore del server" });
    }
  });

  return router;
};
