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
// 🌐 CORS — Libera API para LOCAL + VERCEL + GITHUB PAGES
// =======================================================
app.use(
  cors({
    origin: [
      // 🔵 Desenvolvimento local
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
      "http://localhost:5500",
      "http://localhost:5501",

      // 🔵 Backend local
      "http://localhost:3000",

      // 🔵 Aceita QUALQUER domínio no Vercel
      /\.vercel\.app$/,

      // 🔵 Aceita QUALQUER domínio GitHub Pages
      /\.github\.io$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =======================================================
// ⚙️ Middleware padrão
// =======================================================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Formatação de resposta JSON (bonitinho)
app.set("json spaces", 2);

// =======================================================
// 🧩 Conecta banco de dados + Rotas
// =======================================================
bdsrv();        // Conexão com o MongoDB
routes(app);    // Importa e registra todas as rotas

// =======================================================
// 🟢 Inicialização do Servidor
// =======================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SCV rodando na porta ${PORT}`);
});
