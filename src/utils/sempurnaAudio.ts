// Web Audio API Synthesizer & Arrangement for "Sempurna" (Andra and The Backbone)
// Delicate acoustic fingerstyle guitar & piano arrangement in D Major

interface NoteEvent {
  note: string; // e.g. "D4", "F#4"
  time: number; // in beats (0, 0.5, 1.0, ...)
  duration: number; // in beats
  velocity?: number; // 0 to 1
  channel?: 'bass' | 'arpeggio' | 'melody';
}

const NOTE_FREQS: Record<string, number> = {
  // Bass
  D2: 73.42,
  E2: 82.41,
  F2: 87.31,
  'F#2': 92.5,
  G2: 98.0,
  A2: 110.0,
  B2: 123.47,
  C3: 130.81,
  'C#3': 138.59,
  D3: 146.83,
  E3: 164.81,
  'F#3': 185.0,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,

  // Mid
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  E4: 329.63,
  'F#4': 369.99,
  G4: 392.0,
  'G#4': 415.3,
  A4: 440.0,
  'A#4': 466.16,
  B4: 493.88,

  // Treble
  C5: 523.25,
  'C#5': 554.37,
  D5: 587.33,
  E5: 659.25,
  'F#5': 739.99,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
};

// Arrangement of "Sempurna"
// Tempo: 76 BPM (gentle acoustic ballad)
export const BPM = 76;
const BEAT_DURATION = 60 / BPM; // ~0.789s per beat

