import express from "express";
import cors from "cors";
import { z } from "zod";
import fs from "fs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.SECRET || "quicktasks-secret";
const dbFile = "./db.json";

// garante que o arquivo existe
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ users: [], tasks: [] }, null, 2));
}

function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}
function writeDB(data: any) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// --- AUTH ---
app.post("/auth/register", (req, res) => {
  const schema = z.object({ username: z.string(), password: z.string() });
  const { username, password } = schema.parse(req.body);
  const db = readDB();

  if (db.users.find((u: any) => u.username === username))
    return res.status(400).json({ error: "Usuário já existe" });

  const newUser = { id: Date.now(), username, password };
  db.users.push(newUser);
  writeDB(db);
  res.json({ success: true });
});

app.post("/auth/login", (req, res) => {
  const schema = z.object({ username: z.string(), password: z.string() });
  const { username, password } = schema.parse(req.body);
  const db = readDB();
  const user = db.users.find((u: any) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "2h" });
  res.json({ token });
});

// --- AUTH MIDDLEWARE ---
function auth(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Sem token" });
  try {
    const decoded = jwt.verify(header.split(" ")[1], SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// --- TASKS ---
app.get("/tasks", auth, (req: any, res) => {
  const db = readDB();
  const tasks = db.tasks.filter((t: any) => t.userId === req.user.id);
  res.json(tasks);
});

app.post("/tasks", auth, (req: any, res) => {
  const schema = z.object({ title: z.string() });
  const { title } = schema.parse(req.body);
  const db = readDB();
  const newTask = { id: Date.now(), title, done: false, userId: req.user.id };
  db.tasks.push(newTask);
  writeDB(db);
  res.json(newTask);
});

app.patch("/tasks/:id", auth, (req: any, res) => {
  const db = readDB();
  const task = db.tasks.find((t: any) => t.id == req.params.id && t.userId === req.user.id);
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
  task.done = !task.done;
  writeDB(db);
  res.json(task);
});

app.delete("/tasks/:id", auth, (req: any, res) => {
  const db = readDB();
  db.tasks = db.tasks.filter((t: any) => t.id != req.params.id || t.userId !== req.user.id);
  writeDB(db);
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`));
