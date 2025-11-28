// =======================================================
// 🚀 api/app.js — Configuração principal do servidor SCV
// =======================================================
import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import bdsrv from "./config/dbtransportes.js";

const app = express();

// =======================================================
// 🌐 CORS — Liberação de acesso (Frontend local e deploy)
// =======================================================
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
      "http://localhost:5500",
      "http://localhost:5501",
      "http://localhost:3000",
      "https://scv.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// =======================================================
// ⚙️ Configuração básica do servidor
// =======================================================
app.use(express.json());
app.set("json spaces", 2);

// =======================================================
// 🧩 Conecta banco e rotas
// =======================================================
bdsrv();
routes(app);

// =======================================================
// 🟢 Inicialização do servidor (Render + Local)
// =======================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SCV rodando na porta ${PORT}`);
});
git 