import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SigninInputSchema, SignupInputSchema } from "@tradeflow/common";
import { getEnv } from "../config/env";
import { UserModel } from "../models/User";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const parsed = SignupInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const existing = await UserModel.findOne({ email }).lean().exec();
  if (existing) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.create({ email, passwordHash });

  const env = getEnv();
  const token = jwt.sign({ userId: String(user._id) }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
  return res.status(201).json({ token });
});

authRouter.post("/signin", async (req, res) => {
  const parsed = SigninInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const user = await UserModel.findOne({ email }).exec();
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const env = getEnv();
  const token = jwt.sign({ userId: String(user._id) }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
  return res.json({ token });
});

