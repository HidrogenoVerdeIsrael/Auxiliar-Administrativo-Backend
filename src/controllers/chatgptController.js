const axios = require('axios');

const callChatGPT = async (req, res) => {
  const { question, role } = req.body;
  const prompt = question || 'Hola, ¿cómo puedo ayudarte hoy?';
  const systemMessage = role ? `El rol de la IA es: ${role}. ${prompt}` : prompt;


  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: systemMessage }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    
    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error al comunicarse con ChatGPT:', error);
    res.status(500).json({ error: 'Error al comunicarse con ChatGPT' });
  }
};

//Crear Gpt personalizados
/* const createGpt = async (req, res) => {
  const { nombregpt, descripcion, idusuario } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO descripcion_ia (nombre_gpt, descripcion) VALUES ($1, $2, $3) RETURNING *',
      [nombregpt, descripcion, idusuario]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear GPT personalizado:', error);
    res.status(500).json({ error: 'Error al crear GPT personalizado' });
  }
}; */

module.exports = callChatGPT;
