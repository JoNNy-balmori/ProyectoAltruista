export default async function handler(req, res) {
  // 1. Solo permitimos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const { message } = req.body;

  // 2. Verificación de seguridad
  if (!apiKey) {
    console.error("ERROR: No hay API Key configurada en Vercel.");
    return res.status(500).json({ error: 'Falta la API Key en el servidor' });
  }

  // --- AQUÍ ESTÁ EL CAMBIO ---
  // Creamos el "Prompt Maestro" combinando tus instrucciones con el mensaje del usuario
  const prompt = `Eres un experto en ciberseguridad, no contestes otras preguntas que no sean sobre ciberseguridad, se amable y cordial al momento de corregirlo, ademas contesta de manera corta y concisa. Ayuda al usuario con: "${message}"`;

  try {
    // Usamos el modelo que te funcionó: gemini-2.5-flash-lite
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // En "text" ahora enviamos el "prompt" completo, no solo el "message"
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    // 3. Chequeo de errores de Google
    if (!response.ok) {
      console.error("Error de Google:", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: 'Error al contactar con Gemini', details: data });
    }

    // 4. Extraer respuesta
    const textRespuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude generar respuesta.";
    
    res.status(200).json({ reply: textRespuesta });

  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}