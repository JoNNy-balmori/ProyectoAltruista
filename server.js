require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ ERROR: No se encontró la API KEY en el archivo .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    // Asegúrate que tu archivo HTML se llame index.html
    res.sendFile(__dirname + '/index.html');
});

app.post('/ask-gemini', async (req, res) => {
    try {
        console.log("📩 Mensaje recibido:", req.body.message);
        
        // Usamos la versión específica 001, que suele ser más estable
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `Eres un experto en ciberseguridad, no contestes otras preguntas que no sean sobre ciberseguridad, se amable y cordial al momento de corregirlo, ademas contesta de manera corta y concisa. Ayuda al usuario con: "${req.body.message}"`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ Respuesta enviada al chat.");
        res.json({ reply: text });

    } catch (error) {
        console.error("❌ ERROR DEL SERVIDOR:", error);
        // Esto enviará el error exacto al navegador para que podamos verlo si falla
        res.status(500).json({ reply: "Error interno. Mira la terminal del servidor." });
    }
});

app.listen(port, () => {
    console.log(`✅ Servidor listo en http://localhost:${port}`);
});