// =======================================================
import express from "express";
import MotorControll from "../controller/motorControll.js";

const mtRouters = express.Router();

mtRouters.get("/motoristas", MotorControll.exibirMotoristas);
mtRouters.post("/motoristas", MotorControll.criarMotorista);
mtRouters.put("/motoristas/:id", MotorControll.alterarMotorista);
mtRouters.delete("/motoristas/:id", MotorControll.deletarMotorista);
mtRouters.post("/motoristas/:motoristaId/veiculos/:veiculoId", MotorControll.atribuirVeiculoMotorista);

export default mtRouters;

