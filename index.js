const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 Sparkotto Backend is running!");
});

app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
