// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); 


const app = express();
const PORT = 3000;

// ใส่ Line Notify Token ของคุณที่นี่
const LINE_NOTIFY_TOKEN = 'Lg7AIlk4vpDCsTF4Wm8VgiEW84uwxvs2s2kYi9oECZi';

// ใช้ CORS กับทุกคำขอ
app.use(cors({
  origin: 'http://localhost:8080' // อนุญาตคำขอจาก localhost:8080
}));

app.use(bodyParser.json());

app.post('/send-notify', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post('https://notify-api.line.me/api/notify', 
      `message=${encodeURIComponent(message)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
        }
      }
    );

    if (response.status === 200) {
      res.status(200).json({ success: true, message: 'Notification sent successfully' });
    } else {
      res.status(response.status).json({ success: false, message: 'Failed to send notification' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
