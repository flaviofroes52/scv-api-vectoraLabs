// =======================================================
// 🚚 api/models/motoristas.js — Model de Motoristas (CORRETO)
// =======================================================
import mongoose from "mongoose";

const motoristasSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },

    cpf: { type: String, required: true, unique: true },

    telefone: { type: String, required: true },

    // ✔ CAMPO CORRETO (o backend realmente usa cnh)
    cnh: { type: String, required: true, unique: true },

    // ✔ CAMPO CORRETO (usado no seu backend e no controller)
    categoria: { type: String, required: true },

    // ✔ ativo do motorista
    ativo: { type: Boolean, default: true },

    // ✔ Foto em Base64
    imagemMotorista: { type: String },

    // ✔ CAMPO CORRETO (infoAdicionais — sem cedilha e minúsculo)
    infoAdicionais: { type: String, trim: true },

    // ➕ Se quiser vincular veículos ao motorista (já existe no controller)
    veiculos: [
      { type: mongoose.Schema.Types.ObjectId, ref: "veiculos" }
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const dbMotoristas = mongoose.model("motoristas", motoristasSchema);
export default dbMotoristas;
