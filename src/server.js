const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const callChatGPT = require('./controllers/chatgptController');
require('dotenv').config();
const axios = require('axios');
const twilio = require('twilio');
const { config } = require('dotenv');
const cookieParser = require('cookie-parser');
const verifyTokenRoutes = require('./routes/verifyTokenRoutes'); 

const app = express();
app.use(cookieParser());
const port = 3001;
config()

app.use(cors({
  origin : ['http://localhost:5173'],
  credentials:true
}));
app.use(express.json());

app.post('/token', async (req, res) => {
  const { accessToken } = req.body;

  console.log('Token:', accessToken); 

  try {
      const response = await axios.get(`https://graph.facebook.com/v16.0/oauth/access_token`, {
        params: {
            grant_type: 'fb_exchange_token',
            client_id: '889248829927700',
            client_secret: 'b862f9f09d59f6edc0577f0f866d8b19',
            fb_exchange_token: accessToken
          }
      });

      const longLivedToken = response.data.access_token;
      console.log(longLivedToken);
      

      if (longLivedToken) {
          res.json({ longLivedToken });
          console.log('Long-Lived Token:', longLivedToken);
      } else {
          res.status(500).json({ error: 'No se pudo obtener el long-lived token' });
      } 
  } catch (error) {
      console.error('Error al obtener el long-lived token:', error);
      res.status(500).json({ error: 'Error al intercambiar el token' });
  } 
});


//twilio

const client =twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

app.post('/sms', async (req, res) => {
    const { to, message } = req.body;
    console.log('to:', to, 'message:', message); 

    if (!to || !message) {
        return res.status(400).json({ error: 'El número de teléfono y el mensaje son obligatorios.' });
    }

    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,//hay que comprar el numero 
            to: to//numero a enviar el mensaje
        })
        res.status(200).json({ success: true, message: 'SMS enviado', response })
    } catch (error) {
        console.error('Error al enviar el SMS:', error);
        res.status(500).json({ success:false, error: 'Error al enviar el SMS' });
    }
});

//chatgpt
app.post('/chatgpt', callChatGPT)

app.use('/app', verifyTokenRoutes)


app.use('/', userRoutes); 
app.listen(port, async() => {
    console.log(`Server running on port ${port}`);
});
