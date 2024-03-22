class Sequencer {
    constructor(outputManager, tempo = 120) {
        this.outputManager = outputManager;
        this.sequence = [];
        this.isPlaying = false;
        this.tempo = tempo;
    }

    setTempo(tempo) {
        this.tempo = tempo;
        // Optionally recalculate note durations if tempo changes mid-sequence
    }

    convertDurationToMs(duration) {
        return duration * (60000 / this.tempo);
    }

    setSequence(sequence) {
        this.sequence = sequence.map(note => ({
            ...note,
            duration: this.convertDurationToMs(note.duration),
        }));
    }

    playSequence(repeat = false) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.playNoteAtIndex(0, repeat);
    }

    playNoteAtIndex(index, repeat) {
        if (index >= this.sequence.length) {
            if (repeat) {
                this.playNoteAtIndex(0, repeat); // Restart sequence for loop
            } else {
                this.isPlaying = false; // End playback
            }
            return;
        }

        const note = this.sequence[index];
        this.outputManager.sendNoteOn(note.note, note.velocity);
        setTimeout(() => {
            this.outputManager.sendNoteOff(note.note);
            this.playNoteAtIndex(index + 1, repeat); // Proceed to the next note
        }, note.duration);
    }
}

module.exports = Sequencer;
