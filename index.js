const midi = require('midi');

// Initialize MIDI output
const output = new midi.Output();
output.openPort(1); // Ensure this is the loopMIDI port that Ableton Live is listening to

// Timing and BPM setup
const tempo = 240; // Target BPM
const interval = (60000 / tempo) / 24; // Interval in milliseconds per MIDI Clock pulse

let clockCounter = 0; // Counts MIDI clock messages
const PPQN = 24; // Pulses Per Quarter Note for standard MIDI Clock
let barCounter = 0; // Track bars

// Example note sequence, triggered every bar
const sequence = [
    { note: 60, velocity: 100, duration: 200 }, // C4
    { note: 64, velocity: 100, duration: 200 }, // E4
    { note: 67, velocity: 100, duration: 200 }, // G4
];

// Function to send a MIDI note
function sendNoteOn(note, velocity) {
    output.sendMessage([0x90, note, velocity]); // Note On message
}

function sendNoteOff(note) {
    output.sendMessage([0x80, note, 0]); // Note Off message
}

// Function to play the sequence at the start of every bar
function playSequence() {
    sequence.forEach((note, index) => {
        setTimeout(() => sendNoteOn(note.note, note.velocity), note.duration * index);
        setTimeout(() => sendNoteOff(note.note), note.duration * (index + 1));
    });
}

// Send MIDI Clock at the calculated interval and play notes at the start of every bar
setInterval(() => {
    output.sendMessage([0xF8]); // MIDI Clock
    clockCounter++;

    if (clockCounter >= PPQN * 4) { // One bar has passed in 4/4 time
        clockCounter = 0; // Reset counter
        barCounter++; // Increment bar counter
        playSequence(); // Play the note sequence
    }
}, interval);

console.log('Sending MIDI Clock and notes. Press CTRL+C to stop.');
