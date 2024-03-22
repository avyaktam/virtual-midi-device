//MIDIInputManager.js
const midi = require('midi');
const EventEmitter = require('events');

class MIDIInputManager extends EventEmitter {
    constructor() {
        super();
        this.inputs = []; // An array to hold multiple MIDI input instances
    }

    openPort(inputPort) {
        try {
            const input = new midi.Input();
            if (inputPort >= 0 && inputPort < input.getPortCount()) {
                input.openPort(inputPort);
                console.log(`Opened port: ${input.getPortName(inputPort)}`);
                input.on('message', (deltaTime, message) => {
                    this.emit('message', inputPort, deltaTime, message); // Include port in the emitted event
                });
                this.inputs.push(input); // Add to the list of managed inputs
            } else {
                console.error('Invalid MIDI port number.');
            }
        } catch (error) {
            console.error(`Failed to open MIDI port: ${error.message}`);
        }
    }

    closePorts() {
        this.inputs.forEach(input => input.closePort());
        this.inputs = [];
    }

    // Method to list all available MIDI input ports
    getInputPorts() {
        const input = new midi.Input();
        const ports = [];
        const portCount = input.getPortCount();
        for (let i = 0; i < portCount; i++) {
            ports.push(input.getPortName(i));
        }
        return ports;
    }
}
module.exports = MIDIInputManager;