export function generateSempurnaScore(): NoteEvent[] {
  const events: NoteEvent[] = [];

  // Helper to add arpeggio bar
  // Each bar has 4 beats (8 eighth notes)
  const addArpeggioBar = (
    startBeat: number,
    bassNote: string,
    notes: string[],
    bassVel = 0.55,
    arpVel = 0.35
  ) => {
    // Bass note on beat 1
    events.push({
      note: bassNote,
      time: startBeat,
      duration: 3.5,
      velocity: bassVel,
      channel: 'bass',
    });

    // 8 eighth notes fingerpicking pattern
    for (let i = 0; i < 8; i++) {
      const note = notes[i % notes.length];
      events.push({
        note,
        time: startBeat + i * 0.5,
        duration: 0.9,
        velocity: arpVel + (i % 2 === 0 ? 0.05 : 0),
        channel: 'arpeggio',
      });
    }
  };

  // Helper to add melody phrase
  const addMelody = (
    startBeat: number,
    melodyNotes: [string, number, number?][] // [note, duration, optionalVel]
  ) => {
    let t = startBeat;
    melodyNotes.forEach(([note, dur, vel]) => {
      if (note !== 'REST') {
        events.push({
          note,
          time: t,
          duration: dur * 0.95,
          velocity: vel || 0.68,
          channel: 'melody',
        });
      }
      t += dur;
    });
  };

  let beat = 0;

  // -----------------------------------------------------------------
  // 1. INTRO (Iconic Sempurna acoustic guitar arpeggios, 4 bars = 16 beats)
  // Progression: D - Bm - G - A
  // -----------------------------------------------------------------
  addArpeggioBar(beat, 'D3', ['D4', 'F#4', 'A4', 'D5', 'A4', 'F#4', 'D4', 'A3']);
  beat += 4;
  addArpeggioBar(beat, 'B2', ['D4', 'F#4', 'B4', 'D5', 'B4', 'F#4', 'D4', 'F#3']);
  beat += 4;
  addArpeggioBar(beat, 'G2', ['D4', 'G4', 'B4', 'D5', 'B4', 'G4', 'D4', 'G3']);
  beat += 4;
  addArpeggioBar(beat, 'A2', ['C#4', 'E4', 'A4', 'C#5', 'A4', 'E4', 'C#4', 'A3']);
  beat += 4;

  // -----------------------------------------------------------------
  // 2. VERSE 1 ("Janganlah kau hancurkan rasa ini...")
  // Progression: D - Bm - G - A (16 beats)
  // -----------------------------------------------------------------
  const verse1Start = beat;
  addArpeggioBar(beat, 'D3', ['D4', 'F#4', 'A4', 'D5', 'A4', 'F#4', 'D4', 'A3'], 0.45, 0.28);
  beat += 4;
  addArpeggioBar(beat, 'B2', ['D4', 'F#4', 'B4', 'D5', 'B4', 'F#4', 'D4', 'F#3'], 0.45, 0.28);
  beat += 4;
  addArpeggioBar(beat, 'G2', ['D4', 'G4', 'B4', 'D5', 'B4', 'G4', 'D4', 'G3'], 0.45, 0.28);
  beat += 4;
  addArpeggioBar(beat, 'A2', ['C#4', 'E4', 'A4', 'C#5', 'A4', 'E4', 'C#4', 'A3'], 0.45, 0.28);
  beat += 4;

  // Verse 1 Melody:
  // "Janganlah kau hancurkan rasa ini"
  addMelody(verse1Start + 0.5, [
    ['F#4', 0.5],
    ['G4', 0.5],
    ['A4', 1.0],
    ['A4', 0.5],
    ['A4', 0.5],
    ['G4', 0.5],
    ['F#4', 0.5],
    ['E4', 0.5],
    ['D4', 1.5],
  ]);

  // "Kau didambakan kita berdua"
  addMelody(verse1Start + 8.5, [
    ['F#4', 0.5],
    ['G4', 0.5],
    ['A4', 0.75],
    ['A4', 0.5],
    ['B4', 0.75],
    ['A4', 0.5],
    ['G4', 0.5],
    ['F#4', 0.5],
    ['E4', 1.5],
  ]);

  // -----------------------------------------------------------------
  // 3. VERSE 2 ("Janganlah kau ragukan cinta ini...")
  // Progression: D - Bm - G - A (16 beats)
  // -----------------------------------------------------------------
  const verse2Start = beat;
  addArpeggioBar(beat, 'D3', ['D4', 'F#4', 'A4', 'D5', 'A4', 'F#4', 'D4', 'A3'], 0.48, 0.3);
  beat += 4;
  addArpeggioBar(beat, 'B2', ['D4', 'F#4', 'B4', 'D5', 'B4', 'F#4', 'D4', 'F#3'], 0.48, 0.3);
  beat += 4;
  addArpeggioBar(beat, 'G2', ['D4', 'G4', 'B4', 'D5', 'B4', 'G4', 'D4', 'G3'], 0.48, 0.3);
  beat += 4;
  addArpeggioBar(beat, 'A2', ['C#4', 'E4', 'A4', 'C#5', 'A4', 'E4', 'C#4', 'A3'], 0.48, 0.3);
  beat += 4;

  // Verse 2 Melody:
  // "Janganlah kau ragukan cinta ini"
  addMelody(verse2Start + 0.5, [
    ['F#4', 0.5],
    ['G4', 0.5],
    ['A4', 1.0],
    ['A4', 0.5],
    ['A4', 0.5],
    ['G4', 0.5],
    ['F#4', 0.5],
    ['E4', 0.5],
    ['D4', 1.5],
  ]);

  // "Hanya engkau yang selalu ku mau"
  addMelody(verse2Start + 8.5, [
    ['F#4', 0.5],
    ['G4', 0.5],
    ['A4', 0.75],
    ['A4', 0.5],
    ['B4', 0.75],
    ['A4', 0.5],
    ['G4', 0.5],
    ['F#4', 0.5],
    ['D4', 1.5],
  ]);

  // -----------------------------------------------------------------
  // 4. CHORUS ("Kau begitu sempurna... di mataku kau begitu indah...")
  // Progression: G - A - D - Bm | G - A - D (16 beats)
  // -----------------------------------------------------------------
  const chorusStart = beat;
  addArpeggioBar(beat, 'G2', ['D4', 'G4', 'B4', 'D5', 'B4', 'G4', 'D4', 'G3'], 0.55, 0.35);
  beat += 4;
  addArpeggioBar(beat, 'A2', ['C#4', 'E4', 'A4', 'C#5', 'A4', 'E4', 'C#4', 'A3'], 0.55, 0.35);
  beat += 4;
  addArpeggioBar(beat, 'D3', ['D4', 'F#4', 'A4', 'D5', 'A4', 'F#4', 'D4', 'A3'], 0.55, 0.35);
  beat += 4;
  addArpeggioBar(beat, 'B2', ['D4', 'F#4', 'B4', 'D5', 'B4', 'F#4', 'D4', 'F#3'], 0.55, 0.35);
  beat += 4;

  // Second half of chorus
  addArpeggioBar(beat, 'G2', ['D4', 'G4', 'B4', 'D5', 'B4', 'G4', 'D4', 'G3'], 0.55, 0.35);
  beat += 4;
  addArpeggioBar(beat, 'A2', ['C#4', 'E4', 'A4', 'C#5', 'A4', 'E4', 'C#4', 'A3'], 0.55, 0.35);
  beat += 4;
  addArpeggioBar(beat, 'D3', ['D4', 'F#4', 'A4', 'D5', 'F#5', 'D5', 'A4', 'F#4'], 0.6, 0.38);
  beat += 4;

  // Chorus Melody:
  // "Kau begitu sempurna..."
  addMelody(chorusStart + 0.25, [
    ['D4', 0.5],
    ['E4', 0.5],
    ['F#4', 0.75],
    ['A4', 0.75],
    ['B4', 1.25, 0.75],
    ['A4', 1.5, 0.7],
  ]);

  // "Di mataku kau begitu indah..."
  addMelody(chorusStart + 4.5, [
    ['F#4', 0.5],
    ['G4', 0.5],
    ['A4', 0.5],
    ['B4', 0.5],
    ['A4', 0.5],
    ['G4', 0.5],
    ['F#4', 0.5],
    ['E4', 0.5],
    ['D4', 2.0, 0.72],
  ]);

  // "Kau membuat diriku..."
  addMelody(chorusStart + 16.25, [
    ['D4', 0.5],
    ['E4', 0.5],
    ['F#4', 0.75],
    ['A4', 0.75],
    ['B4', 1.25, 0.75],
    ['A4', 1.5, 0.7],
  ]);

  // "Terbang tinggi di awan..."
  addMelody(chorusStart + 20.5, [
    ['F#4', 0.5],
    ['G4', 0.5],
    ['A4', 0.5],
    ['B4', 0.5],
    ['A4', 0.5],
    ['G4', 0.5],
    ['F#4', 0.5],
    ['E4', 0.5],
    ['D4', 2.5, 0.75],
  ]);

  // Outro gentle chime resolution (D Major open string)
  events.push({
    note: 'D3',
    time: beat,
    duration: 4.0,
    velocity: 0.5,
    channel: 'bass',
  });
  events.push({
    note: 'A3',
    time: beat + 0.25,
    duration: 4.0,
    velocity: 0.4,
    channel: 'arpeggio',
  });
  events.push({
    note: 'D4',
    time: beat + 0.5,
    duration: 4.0,
    velocity: 0.45,
    channel: 'arpeggio',
  });
  events.push({
    note: 'F#4',
    time: beat + 0.75,
    duration: 4.0,
    velocity: 0.5,
    channel: 'melody',
  });
  events.push({
    note: 'A4',
    time: beat + 1.0,
    duration: 4.0,
    velocity: 0.55,
    channel: 'melody',
  });
  events.push({
    note: 'D5',
    time: beat + 1.25,
    duration: 5.0,
    velocity: 0.6,
    channel: 'melody',
  });

  return events;
}

