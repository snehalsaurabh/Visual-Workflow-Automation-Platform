import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";

type JwtPayload = { userId: string };

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = header.slice("Bearer ".length);
  const env = getEnv();

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (!decoded?.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

