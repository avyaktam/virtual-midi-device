const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const midi = require('midi');
const MIDIInputManager = require('./MIDIInputManager');
const MIDIOutputManager = require('./MIDIOutputManager');
const Sequencer = require('./Sequencer');
const { basicSequence } = require('./SequenceModule');



// Initialize MIDI Managers
const globalTempo = 120;

const midiInputManager = new MIDIInputManager();
const midiOutputManager = new MIDIOutputManager();
const sequencer = new Sequencer(midiOutputManager, globalTempo);

// In your existing setup where MIDI input ports are listed and opened
console.log('\nMIDI Input Ports:');
const portName = "LoopMIDI Port: MPE"; // Adjust based on your exact LoopMIDI port name
const ports = midiInputManager.getInputPorts();
const mpePortIndex = ports.findIndex(name => name === portName);

if (mpePortIndex !== -1) {
    console.log(`${mpePortIndex}: ${ports[mpePortIndex]}`);
    midiInputManager.openPort(mpePortIndex);
} else {
    console.log("MPE port not found. Please ensure it's correctly named and available.");
}

// Automatically open MIDI Output Port for Ableton
midiOutputManager.openPort(1);

// Handling received MIDI messages
midiInputManager.on('message', (port, deltaTime, message) => {
    console.log(`Received from port ${port}:`, message);
});

function sendMIDIToAbleton() {
    console.log('Sending MIDI Clock and notes to Ableton Live...');

    sequencer.setSequence(basicSequence); // Set the sequence to be played

    let clockCounter = 0;
    const intervalDuration = (60000 / globalTempo) / 24; // Calculate interval based on global tempo

    const clockInterval = setInterval(() => {
        midiOutputManager.sendMessage([0xF8]); // Send MIDI Clock
        clockCounter++;

        if (clockCounter >= 24 * 4) { // One bar in 4/4 time at 24 PPQN
            clockCounter = 0;
            sequencer.playSequence();
        }
    }, intervalDuration);
}



function receiveMIDIFromAbleton() {
    console.log('Ready to receive MIDI Clock and notes from Ableton Live...');
    // No changes needed here, listening setup is done at the start
}

// Interactive setup to choose between input and output modes
readline.question('Choose mode - Input (i) or Output (o): ', (mode) => {
    switch (mode.toLowerCase()) {
        case 'i':
            console.log('Listening to MIDI input from Ableton...');
            receiveMIDIFromAbleton();
            break;
        case 'o':
            sendMIDIToAbleton();
            break;
        default:
            console.log('Invalid mode selected. Exiting...');
            readline.close();
            process.exit(1);
    }
    readline.close();
});