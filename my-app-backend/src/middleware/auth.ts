import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateToken = ( req: AuthRequest, res: Response, next: NextFunction ) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";

  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Token non valido" });
    }
    req.userId = decoded.userId;
    next();
  });
};
