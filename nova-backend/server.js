const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'NOVA server running',
        time: new Date().toLocaleTimeString()
    });
});

// Voice command endpoint
app.post('/api/voice/command', (req, res) => {
    const { command } = req.body;
    console.log('🎤 Received:', command);
    
    let response = 'You said: ' + command;
    
    if (command.toLowerCase().includes('hello')) 
        response = 'Hello from NOVA!';
    else if (command.toLowerCase().includes('time')) 
        response = 'The time is ' + new Date().toLocaleTimeString();
    
    res.json({ 
        success: true, 
        response: response 
    });
});

// Start server
app.listen(PORT, () => {
    console.log('=================================');
    console.log('✅ NOVA Server Started!');
    console.log('=================================');
    console.log('📍 Port: ' + PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('🔧 Test: http://localhost:' + PORT + '/api/health');
    console.log('=================================');
});
