const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let clients = new Map();
let previousCourses = new Set();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Convoicar Alert Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .card {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        h1 { margin: 0 0 20px 0; }
        .status { 
          display: inline-block;
          padding: 10px 20px;
          background: #4ade80;
          border-radius: 20px;
          font-weight: bold;
        }
        .info { margin-top: 20px; line-height: 1.8; }
        code {
          background: rgba(0,0,0,0.3);
          padding: 2px 8px;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🚗 Convoicar Alert Server</h1>
        <div class="status">✅ Serveur actif</div>
        
        <div class="info">
          <p><strong>📊 Statistiques :</strong></p>
          <p>• Clients connectés : ${clients.size}</p>
          <p>• Courses surveillées : ${previousCourses.size}</p>
          
          <p style="margin-top: 30px;"><strong>📱 Pour recevoir les alertes :</strong></p>
          <p>Ouvre cette URL sur ton Huawei :<br>
          <code>${req.protocol}://${req.get('host')}/mobile</code></p>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/mobile', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Convoicar Alerts</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          padding: 20px;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .icon { font-size: 60px; margin-bottom: 10px; }
        h1 { font-size: 24px; }
        .status {
          background: rgba(255,255,255,0.2);
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          margin-bottom: 20px;
        }
        .pulse {
          display: inline-block;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s infinite;
          margin-right: 10px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .alerts { margin-top: 20px; }
        .alert-item {
          background: white;
          color: #333;
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 15px;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          background: rgba(255,255,255,0.3);
          color: white;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="icon">🚗</div>
        <h1>Convoicar Alerts</h1>
      </div>
      
      <div class="status">
        <div class="pulse"></div>
        <span id="status">Connecté</span>
      </div>
      
      <button onclick="testAlert()">🔊 Tester l'alerte</button>
      
      <div class="alerts" id="alerts"></div>
      
      <script>
        let eventSource = new EventSource('/stream');
        
        eventSource.onopen = () => {
          document.getElementById('status').textContent = 'Connecté';
        };
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          showAlert(data);
        };
        
        function showAlert(data) {
          const alertDiv = document.createElement('div');
          alertDiv.className = 'alert-item';
          alertDiv.innerHTML = '<strong>' + data.title + '</strong><br>' + data.message;
          
          document.getElementById('alerts').insertBefore(alertDiv, document.getElementById('alerts').firstChild);
          
          playSound();
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(data.title, { body: data.message });
          }
        }
        
        function playSound() {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const notes = [261.63, 329.63, 392.00, 523.25];
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 1.125);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 1.125 + 0.1);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + (i + 1) * 1.125);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 1.125);
            osc.stop(ctx.currentTime + (i + 1) * 1.125);
          });
        }
        
        function testAlert() {
          showAlert({
            title: '🚗 Test - Nouvelle course',
            message: 'Paris → Lyon\\n15/12/2025 à 08h30\\nPrix: 55€'
          });
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const clientId = Date.now();
  clients.set(clientId, res);
  
  res.write('data: ' + JSON.stringify({ type: 'connected' }) + '\\n\\n');
  
  req.on('close', () => {
    clients.delete(clientId);
  });
});

app.post('/api/alert', (req, res) => {
  const { title, message } = req.body;
  
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message required' });
  }
  
  const alertData = { title, message, timestamp: Date.now() };
  
  clients.forEach((clientRes) => {
    clientRes.write('data: ' + JSON.stringify(alertData) + '\\n\\n');
  });
  
  res.json({ success: true, clients: clients.size });
});

app.listen(PORT, () => {
  console.log('🚀 Serveur démarré sur le port ' + PORT);
});
