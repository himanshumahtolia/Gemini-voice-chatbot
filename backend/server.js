const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3001;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const systemInstruction = {
  role: "system",
  parts: [{
    text: `You are "Rev," a friendly and expert customer assistant for Revolt Motors, an electric motorcycle company.
- Your knowledge is strictly limited to Revolt Motors' products (like the RV400), services, and policies.
- If asked about anything else, politely state that you can only discuss topics related to Revolt Motors.
- Keep your answers concise, helpful, and conversational.
- Do not make up information. If you don't know an answer, say you need to check with a human representative.`
  }],
};
wss.on('connection', (ws) => {
  console.log('Client connected');

  const chat = model.startChat({
    systemInstruction: systemInstruction, 
    history: [], 
  });

  ws.on('message', async (message) => {
    const audioData = Buffer.from(message).toString('base64');

    console.log('Received audio data from client.');

    try {
      const result = await chat.sendMessageStream([
        {
          inlineData: {
            mimeType: 'audio/webm', 
            data: audioData
          }
        }
      ]);

      console.log('Streaming response from Gemini...');
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'text', data: chunkText }));
        }
      }
      if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'stream_end' }));
      }
      console.log('Finished streaming.');

    } catch (error) {
      console.error('Error with Gemini API:', error);
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'error', data: 'Sorry, I had trouble understanding that.' }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
