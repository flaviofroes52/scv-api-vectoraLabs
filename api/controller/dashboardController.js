// =======================================================
// 📊 dashboardController.js — Dados para o Dashboard
// =======================================================

import dbMotoristas from "../models/dbMotoristas.js";
import dbVeiculos from "../models/dbVeiculos.js";

class DashboardController {

  // =====================================================
  // 📌 Retorna dados do dashboard (por usuário logado)
  // =====================================================
  static async carregarDashboard(req, res) {
    try {
      // Usuario vem da query:  /api/dashboard?user=FLAVIO
      const usuario = req.query.user;

      if (!usuario) {
        return res.status(400).json({
          status: "erro",
          message: "Usuário não informado para o dashboard."
        });
      }

      // =====================================================
      // 🔵 Motoristas — TODOS (pois são dados públicos)
      // =====================================================
      const motoristas = await dbMotoristas.find().lean();

      // =====================================================
      // 🚗 Veículos — TODOS (dashboard mostra a frota completa)
      // =====================================================
      const veiculos = await dbVeiculos.find().lean();

      // =====================================================
      // 🔥 Status da frota (Chart.js + Resumo)
      // =====================================================
      const total = veiculos.length;
      const livres = veiculos.filter(v => v.disponivel === true).length;
      const emUso = veiculos.filter(v => v.disponivel === false).length;
      const avariados = veiculos.filter(v => v.situacao === "avariado").length || 0;

      return res.status(200).json({
        status: "ok",
        usuario,         // devolve qual usuário está carregando
        totalVeiculos: total,
        livres,
        emUso,
        avariados,
        motoristas,
        veiculos
      });

    } catch (erro) {
      console.error("❌ Erro no dashboard:", erro);
      return res.status(500).json({
        status: "erro",
        message: "Erro ao carregar dados do dashboard."
      });
    }
  }

}

export default DashboardController;
