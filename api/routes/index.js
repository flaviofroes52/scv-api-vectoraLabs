// =======================================================
// 🚦 index.js — Central de rotas
// =======================================================
import mtRouters from "./motoRoutes.js";
import veicRouters from "./veicRoutes.js";
import autenticRouter from "./autenticRoutes.js";
import dashboardRouter from "./dashboardRoutes.js";
import operaRouter from "./operaRouter.js";   // 👈 ADICIONADO

const routes = (app) => {
  // 🌐 Rota raiz
  app.route("/").get((_, res) => {
    res.status(200).send("🚀 Bem-vindo ao Sistema de Gestão de Veículos (SCV)!");
  });

  // 🚗 Rotas principais
  app.use("/api", mtRouters);          // motoristas
  app.use("/api", veicRouters);        // veículos
  app.use("/api", autenticRouter);     // autenticação
  app.use("/api/dashboard", dashboardRouter);

  // 🛠️ Rotas de Operações
  app.use("/api/operacoes", operaRouter);   // 👈 AQUI ESTÁ
};

export default routes;
