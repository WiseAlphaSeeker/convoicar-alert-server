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

// Route test mobile
app.get("/mobile", (req, res) => {
  res.send("📱 Connexion mobile active - alertes prêtes");
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
