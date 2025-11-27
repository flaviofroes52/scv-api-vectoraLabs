/// =======================================================
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
      "http://127.0.0.1:5500", // Live Server padrão
      "http://127.0.0.1:5501", // Live Server (porta alternativa)
      "http://localhost:5500", // variação
      "http://localhost:5501", // variação
      "http://localhost:3000", // backend local
      "https://scv.vercel.app", // domínio do deploy (ajuste depois)
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
// 🟢 Inicialização do servidor
// =======================================================
/* const porta = process.env.PORTA || 3000;
const end = process.env.END || "http://localhost";

app.listen(porta, () => {
  console.log(`✅ Servidor rodando em: ${end}:${porta}`);
});
app.use(express.static("public")); */

export default app;
