const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Permitir JSON e servir arquivos estáticos
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Rota para salvar dados
app.post("/salvar", (req, res) => {
  const dados = req.body;

  fs.writeFile("data.json", JSON.stringify(dados, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar:", err);
      return res.status(500).json({ erro: "Falha ao salvar" });
    }
    console.log("✅ Dados salvos com sucesso!");
    res.redirect("/success.html");

  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
