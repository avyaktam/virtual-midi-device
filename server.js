const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const MIDIInputManager = require('./MIDIInputManager'); // Make sure this path is correct

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const midiInputManager = new MIDIInputManager();

// Open all available MIDI input ports
midiInputManager.getInputPorts().forEach((portName, index) => {
    midiInputManager.openPort(index);
});

// Forward MIDI messages to all connected WebSocket clients
midiInputManager.on('message', (port, deltaTime, message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ port, message }));
        }
    });
});

// Serve the static files (make sure the path is correct)
app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('Client connected');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
