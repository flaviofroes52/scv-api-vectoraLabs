// =======================================================
// 🧩 bdAutentic.js — Model de autenticação (MongoDB)
// =======================================================
import mongoose from "mongoose";
import autenticConn from "../config/autenticBD.js";

// =======================================================
// 🧠 Schema de Usuário
// =======================================================
const userSchema = new mongoose.Schema(
  {
 
    login: { type: String, required: true, trim: true, unique: true },
    senha: { type: String, required: true, trim: true },
  
  },
  {
    versionKey: false,
    collection: "userlogin", // força a coleção exata
  }
);

// =======================================================
// ⚙️ Model vinculado à coleção "userlogin"
// =======================================================
let bdAutenticar;

try {
  bdAutenticar =
    autenticConn.models["userlogin"] ||
    autenticConn.model("userlogin", userSchema, "userlogin");

  console.log("📦 Model de autenticação vinculado à coleção: userlogin");
} catch (err) {
  console.error("💥 Erro ao criar model de autenticação:", err.message);
}

export default bdAutenticar;
