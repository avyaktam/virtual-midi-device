const canvas = document.getElementById('midiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    processMidiEvent(data);
};

function processMidiEvent({ port, message }) {
    const [status, note, velocity] = message;

    // Identify MIDI event types and take appropriate actions
    switch (status & 0xf0) {
        case 0x80: // Note off
            // Handle note off event
            break;
        case 0x90: // Note on
            // Handle note on event
            drawFractal(port, note, velocity);
            break;
        case 0xb0: // Control Change
            // Handle control change event
            break;
        // Add cases for other MIDI event types as needed
        default:
            // Handle other MIDI event types
            break;
    }
}

function drawFractal(port, note, velocity) {
    // Setup initial parameters based on MIDI data
    const angleOffset = map(note, 0, 127, -Math.PI / 2 * (port + 1), Math.PI / 2 * (port + 1.5));
    const depth = Math.floor(map(note, 0, note, 4, velocity/10));
    const startX = canvas.width / 2; // Randomize start X slightly to prevent overlap
    const startY = canvas.height / 2 + note * 3; // Randomize start Y slightly
    const length = map(velocity * 2, 0, 127, 50, 200);
    const color = 'white';

    // Start drawing the fractal
    drawBranch(startX, startY, length, -Math.PI / 2, depth, angleOffset, color);
}

function fadeCanvas() {
    // Set the composite operation to 'multiply' to darken existing content
    ctx.globalCompositeOperation = 'multiply';
    // Apply a very slight darkening effect; this color and opacity might need adjustment
    ctx.fillStyle = 'rgba(50, 50, 50, 0.025)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Reset to default composite operation
    ctx.globalCompositeOperation = 'source-over';
}

function drawBranch(x, y, length, angle, depth, angleOffset, color) {
    if (depth === 0) return;

    const xEnd = x + Math.cos(angle) * length;
    const yEnd = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xEnd, yEnd);
    ctx.strokeStyle = color;
    ctx.lineWidth = depth;
    ctx.stroke();

    const scale = depth % 10 === 0 ? 0.6 : 0.9;
    drawBranch(xEnd, yEnd, length * scale, angle + angleOffset, depth - 1, angleOffset, color);
    drawBranch(xEnd, yEnd, length * scale, angle - angleOffset, depth - 1, angleOffset, color);
}

function map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Animation loop to continuously fade the canvas
function animate() {
    requestAnimationFrame(animate);
    fadeCanvas(); // Apply fading effect
}

animate(); // Start the animation loop
