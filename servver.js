const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Render impose l'utilisation de process.env.PORT
const PORT = process.env.PORT || 3000;

// Route principale (health check)
app.get("/", (req, res) => {
  res.status(200).send("✅ Serveur Convoicar actif");
});

// Route test
app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
