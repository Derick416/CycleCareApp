const express = require('express');
const cors = require('cors');
const { ServerClient } = require('postmark');
const dotenv = require('dotenv');

dotenv.config();

const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;
const POSTMARK_FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL;
const PORT = process.env.PORT || 3000;

if (!POSTMARK_API_TOKEN || !POSTMARK_FROM_EMAIL) {
  console.error('Missing Postmark configuration. Set POSTMARK_API_TOKEN and POSTMARK_FROM_EMAIL in .env.');
  process.exit(1);
}

const client = new ServerClient(POSTMARK_API_TOKEN);
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CycleCare Postmark backend is running');
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, text' });
  }

  try {
    await client.sendEmail({
      From: POSTMARK_FROM_EMAIL,
      To: to,
      Subject: subject,
      TextBody: text,
      HtmlBody: html || text.replace(/\n/g, '<br/>'),
      Tag: 'cyclecare-reminder',
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Postmark sendEmail error:', error);
    return res.status(500).json({ error: 'Unable to send email through Postmark' });
  }
});

app.listen(PORT, () => {
  console.log(`CycleCare backend listening on http://localhost:${PORT}`);
});
