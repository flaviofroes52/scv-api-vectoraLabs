// =======================================================
// 🔐 api/routes/autenticRoutes.js
// =======================================================
import express from "express";
import AutenticController from "../controller/autenticControll.js";

const autenticRouter = express.Router();

// 🟢 Registrar novo usuário
autenticRouter.post("/validacao/registrar", AutenticController.registrarUsuario);

// 🔵 Autenticar login
autenticRouter.post("/validacao/login", AutenticController.autenticarUsuario);

// 🟡 Listar todos os usuários (admin)
autenticRouter.get("/validacao/usuarios", AutenticController.listarUsuarios);

// ✏️ Alterar senha do usuário (PUT)
autenticRouter.put("/validacao/:id", AutenticController.alterarSenha);

// 🔴 Excluir usuário
autenticRouter.delete("/validacao/:id", AutenticController.excluirUsuario);

export default autenticRouter;
