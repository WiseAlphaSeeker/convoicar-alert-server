const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route racine (Render health check)
app.get("/", (req, res) => {
  res.status(200).send("✅ Serveur Convoicar actif");
});

// Petite route test
app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
