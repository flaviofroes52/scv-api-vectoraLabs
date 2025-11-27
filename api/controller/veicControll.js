

import dbVeiculos from "../models/dbVeiculos.js";

// -------------------------------------------------------
// 🔧 Função utilitária — normaliza placa e patrimônio
// -------------------------------------------------------
function limparCampos(dados) {
  // Normaliza placa/patrimônio (string vazia vira NULL)
  if (!dados.placa || dados.placa.trim() === "") dados.placa = null;
  if (!dados.patrimonio || dados.patrimonio.trim() === "") dados.patrimonio = null;

  return dados;
}

class VeicControll {

  // -------------------------------------------------------
  // 📌 LISTAR VEÍCULOS
  // -------------------------------------------------------
  static async listarVeiculos(req, res) {
    try {
      const veiculos = await dbVeiculos.find().sort({ createdAt: -1 });
      res.status(200).json(veiculos);
    } catch (error) {
      res.status(500).json({
        message: "Erro ao listar veículos",
        error: error.message
      });
    }
  }

  // -------------------------------------------------------
  // ➕ CRIAR VEÍCULO — (POST) — **CORRIGIDO**
  // -------------------------------------------------------
  static async criarVeiculo(req, res) {
    try {
      let dados = limparCampos(req.body);

      // ✔ Regra obrigatória: precisa de placa OU patrimônio
      if (!dados.placa && !dados.patrimonio) {
        return res.status(400).json({
          message: "É necessário informar PLACA ou PATRIMÔNIO."
        });
      }

      // ✔ Verificação manual de duplicidade (placa)
      if (dados.placa) {
        const existePlaca = await dbVeiculos.findOne({ placa: dados.placa });
        if (existePlaca) {
          return res.status(400).json({
            message: "Esta placa já está cadastrada."
          });
        }
      }

      // ✔ Verificação manual de duplicidade (patrimônio)
      if (dados.patrimonio) {
        const existePatrimonio = await dbVeiculos.findOne({ patrimonio: dados.patrimonio });
        if (existePatrimonio) {
          return res.status(400).json({
            message: "Este número de patrimônio já está cadastrado."
          });
        }
      }

      const novo = await dbVeiculos.create(dados);
      return res.status(201).json(novo);

    } catch (error) {
      res.status(500).json({
        message: "Erro ao criar veículo",
        error: error.message
      });
    }
  }

  // -------------------------------------------------------
  // ✏ ALTERAR VEÍCULO — (PUT)
  // -------------------------------------------------------
  static async alterarVeiculo(req, res) {
    try {
      const { id } = req.params;
      const dados = limparCampos(req.body);

      // ✔ Verifica duplicidade ao alterar (placa)
      if (dados.placa) {
        const existe = await dbVeiculos.findOne({
          placa: dados.placa,
          _id: { $ne: id }
        });
        if (existe) {
          return res.status(400).json({
            message: "Já existe veículo com esta PLACA."
          });
        }
      }

      // ✔ Verifica duplicidade ao alterar (patrimônio)
      if (dados.patrimonio) {
        const existe = await dbVeiculos.findOne({
          patrimonio: dados.patrimonio,
          _id: { $ne: id }
        });
        if (existe) {
          return res.status(400).json({
            message: "Já existe veículo com este PATRIMÔNIO."
          });
        }
      }

      await dbVeiculos.findByIdAndUpdate(id, dados);

      res.status(200).json({
        message: "Veículo atualizado com sucesso"
      });

    } catch (error) {
      res.status(500).json({
        message: "Erro ao alterar veículo",
        error: error.message
      });
    }
  }

  // -------------------------------------------------------
  // 🗑 EXCLUIR VEÍCULO
  // -------------------------------------------------------
  static async deletarVeiculo(req, res) {
    try {
      const { id } = req.params;

      await dbVeiculos.findByIdAndDelete(id);

      res.status(200).json({
        message: "Veículo excluído"
      });

    } catch (error) {
      res.status(500).json({
        message: "Erro ao excluir veículo",
        error: error.message
      });
    }
  }

  // -------------------------------------------------------
  // 🔄 ALTERNAR DISPONIBILIDADE (PATCH)
  // -------------------------------------------------------
  static async alterarDisponibilidade(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await dbVeiculos.findById(id);

      if (!veiculo) {
        return res.status(404).json({
          message: "Veículo não encontrado"
        });
      }

      veiculo.disponivel = !veiculo.disponivel;
      await veiculo.save();

      res.status(200).json({
        message: `Veículo agora está ${veiculo.disponivel ? "disponível" : "indisponível"}.`,
        veiculo
      });

    } catch (error) {
      res.status(500).json({
        message: "Erro ao alterar disponibilidade",
        error: error.message
      });
    }
  }

}

export default VeicControll;
