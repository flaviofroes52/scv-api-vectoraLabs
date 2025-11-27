// =======================================================
// 🟦 usuarioLogado.js — Middleware de usuário autenticado
// =======================================================

import dbAutenticar from "../models/bdAutentic.js";

export default async function usuarioLogado(req, res, next) {
  try {
    // 🔍 Pegamos o email enviado nos headers
    const emailUsuario = req.headers["authorization"];

    if (!emailUsuario) {
      return res.status(401).json({
        status: "erro",
        message: "Acesso negado. Nenhum usuário autenticado."
      });
    }

    // 🔎 Procurar no banco
    const usuario = await dbAutenticar.findOne({ login: emailUsuario });

    if (!usuario) {
      return res.status(403).json({
        status: "erro",
        message: "Usuário não encontrado ou não autorizado."
      });
    }

    // 🔥 Injeta o usuário na requisição
    req.usuario = usuario;

    // Continua para o controller
    next();

  } catch (erro) {
    console.error("❌ Erro no middleware usuarioLogado:", erro);
    return res.status(500).json({ message: "Erro interno." });
  }
}
