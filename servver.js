const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ IMPORTANT pour Render
const PORT = process.env.PORT || 3000;

/**
 * Route de test (Render vérifie souvent si le service répond)
 */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Serveur d’alerte Convoicar actif 🚗🚨"
  });
});

/**
 * Exemple de route pour alerte (à adapter plus tard)
 */
app.post("/alert", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    console.log("📢 Alerte reçue :", message);

    // Ici tu pourras brancher :
    // - Telegram
    // - WhatsApp
    // - Email
    // - Push mobile

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur alerte :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * Lancement du serveur
 */
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
