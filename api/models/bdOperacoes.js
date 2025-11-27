// =======================================================
// 🛠️ api/models/operacoes.js — Model de Operações
// =======================================================
import mongoose from "mongoose";

const operacoesSchema = new mongoose.Schema(
  {
    motoristaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "motoristas",
      required: true,
    },

    veiculoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "veiculos",
      required: true,
    },

    inicioAtividade: { type: String, required: true },   // hora
    fimAtividade: { type: String, required: true },      // hora

    // ⭐ AQUI ESTAVA ERRADO — agora consertado
    dataSaida: { type: String, required: false, default: null },

    status: { type: String, default: "Em viagem" },

    // 🔥 CAMPO DA ATIVIDADE — AGORA VAI FUNCIONAR
    atividade: { type: String, required: false, trim: true },

    // Veículo em uso
    emUso: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const dbOperacoes = mongoose.model("operacoes", operacoesSchema);
export default dbOperacoes;
