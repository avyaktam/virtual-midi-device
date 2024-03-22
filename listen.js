const midi = require('midi');

// Initialize MIDI input
const input = new midi.Input();

// Open the input port to listen for MIDI from Ableton Live
input.openPort(0); // Ensure this matches the loopMIDI port Ableton is sending MIDI to

console.log('Listening for MIDI messages from Ableton Live...');

// Define MIDI message event listener
input.on('message', (deltaTime, message) => {
    const [status, data1, data2] = message;

    // Log received MIDI message
    console.log(`Received MIDI message: ${message}`);

    switch (status) {
        case 0xFA: // MIDI Start
            console.log('Received MIDI Start message');
            break;
        case 0xFC: // MIDI Stop
            console.log('Received MIDI Stop message');
            break;
        case 0xFB: // MIDI Continue
            console.log('Received MIDI Continue message');
            break;
        case 0xF8: // MIDI Clock
            console.log('Received MIDI Clock pulse');
            break;
        case 0xF2: // MIDI Song Position Pointer
            const position = data1 + (data2 << 7); // Combine two 7-bit values into one 14-bit value
            console.log(`Received MIDI Song Position Pointer: ${position} beats`);
            break;
        default:
            console.log(`Unhandled MIDI message: ${message}`);
            break;
    }
});

// Handle script exit
process.on('SIGINT', () => {
    input.closePort();
    process.exit();
});
