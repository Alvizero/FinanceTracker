import { Router, Response } from "express";
import { Pool } from "mysql2/promise";
import { authenticateToken, AuthRequest } from "../middleware/auth";

export const createAccountsRoutes = (pool: Pool) => {
  const router = Router();

  // Get accounts
  router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const [rows] = await pool.execute(
        "SELECT accounttype, balance FROM accounts WHERE userid=?",
        [req.userId]
      );
      res.json(rows);
    } catch (err) {
      console.error("Errore caricamento account:", err);
      res.status(500).json({ error: "Errore caricamento account" });
    }
  });

  // Update account balance
  router.put("/update", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { accountType, balance } = req.body;

      await pool.execute(
        "UPDATE accounts SET balance=?, updatedat=NOW() WHERE userid=? AND accounttype=?",
        [balance, req.userId, accountType]
      );

      res.json({ message: "Saldo aggiornato" });
    } catch (err) {
      console.error("Errore aggiornamento saldo:", err);
      res.status(500).json({ error: "Errore aggiornamento saldo" });
    }
  });

  return router;
};
