import path from "node:path";
import express, { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import patientRoutes from "./routes/patientRoutes";

const app = express();

const fieldLabels: Record<string, string> = {
  name: "nome",
  age: "idade (inteiro de 0 a 130)",
  gender: "gênero",
  recordNumber: "número do prontuário",
  birthDate: "data de nascimento",
  bloodType: "tipo sanguíneo",
  allergies: "alergias",
  unit: "unidade hospitalar",
  bed: "leito",
  admittedOn: "data de admissão",
  careStatus: "situação do atendimento",
  careTeam: "equipe responsável",
};

app.disable("x-powered-by");
app.use(express.json());
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ status: "unavailable" });
    return;
  }
  res.json({ status: "ok" });
});

app.use("/api", patientRoutes);
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});
app.use(express.static(path.join(__dirname, "../public")));

const handleError: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  if (error.type === "entity.parse.failed") {
    res.status(400).json({ error: "JSON inválido." });
    return;
  }
  if (error.type === "entity.too.large") {
    res.status(413).json({ error: "O corpo da requisição excede o limite." });
    return;
  }
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    const fields = error instanceof mongoose.Error.ValidationError ? Object.keys(error.errors) : [error.path];
    const labels = fields.map((field) => fieldLabels[field]).filter(Boolean);
    const message = labels.length
      ? `Revise o preenchimento de ${labels.join(", ")}.`
      : "Dados de cadastro inválidos.";
    res.status(400).json({ error: message });
    return;
  }
  console.error("Falha na API:", error.name);
  res.status(500).json({ error: "Ocorreu um erro interno." });
};

app.use(handleError);

export default app;
