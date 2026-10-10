import express, { Request, Response, Application } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = 7989;
const JWT_SECRET = process.env.JWT_SECRET || "eventia-secret";

// ✨ Route Login
app.post("/login", (async function loginHandler(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, role: "user" },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    return res.json({ token, user: { fullName: user.fullName, email: user.email, password: user.password } });
}) as unknown as express.RequestHandler);

// ✨ Route protégée /profile
app.get("/profile", (async function profileHandler(req: Request, res: Response): Promise<Response> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });

    return res.json({ user: { id: user?.id, email: user?.email, fullName: user?.fullName, password: user?.password } });
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
}) as unknown as express.RequestHandler);

// ✨ Route protégée /admin/contract.enc
app.get("/admin/contract.enc", (async function contractDownloadHandler(req: Request, res: Response) {
  try {
    const filePath = path.join(__dirname, "../data/contract.enc");
    if (fs.existsSync(filePath)) {
      res.download(filePath, "contract.enc");
    } else {
      res.status(404).json({ message: "Encrypted contract not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while fetching contract." });
  }
}) as unknown as express.RequestHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
