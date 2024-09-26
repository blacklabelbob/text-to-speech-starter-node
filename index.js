const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { Deepgram } = require('@deepgram/sdk');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initialize Deepgram SDK
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

// API endpoint to handle text-to-speech requests
app.post('/api', async (req, res) => {
  const { model, text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await deepgram.tts.synthesize({
      model,
      text,
    });

    if (response && response.audio_url) {
      res.json({ audioUrl: response.audio_url });
    } else {
      res.status(500).json({ error: 'Failed to synthesize text' });
    }
  } catch (error) {
    console.error('Error synthesizing text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
