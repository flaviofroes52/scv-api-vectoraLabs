// =======================================================
// 🛠️ api/controllers/OperacoesController.js
// =======================================================

import dbOperacoes from "../models/bdOperacoes.js";
import dbVeiculos from "../models/dbVeiculos.js";
import dbMotoristas from "../models/dbMotoristas.js";

class OperacoesController {

  // =====================================================
  // 🔵 1. Criar uma nova operação (INICIAR USO DO VEÍCULO)
  // =====================================================
  static async iniciarOperacao(req, res) {
    try {
      const {
        motoristaId,
        veiculoId,
        inicioAtividade,
        fimAtividade,
        dataSaida,
        atividade,
        status
      } = req.body;

      // Verifica se o motorista existe
      const motorista = await dbMotoristas.findById(motoristaId);
      if (!motorista) {
        return res.status(404).json({ erro: "Motorista não encontrado." });
      }

      // Verifica se o veículo existe
      const veiculo = await dbVeiculos.findById(veiculoId);
      if (!veiculo) {
        return res.status(404).json({ erro: "Veículo não encontrado." });
      }

      // Veículo precisa estar disponível
      if (!veiculo.disponivel) {
        return res.status(400).json({ erro: "Veículo já está em uso." });
      }

      // =====================================================
      // 🔥 REGRA: dataSaida obrigatória SOMENTE p/ caminhão/carreta
      // =====================================================
      const nomeVei = veiculo.veiculo?.toLowerCase() || "";

      const ehCaminhao =
        nomeVei.includes("caminhao") || nomeVei.includes("caminhão");

      const ehCarreta =
        nomeVei.includes("carreta");

      if ((ehCaminhao || ehCarreta) && !dataSaida) {
        return res.status(400).json({
          erro: "Data de saída é obrigatória para caminhão/carreta em viagem."
        });
      }

      // Se NÃO for caminhão/carreta → força dataSaida = null
      let dataFinal = dataSaida || null;

      // =====================================================
      // 🚚 Marcar veículo como indisponível
      // =====================================================
      veiculo.disponivel = false;
      await veiculo.save();

      // =====================================================
      // 📝 Registrar operação
      // =====================================================
      const novaOperacao = await dbOperacoes.create({
        motoristaId,
        veiculoId,
        inicioAtividade,
        fimAtividade,
        dataSaida: dataFinal,
        atividade,
        status: status || "Em uso",
        emUso: true
      });

      return res.status(201).json({
        mensagem: "Operação iniciada com sucesso.",
        operacao: novaOperacao
      });

    } catch (erro) {
      return res.status(500).json({
        erro: "Erro ao iniciar operação.",
        detalhes: erro.message
      });
    }
  }

 // =====================================================
// 🔴 2. Finalizar operação (LIBERAR VEÍCULO)
// =====================================================
static async finalizarOperacao(req, res) {
  try {
    const { id } = req.params;

    // Buscar operação existente
    const operacao = await dbOperacoes.findById(id);
    if (!operacao) {
      return res.status(404).json({ erro: "Operação não encontrada." });
    }

    // Marcar operação como encerrada
    operacao.emUso = false;
    operacao.status = "Finalizada";
    await operacao.save();

    // Liberar veículo vinculado
    const veiculo = await dbVeiculos.findById(operacao.veiculoId);
    if (veiculo) {
      veiculo.disponivel = true;
      await veiculo.save();
    }

    // 🔥 REGRA EXTRA DE SEGURANÇA:
    // Se existir qualquer outra operação marcada como "emUso:true" para o MESMO veículo,
    // zeramos elas também (evita bugs de painel travado)
    await dbOperacoes.updateMany(
      { veiculoId: operacao.veiculoId, emUso: true },
      { $set: { emUso: false, status: "Finalizada" } }
    );

    return res.json({
      mensagem: "Operação finalizada e veículo liberado.",
      veiculoAtualizado: veiculo?._id
    });

  } catch (erro) {
    return res.status(500).json({
      erro: "Erro ao finalizar operação.",
      detalhes: erro.message
    });
  }
}


  // =====================================================
  // 🔍 3. Listar operações em uso (PAINEL VEÍCULOS EM USO)
  // =====================================================
  static async listarEmUso(req, res) {
    try {
      const operacoes = await dbOperacoes
        .find({ emUso: true })
        .populate("motoristaId")
        .populate("veiculoId");

      return res.json(operacoes);

    } catch (erro) {
      return res.status(500).json({
        erro: "Erro ao listar operações em uso.",
        detalhes: erro.message
      });
    }
  }

  // =====================================================
  // 📜 4. Listar histórico completo
  // =====================================================
  static async listarHistorico(req, res) {
    try {
      const historico = await dbOperacoes
        .find()
        .sort({ createdAt: -1 })
        .populate("motoristaId")
        .populate("veiculoId");

      return res.json(historico);

    } catch (erro) {
      return res.status(500).json({
        erro: "Erro ao carregar histórico.",
        detalhes: erro.message
      });
    }
  }

  // =====================================================
  // 🔎 5. Obter uma operação específica pelo ID
  // =====================================================
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const operacao = await dbOperacoes
        .findById(id)
        .populate("motoristaId")
        .populate("veiculoId");

      if (!operacao) {
        return res.status(404).json({ erro: "Operação não encontrada." });
      }

      return res.json(operacao);

    } catch (erro) {
      return res.status(500).json({
        erro: "Erro ao buscar operação.",
        detalhes: erro.message
      });
    }
  }
}

export default OperacoesController;
