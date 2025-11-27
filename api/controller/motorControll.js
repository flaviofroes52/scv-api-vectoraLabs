// =======================================================
// 🚘 Controller — Motoristas
// =======================================================
// =======================================================
// 🚘 Controller — Motoristas
// =======================================================
import dbMotoristas from "../models/dbMotoristas.js";
import dbVeiculos from "../models/dbVeiculos.js"; // ✅ import corrigido e funcional

class MotorControll {
  // =======================================================
  // 👁️ Listar todos os motoristas
  // =======================================================
  static async exibirMotoristas(req, res) {
    try {
      const motoristas = await dbMotoristas.find().populate("veiculos");
      res.status(200).json(motoristas);
    } catch (error) {
      res.status(500).json({
        message: "Erro ao listar motoristas",
        error: error.message,
      });
    }
  }

  // =======================================================
  // ➕ Criar motorista
  // =======================================================
  static async criarMotorista(req, res) {
    try {
      const novo = new dbMotoristas(req.body);
      await novo.save();
      res
        .status(201)
        .json({ message: "✅ Motorista cadastrado com sucesso!", motorista: novo });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao criar motorista",
        error: error.message,
      });
    }
  }

  // =======================================================
  // ✏️ Alterar motorista
  // =======================================================
  static async alterarMotorista(req, res) {
    try {
      const { id } = req.params;
      await dbMotoristas.findByIdAndUpdate(id, req.body);
      res.status(200).json({ message: "✅ Motorista atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao atualizar motorista",
        error: error.message,
      });
    }
  }

  // =======================================================
  // 🗑️ Deletar motorista
  // =======================================================
  static async deletarMotorista(req, res) {
    try {
      const { id } = req.params;
      await dbMotoristas.findByIdAndDelete(id);
      res.status(200).json({ message: "🗑️ Motorista excluído com sucesso!" });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao excluir motorista",
        error: error.message,
      });
    }
  }

  // =======================================================
  // 🚗 Atribuir veículo a motorista
  // =======================================================
  static async atribuirVeiculoMotorista(req, res) {
    try {
      const { motoristaId, veiculoId } = req.params;

      const motorista = await dbMotoristas.findById(motoristaId);
      if (!motorista) {
        return res.status(404).json({ message: "Motorista não encontrado" });
      }

      const veiculo = await dbVeiculos.findById(veiculoId);
      if (!veiculo) {
        return res.status(404).json({ message: "Veículo não encontrado" });
      }

      // Adiciona o veículo ao motorista e salva
      motorista.veiculos.push(veiculo._id);
      await motorista.save();

      res.status(200).json({
        message: "🚗 Veículo atribuído ao motorista com sucesso!",
        motorista,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao atribuir veículo",
        error: error.message,
      });
    }
  }
}

// ✅ exportação no final
export default MotorControll;
