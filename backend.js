import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const GEMINI_KEY = process.env.GEMINI_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname)));

// In-memory storage (replace with Firebase/DB in production)
const storage = {
  reports: [],
  alerts: [],
  users: [],
  laundry: [],
  tasks: [],
  leaderboard: []
};

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('report-issue', (data) => {
    const report = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    storage.reports.unshift(report);
    io.emit('new-report', report);
    io.emit('new-alert', {
      type: 'report',
      message: `New ${data.type} reported`,
      severity: data.severity,
      timestamp: report.timestamp
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Gemini AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!GEMINI_KEY) {
      return res.json({
        reply: "AI Assistant is currently learning. Please check back soon!",
        fallback: true
      });
    }

    const prompt = `You are AquaX AI Assistant. User language: ${language}. 
    Respond in the same language. Be helpful, concise and focus on water safety, 
    disaster management, and campus services. Keep responses under 200 words.
    
    User: ${message}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                 "I'm here to help with water and emergency issues. How can I assist you today?";

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.json({
      reply: "I'm currently unavailable. Please try the emergency contacts or check the knowledge base.",
      fallback: true
    });
  }
});

// Report Management
app.post('/api/reports', (req, res) => {
  const report = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  storage.reports.unshift(report);
  io.emit('new-report', report);
  res.json({ success: true, report });
});

app.get('/api/reports', (req, res) => {
  res.json(storage.reports);
});

// Alert System
app.post('/api/alerts', (req, res) => {
  const alert = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  storage.alerts.unshift(alert);
  io.emit('new-alert', alert);
  res.json({ success: true, alert });
});

app.get('/api/alerts', (req, res) => {
  res.json(storage.alerts.slice(0, 20));
});

// SOS Emergency
app.post('/api/sos', (req, res) => {
  const sos = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString(),
    emergency: true
  };
  
  // In production, integrate with Twilio for SMS/voice calls
  console.log('🚨 EMERGENCY SOS:', sos);
  
  storage.alerts.unshift({
    ...sos,
    type: 'sos',
    message: 'EMERGENCY: Immediate assistance required'
  });
  
  io.emit('sos-alert', sos);
  res.json({ success: true, message: 'Emergency services notified' });
});

// Laundry Management
app.post('/api/laundry', (req, res) => {
  const laundry = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString(),
    status: 'submitted'
  };
  storage.laundry.unshift(laundry);
  res.json({ success: true, laundry });
});

app.get('/api/laundry', (req, res) => {
  res.json(storage.laundry);
});

app.put('/api/laundry/:id', (req, res) => {
  const laundry = storage.laundry.find(l => l.id === req.params.id);
  if (laundry) {
    Object.assign(laundry, req.body);
    io.emit('laundry-update', laundry);
    res.json({ success: true, laundry });
  } else {
    res.status(404).json({ error: 'Laundry not found' });
  }
});

// Leaderboard
app.post('/api/leaderboard', (req, res) => {
  const { userId, points, action } = req.body;
  
  let user = storage.leaderboard.find(u => u.userId === userId);
  if (!user) {
    user = { userId, points: 0, actions: [] };
    storage.leaderboard.push(user);
  }
  
  user.points += points;
  user.actions.unshift({
    action,
    points,
    timestamp: new Date().toISOString()
  });
  
  // Sort by points
  storage.leaderboard.sort((a, b) => b.points - a.points);
  
  io.emit('leaderboard-update', storage.leaderboard);
  res.json({ success: true, leaderboard: storage.leaderboard });
});

app.get('/api/leaderboard', (req, res) => {
  res.json(storage.leaderboard.slice(0, 10));
});

// IVR/SMS Simulation
app.post('/api/ivr/call', (req, res) => {
  // Simulate IVR call processing
  const { phone, option } = req.body;
  console.log(`IVR: Call from ${phone}, option: ${option}`);
  
  // In production, integrate with Twilio Voice API
  res.json({ 
    success: true, 
    message: 'IVR call processed',
    response: 'Thank you for calling AquaX. Your request has been logged.'
  });
});

app.post('/api/sms', (req, res) => {
  // Simulate SMS processing
  const { phone, message } = req.body;
  console.log(`SMS: From ${phone}: ${message}`);
  
  // Simple command parsing
  const response = processSMSCommand(message);
  
  res.json({ 
    success: true, 
    response,
    timestamp: new Date().toISOString()
  });
});

function processSMSCommand(message) {
  const cmd = message.toLowerCase().trim();
  
  if (cmd.includes('report') || cmd.includes('problem')) {
    return 'To report an issue, please call our emergency line or use the web portal for detailed reporting.';
  } else if (cmd.includes('status') || cmd.includes('water')) {
    return 'Water status: Normal. Latest test: All parameters within safe limits.';
  } else if (cmd.includes('help') || cmd.includes('sos')) {
    return 'EMERGENCY: Call 1066. NON-EMERGENCY: Visit aquax.edu.in or call 1800-XXX-XXXX';
  } else if (cmd.includes('laundry')) {
    return 'Laundry service: Mon-Sat 9AM-6PM. Status check: Send "LAUNDRY ID"';
  } else {
    return 'AquaX: For water issues, reply REPORT. Emergency: SOS. Status: STATUS. Help: HELP';
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      chat: GEMINI_KEY ? 'active' : 'demo',
      reports: 'active',
      alerts: 'active',
      laundry: 'active'
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
  🚀 AquaX Server Running!
  📍 Port: ${PORT}
  🌐 URL: http://localhost:${PORT}
  💧 Environment: ${process.env.NODE_ENV || 'development'}
  🤖 AI Chat: ${GEMINI_KEY ? 'Enabled' : 'Demo Mode'}
  
  📞 IVR/SMS: Ready
  🚨 SOS: Active
  👕 Laundry: Integrated
  🏆 Leaderboard: Live
  `);
});

export default app;