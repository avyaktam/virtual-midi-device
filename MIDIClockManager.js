//MIDIClockManager.js
const midi = require('midi');

class MIDIClockManager {
    constructor(tempo = 120) {
        this.output = new midi.Output();
        this.input = new midi.Input();
        this.setTempo(tempo);
    }

    setTempo(tempo) {
        this.tempo = tempo;
        this.interval = (60000 / this.tempo) / 24; // Recalculate MIDI Clock interval
        if (this.clockInterval) {
            this.stopClock();
            this.startClock(this.output.getPortNumber());
        }
    }

    startClock(outputPort) {
        if (!this.output.isPortOpen()) {
            this.output.openPort(outputPort);
            console.log(`Started MIDI Clock on port: ${this.output.getPortName(outputPort)}`);
            this.clockInterval = setInterval(() => {
                this.output.sendMessage([0xF8]);
            }, this.interval);
        } else {
            console.log("MIDI Clock is already running.");
        }
    }

    stopClock() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
            console.log("MIDI Clock stopped.");
        }
    }

    listenToClock(inputPort) {
        if (!this.input.isPortOpen()) {
            this.input.openPort(inputPort);
            console.log(`Listening to MIDI Clock on port: ${this.input.getPortName(inputPort)}`);
            this.input.on('message', (deltaTime, message) => {
                if (message[0] === 0xF8) {
                    // Process MIDI Clock messages here
                    console.log("MIDI Clock tick received.");
                }
            });
        } else {
            console.log("Already listening to MIDI Clock.");
        }
    }
}


module.exports = MIDIClockManager;
