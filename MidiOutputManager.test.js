const midi = require('midi');
jest.mock('midi');

const MIDIClockManager = require('./MIDIClockManager');

describe('MIDIClockManager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    midi.Output.mockClear();
    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start MIDI clock and send messages at correct interval', () => {
    const clockManager = new MIDIClockManager(120); // 120 BPM
    clockManager.startClock(1); // Assuming port 1 for the test
  
    // Advance time to trigger exactly one interval's worth of MIDI Clock messages
    jest.advanceTimersByTime(20.83);
  
    const mockOutputInstance = midi.Output.mock.instances[0];
    const mockSendMessage = mockOutputInstance.sendMessage;
  
    // Adjust expectations based on the actual interval and the advanced time
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(mockSendMessage).toHaveBeenCalledWith([0xF8]);
  
    // Optionally, you can further test by advancing the timers by more and checking calls again
  });
});
