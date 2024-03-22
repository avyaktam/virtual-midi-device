const midi = require('midi');

class MIDIOutputManager {
    constructor() {
        this.output = new midi.Output();
    }

    openPort(outputPort) {
        this.output.openPort(outputPort);
    }

    closePort() {
        if (this.output.isPortOpen()) {
            this.output.closePort();
        }
    }

    sendMessage(message) {
        this.output.sendMessage(message);
    }

    // Modify these methods to include a channel parameter
    // MIDI channels are 0-indexed in the API, corresponding to channels 1-16 in MIDI terms
    sendNoteOn(note, velocity, channel = 0) {
        // Ensure the channel is within the 0-15 range
        if (channel < 0 || channel > 15) {
            console.error('Invalid MIDI channel:', channel + 1);
            return;
        }
        // Construct the Note On message with the channel
        // 0x90 is the status byte for Note On, added to the channel number
        this.sendMessage([0x90 + channel, note, velocity]);
    }

    sendNoteOff(note, channel = 0) {
        // Ensure the channel is within the 0-15 range
        if (channel < 0 || channel > 15) {
            console.error('Invalid MIDI channel:', channel + 1);
            return;
        }
        // Construct the Note Off message with the channel
        // 0x80 is the status byte for Note Off, added to the channel number
        this.sendMessage([0x80 + channel, note, 0]);
    }
}

module.exports = MIDIOutputManager;
