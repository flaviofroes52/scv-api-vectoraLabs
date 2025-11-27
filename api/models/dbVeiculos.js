// =======================================================
// 🚗 api/models/veiculos.js — Schema NOVO e LIVRE
// =======================================================
import mongoose from "mongoose";

const veiculosSchema = new mongoose.Schema(
  {
    veiculo: { type: String, required: true },
    marca: { type: String, required: true },
    ano: { type: Number, required: true },
    cor: { type: String, required: true },

    // 🚫 SEM default, SEM unique, SEM sparse
    placa: {
      type: String,
      trim: true
    },

    patrimonio: {
      type: String,
      trim: true
    },

    disponivel: { type: Boolean, default: true },
    imagemveiculo: { type: String },
    cargaPerigosa: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// 🚫 SEM ÍNDICES ADICIONAIS
// Nada de unique
// Nada de sparse

const dbVeiculos = mongoose.model("veiculos", veiculosSchema);
export default dbVeiculos;
