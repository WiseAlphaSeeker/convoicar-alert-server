const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route principale (Render health check)
app.get("/", (req, res) => {
  res.send("✅ Serveur d’alerte Convoicar actif");
});

// Endpoint mobile (pour laisser la page ouverte sur Huawei)
app.get("/mobile", (req, res) => {
  res.send("📱 Connexion mobile active – alertes prêtes");
});

// Endpoint test alerte
app.get("/alert", (req, res) => {
  console.log("🚨 Alerte envoyée !");
  res.json({ success: true, message: "Alerte déclenchée" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
