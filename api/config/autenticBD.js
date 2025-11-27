import mongoose from "mongoose";
import "dotenv/config";

const autenticConn = mongoose.createConnection(process.env.BDAUTENTIC, {
  serverSelectionTimeoutMS: 10000,
  tls: true,
  tlsAllowInvalidCertificates: true,
  family: 4,
});

autenticConn.on("connected", () => {
  console.log("✅ Conectado ao banco de autenticação!");
});

autenticConn.on("error", (erro) => {
  console.error("💥 Erro na conexão com o banco de autenticação:", erro.message);
});

export default autenticConn;
