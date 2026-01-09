// Archivo: api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const { message } = req.body; // Esto coincide con tu: JSON.stringify({ message: userMessage })

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
    });

    const data = await response.json();

    // AQUÍ ESTÁ LA MAGIA:
    // Extraemos solo el texto limpio de la respuesta de Gemini
    const textRespuesta = data.candidates[0]?.content?.parts[0]?.text || "No entendí eso.";

    // Devolvemos el objeto con la propiedad 'reply' que tu frontend espera
    res.status(200).json({ reply: textRespuesta });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Hubo un error en el servidor." });
  }
}