export class SempurnaAudioPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.28; // gentle background volume
  private loopTimer: number | null = null;
  private activeTimeouts: number[] = [];
  private onStateChange?: (isPlaying: boolean, isMuted: boolean) => void;

  constructor(onStateChange?: (isPlaying: boolean, isMuted: boolean) => void) {
    this.onStateChange = onStateChange;
  }

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Warm master filter (lowpass to give delicate acoustic guitar timbre)
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(2200, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // Master volume gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  // Play a single synthesized acoustic plucked note
  private playNote(freq: number, startTime: number, duration: number, velocity: number, channel: string) {
    if (!this.ctx || !this.filterNode) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Channel specific timbre
    if (channel === 'bass') {
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc2.detune.setValueAtTime(3, startTime);
    } else if (channel === 'melody') {
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc2.detune.setValueAtTime(-5, startTime);
    } else {
      // Arpeggio
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc2.detune.setValueAtTime(4, startTime);
    }

    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq, startTime);

    // Acoustic pluck envelope: fast attack, exponential decay
    const attack = 0.012;
    const decay = duration * 0.9;
    const targetGain = Math.max(0.001, velocity * 0.6);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(targetGain, startTime + attack);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + decay);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.filterNode);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + attack + decay + 0.05);
    osc2.stop(startTime + attack + decay + 0.05);
  }

  // Schedule the score
  public play() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopScheduledNotes();
    this.isPlaying = true;
    this.notifyState();

    const score = generateSempurnaScore();
    const startTime = this.ctx.currentTime + 0.1;

    let maxTime = 0;
    score.forEach((ev) => {
      const freq = NOTE_FREQS[ev.note];
      if (freq) {
        const noteStart = startTime + ev.time * BEAT_DURATION;
        const noteDur = ev.duration * BEAT_DURATION;
        const noteEnd = ev.time * BEAT_DURATION + noteDur;
        if (noteEnd > maxTime) maxTime = noteEnd;

        this.playNote(freq, noteStart, noteDur, ev.velocity || 0.5, ev.channel || 'arpeggio');
      }
    });

    // Schedule next loop
    const loopDurationMs = (maxTime + 2.0) * 1000;
    this.loopTimer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.play();
      }
    }, loopDurationMs);
  }

  public pause() {
    this.isPlaying = false;
    this.stopScheduledNotes();
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
    this.notifyState();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notifyState();
  }

  public getPlaying() {
    return this.isPlaying;
  }

  public getMuted() {
    return this.isMuted;
  }

  public getVolume() {
    return this.volume;
  }

  private stopScheduledNotes() {
    if (this.loopTimer !== null) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeTimeouts.forEach(clearTimeout);
    this.activeTimeouts = [];
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange(this.isPlaying, this.isMuted);
    }
  }

  public destroy() {
    this.stopScheduledNotes();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
