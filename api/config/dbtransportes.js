// =======================================================
// ⚙️ Conexão com MongoDB Atlas
// =======================================================
import mongoose from "mongoose";
import "dotenv/config";

async function bdsrv() {
  try {
    const uri = process.env.BDCONNECTION; // ✅ Certifique-se que essa variável está no .env
    if (!uri) {
      throw new Error("❌ A variável de ambiente BDCONNECTION não está definida.");
    }

    await mongoose.connect(uri, {
      dbName: "srv", // nome do banco
    });

    console.log("✅ Conexão com o MongoDB Atlas estabelecida com sucesso!");
    return mongoose.connection;
  } catch (erro) {
    console.error("💥 Erro na conexão com o MongoDB:", erro.message);
    throw erro;
  }
}

export default bdsrv;
