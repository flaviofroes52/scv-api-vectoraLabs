// =======================================================
// 📊 dashboardRoutes.js — Rotas do Dashboard
// =======================================================

import express from "express";
import DashboardController from "../controller/dashboardController.js";

const dashboardRouter = express.Router();

// 🔵 Carregar dados do dashboard
dashboardRouter.get("/", DashboardController.carregarDashboard);

export default dashboardRouter;
