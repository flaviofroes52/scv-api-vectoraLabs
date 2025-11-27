import express from "express";
import VeicControll from "../controller/veicControll.js";

const veicRouters = express.Router();

veicRouters.get("/veiculos", VeicControll.listarVeiculos);
veicRouters.post("/veiculos", VeicControll.criarVeiculo);
veicRouters.put("/veiculos/:id", VeicControll.alterarVeiculo);
veicRouters.delete("/veiculos/:id", VeicControll.deletarVeiculo);
veicRouters.patch("/veiculos/:id/disponivel", VeicControll.alterarDisponibilidade);

export default veicRouters;






