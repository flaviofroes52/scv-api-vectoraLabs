// =======================================================
// 🛠️ api/routes/operaRouter.js — Rotas de Operações
// =======================================================

import express from "express";
import OperacoesController from "../controller/operaControll.js";

const operaRouter = express.Router();

// -------------------------------------------------------
// 🟢 INICIAR OPERAÇÃO
// POST /api/operacoes/iniciar
// -------------------------------------------------------
operaRouter.post("/iniciar", OperacoesController.iniciarOperacao);

// -------------------------------------------------------
// 🔴 FINALIZAR OPERAÇÃO
// PUT /api/operacoes/finalizar/:id
// -------------------------------------------------------
operaRouter.put("/finalizar/:id", OperacoesController.finalizarOperacao);

// -------------------------------------------------------
// 🔍 LISTAR OPERAÇÕES EM USO
// GET /api/operacoes/emuso
// -------------------------------------------------------
operaRouter.get("/emuso", OperacoesController.listarEmUso);

// -------------------------------------------------------
// 📜 LISTAR TODO HISTÓRICO
// GET /api/operacoes/historico
// -------------------------------------------------------
operaRouter.get("/historico", OperacoesController.listarHistorico);

// -------------------------------------------------------
// 🔎 BUSCAR OPERAÇÃO PELO ID
// GET /api/operacoes/:id
// -------------------------------------------------------
operaRouter.get("/:id", OperacoesController.buscarPorId);

export default operaRouter;
