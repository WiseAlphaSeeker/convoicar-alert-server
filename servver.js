const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route de santé (Render aime bien)
app.get("/", (req, res) => {
  res.status(200).send("✅ Serveur d'alerte Convoicar actif");
});

// Petite route test
app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
