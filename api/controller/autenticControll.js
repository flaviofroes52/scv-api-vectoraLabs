// =======================================================
// 🔐 AutenticController — Controle de Login e Registro (SCV)
// =======================================================

import bcrypt from "bcrypt";
import bdAutenticar from "../models/bdAutentic.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

class AutenticController {
  // =======================================================
  // 🟢 Criar novo usuário
  // =======================================================
  static async registrarUsuario(req, res) {
    try {
      let { login, senha, email } = req.body;

      if (!login || !senha) {
        return res.status(400).json({
          message: "⚠️ Campos obrigatórios: login e senha."
        });
      }

      login = login.trim().toLowerCase();

      if (senha.length < 6) {
        return res.status(400).json({
          message: "⚠️ A senha deve ter pelo menos 6 caracteres."
        });
      }

      const existe = await bdAutenticar.findOne({ login });
      if (existe) {
        return res.status(409).json({
          message: "⚠️ Usuário já cadastrado."
        });
      }

      const senhaCript = await bcrypt.hash(senha, 10);

      const novoUser = await bdAutenticar.create({
        login,
        senha: senhaCript,
        email
      });

      res.status(201).json({
        message: "✅ Usuário cadastrado com sucesso!",
        usuario: { id: novoUser._id, login: novoUser.login }
      });

    } catch (erro) {
      res.status(500).json({
        message: "❌ Erro ao cadastrar usuário.",
        erro: erro.message
      });
    }
  }

  // =======================================================
  // 🟡 Listar usuários (sem senha)
  // =======================================================
  static async listarUsuarios(req, res) {
    try {
      const usuarios = await bdAutenticar.find({}, "-senha");
      res.status(200).json(usuarios);

    } catch (erro) {
      res.status(500).json({
        message: "❌ Erro ao listar usuários.",
        erro: erro.message
      });
    }
  }

  // =======================================================
  // 🔵 Autenticar login
  // =======================================================
  static async autenticarUsuario(req, res) {
    try {
      let { login, senha } = req.body;

      if (!login || !senha) {
        return res.status(400).json({
          message: "⚠️ Informe login e senha."
        });
      }

      login = login.trim().toLowerCase();

      const usuario =
        (await bdAutenticar.findOne({ login })) ||
        (await bdAutenticar.findOne({ email: login }));

      if (!usuario) {
        return res.status(401).json({
          message: "🚫 Usuário não encontrado."
        });
      }

      let senhaCorreta = false;

      if (usuario.senha.startsWith("$2")) {
        senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      } else {
        senhaCorreta = senha === usuario.senha;
      }

      if (!senhaCorreta) {
        return res.status(401).json({
          message: "🚫 Senha incorreta."
        });
      }

      const { senha: _, ...usuarioSemSenha } = usuario.toObject();

      res.status(200).json({
        message: "✅ Autenticação bem-sucedida!",
        usuario: usuarioSemSenha
      });

    } catch (erro) {
      res.status(500).json({
        message: "❌ Erro ao autenticar usuário.",
        erro: erro.message
      });
    }
  }

  // =======================================================
  // ✏️ PUT — Alterar Senha do Usuário + Enviar e-mail
  // =======================================================
  static async alterarSenha(req, res) {
    try {
      const { id } = req.params;
      const { senha } = req.body;

      if (!senha) {
        return res.status(400).json({
          message: "⚠️ Informe a nova senha."
        });
      }

      if (senha.length < 6) {
        return res.status(400).json({
          message: "⚠️ A nova senha deve ter no mínimo 6 caracteres."
        });
      }

      const senhaCript = await bcrypt.hash(senha, 10);

      const usuarioAtualizado = await bdAutenticar.findByIdAndUpdate(
        id,
        { senha: senhaCript },
        { new: true }
      );

      if (!usuarioAtualizado) {
        return res.status(404).json({
          message: "⚠️ Usuário não encontrado."
        });
      }

      // =======================================================
      // 📧 Enviar aviso de troca de senha por e-mail
      // =======================================================
      if (usuarioAtualizado.email) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.SENHA
            }
          });

          const mailOptions = {
            from: `"SCV - Sistema de Cadastros" <${process.env.EMAIL}>`,
            to: usuarioAtualizado.email,
            subject: "🔐 Sua senha foi alterada",
            html: `
              <h2>Olá, ${usuarioAtualizado.login}!</h2>
              <p>A sua senha foi <strong>alterada com sucesso</strong> no sistema SCV.</p>
              <p>Se você não reconhece esta ação, altere sua senha novamente imediatamente.</p>
              <br>
              <small>Mensagem automática — favor não responder.</small>
            `
          };

          await transporter.sendMail(mailOptions);
        } catch (erroEmail) {
          console.error("❌ Erro ao enviar e-mail:", erroEmail);
        }
      }

      res.status(200).json({
        message: "🔐 Senha alterada com sucesso! E-mail enviado (se disponível)."
      });

    } catch (erro) {
      res.status(500).json({
        message: "❌ Erro ao alterar senha.",
        erro: erro.message
      });
    }
  }

  // =======================================================
  // 🔴 Excluir usuário
  // =======================================================
  static async excluirUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await bdAutenticar.findByIdAndDelete(id);

      if (!usuario) {
        return res.status(404).json({
          message: "⚠️ Usuário não encontrado."
        });
      }

      res.status(200).json({
        message: "🗑️ Usuário removido com sucesso."
      });

    } catch (erro) {
      res.status(500).json({
        message: "❌ Erro ao excluir usuário.",
        erro: erro.message
      });
    }
  }
}

export default AutenticController;
