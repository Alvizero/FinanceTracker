import { Router, Response } from "express";
import { Pool } from "mysql2/promise";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const DB_SOURCE_MAP: Record<string, string> = {
  bancaintesa: "bancaintesa",
  banca_intesa: "bancaintesa",
  revolut: "revolut",
  paypal: "paypal",
  portafoglio: "portafogliocarte",
  musigna: "musignacarte",
};

export const createTransactionsRoutes = (pool: Pool) => {
  const router = Router();

  // Get transactions
  router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const [rows] = await pool.execute(
        `SELECT id, date, amount, type, paymentmethod, sourceaccount, description, account_snapshot, createdat 
         FROM transactions 
         WHERE userid=? 
         ORDER BY date DESC, createdat DESC`,
        [req.userId]
      );
      res.json(rows);
    } catch (err) {
      console.error("Errore caricamento transazioni:", err);
      res.status(500).json({ error: "Errore caricamento transazioni" });
    }
  });

  // Create transaction
  router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { date, type, description, sourceAccount, amountCarta, amountMonete } = req.body;

      if (!date || !type || !sourceAccount) {
        return res.status(400).json({ error: "Dati transazione incompleti" });
      }

      const aCarta = parseFloat(amountCarta) || 0;
      const aMonete = parseFloat(amountMonete) || 0;

      if (aCarta <= 0 && aMonete <= 0) {
        return res.status(400).json({ error: "Importo non valido" });
      }

      const transazioniDaCreare: Array<{
        importo: number;
        metodo: "carta" | "contanti";
        account: string;
      }> = [];

      if (sourceAccount === "portafoglio") {
        if (aCarta > 0) transazioniDaCreare.push({ importo: aCarta, metodo: "contanti", account: "portafogliocarte" });
        if (aMonete > 0) transazioniDaCreare.push({ importo: aMonete, metodo: "contanti", account: "portafogliomonete" });
      } else if (sourceAccount === "musigna") {
        if (aCarta > 0) transazioniDaCreare.push({ importo: aCarta, metodo: "contanti", account: "musignacarte" });
        if (aMonete > 0) transazioniDaCreare.push({ importo: aMonete, metodo: "contanti", account: "musignamonete" });
      } else {
        const totale = aCarta + aMonete;
        transazioniDaCreare.push({ importo: totale, metodo: "carta", account: sourceAccount });
      }

      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();

        for (const t of transazioniDaCreare) {
          const dateOnly = date.split("T")[0];
          const change = type === "ingresso" ? t.importo : -t.importo;

          await conn.execute(
            "UPDATE accounts SET balance = balance + ?, updatedat = NOW() WHERE userid=? AND accounttype=?",
            [change, req.userId, t.account]
          );

          const [accountsRows] = await conn.execute(
            "SELECT accounttype, balance FROM accounts WHERE userid=?",
            [req.userId]
          );
          const accountSnapshot = JSON.stringify(accountsRows);

          await conn.execute(
            `INSERT INTO transactions (userid, date, amount, type, paymentmethod, sourceaccount, description, account_snapshot, createdat)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [req.userId, dateOnly, t.importo, type, t.metodo, t.account, description || "", accountSnapshot]
          );
        }

        await conn.commit();
        res.status(201).json({ message: "Transazione creata correttamente" });
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error("Errore creazione transazione:", err);
      res.status(500).json({ error: "Errore creazione transazione" });
    }
  });

  // Delete transaction
  router.delete("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
      const [result] = await pool.execute(
        "DELETE FROM transactions WHERE id = ? AND userid = ?",
        [id, req.userId]
      );

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ error: "Transazione non trovata" });
      }

      res.json({ success: true });
    } catch (err) {
      console.error("Errore eliminazione transazione:", err);
      res.status(500).json({ error: "Errore server" });
    }
  });

  // Update transaction
  router.put("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { date, type, description, sourceAccount, amountCarta, amountMonete } = req.body;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [originalRows] = await conn.execute(
        "SELECT * FROM transactions WHERE id = ? AND userid = ?",
        [id, req.userId]
      );

      if ((originalRows as any).length === 0) {
        await conn.rollback();
        return res.status(404).json({ error: "Transazione non trovata" });
      }

      const original = (originalRows as any)[0];

      // Ripristina balance originale
      const originalChange = original.type === "ingresso" ? -original.amount : original.amount;
      await conn.execute(
        "UPDATE accounts SET balance = balance + ?, updatedat = NOW() WHERE userid = ? AND accounttype = ?",
        [originalChange, req.userId, original.sourceaccount]
      );

      const aCarta = parseFloat(amountCarta) || 0;
      const aMonete = parseFloat(amountMonete) || 0;
      const totalAmount = aCarta + aMonete;

      if (totalAmount <= 0) {
        await conn.rollback();
        return res.status(400).json({ error: "Importo non valido" });
      }

      const mappedSource = DB_SOURCE_MAP[sourceAccount] || sourceAccount;
      const paymentMethod: "carta" | "contanti" = 
        sourceAccount === "portafoglio" || sourceAccount === "musigna" ? "contanti" : "carta";

      const dateOnly = date.split("T")[0];

      // Applica nuovo balance
      const newChange = type === "ingresso" ? totalAmount : -totalAmount;
      await conn.execute(
        "UPDATE accounts SET balance = balance + ?, updatedat = NOW() WHERE userid = ? AND accounttype = ?",
        [newChange, req.userId, mappedSource]
      );

      const [accountsRows] = await conn.execute(
        "SELECT accounttype, balance FROM accounts WHERE userid=?",
        [req.userId]
      );
      const accountSnapshot = JSON.stringify(accountsRows);

      await conn.execute(
        "UPDATE transactions SET date = ?, type = ?, description = ?, sourceaccount = ?, amount = ?, paymentmethod = ?, account_snapshot = ? WHERE id = ?",
        [dateOnly, type, description, mappedSource, totalAmount, paymentMethod, accountSnapshot, id]
      );

      await conn.commit();
      res.json({ success: true });
    } catch (err) {
      await conn.rollback();
      console.error("Errore aggiornamento transazione:", err);
      res.status(500).json({ error: "Errore server" });
    } finally {
      conn.release();
    }
  });

  return router;
};
