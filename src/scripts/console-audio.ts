/**
 * AF-82 analog sound effects.
 *
 * Every sound is synthesized live with the Web Audio API: no audio
 * files, no requests, nothing to license. Effects only fire from
 * real user gestures (the audio context resumes inside the same
 * event that triggers the sound), and the console carries a Sound
 * switch whose state persists, so the machine can be silenced.
 *
 * A small window log (window.__af82SfxLog) records the last effects
 * fired. It exists for automated verification and is not read by
 * any interface code.
 */

export type SfxName =
  | "toggle-on"
  | "toggle-off"
  | "power-on"
  | "power-off"
  | "detent"
  | "drag-tick"
  | "snap"
  | "drawer-open"
  | "drawer-close"
  | "confirm"
  | "error";

declare global {
  interface Window {
    __af82SfxLog?: string[];
  }
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

let enabled = true;
try {
  enabled = localStorage.getItem("af82-sound") !== "off";
} catch {
  /* storage unavailable: sound stays on for this page */
}

const THROTTLE_MS: Partial<Record<SfxName, number>> = {
  "drag-tick": 70,
  detent: 35,
};
const lastAt: Partial<Record<SfxName, number>> = {};
const log: string[] = [];

function record(name: SfxName) {
  log.push(name);
  if (log.length > 8) log.shift();
  window.__af82SfxLog = log;
}

function ensure(): AudioContext | null {
  const AC = window.AudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function makeNoise(c: AudioContext): AudioBuffer {
  const len = Math.floor(c.sampleRate * 0.25);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Short bandpass-filtered noise burst: the analog click family. */
function burst(
  c: AudioContext,
  out: GainNode,
  opts: { bp: number; q?: number; dur: number; gain: number; sweepTo?: number; delay?: number },
) {
  const src = c.createBufferSource();
  src.buffer = noiseBuf ?? (noiseBuf = makeNoise(c));
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = opts.q ?? 6;
  const t = c.currentTime + (opts.delay ?? 0);
  f.frequency.setValueAtTime(opts.bp, t);
  if (opts.sweepTo) f.frequency.linearRampToValueAtTime(opts.sweepTo, t + opts.dur);
  const g = c.createGain();
  g.gain.setValueAtTime(opts.gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  src.connect(f).connect(g).connect(out);
  src.start(t);
  src.stop(t + opts.dur + 0.02);
}

/** Pure tone with fast decay: beeps and latch pings. */
function blip(
  c: AudioContext,
  out: GainNode,
  opts: { freq: number; dur: number; gain: number; type?: OscillatorType; delay?: number },
) {
  const t = c.currentTime + (opts.delay ?? 0);
  const o = c.createOscillator();
  o.type = opts.type ?? "sine";
  o.frequency.value = opts.freq;
  const g = c.createGain();
  g.gain.setValueAtTime(opts.gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + opts.dur + 0.02);
}

/** Falling sine: the mechanical thump under switches and relays. */
function thump(
  c: AudioContext,
  out: GainNode,
  opts: { freq: number; dur: number; gain: number; delay?: number },
) {
  const t = c.currentTime + (opts.delay ?? 0);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(opts.freq, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, opts.freq * 0.5), t + opts.dur);
  const g = c.createGain();
  g.gain.setValueAtTime(opts.gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + opts.dur + 0.02);
}

const RECIPES: Record<SfxName, (c: AudioContext, out: GainNode) => void> = {
  // Toggle switches: bright snap up, duller snap down.
  "toggle-on": (c, o) => {
    burst(c, o, { bp: 1600, q: 8, dur: 0.05, gain: 0.32 });
    thump(c, o, { freq: 170, dur: 0.05, gain: 0.16 });
  },
  "toggle-off": (c, o) => {
    burst(c, o, { bp: 850, q: 6, dur: 0.05, gain: 0.3 });
    thump(c, o, { freq: 120, dur: 0.06, gain: 0.18 });
  },
  // Power relay: heavier than a toggle, with a soft charge-up blip.
  "power-on": (c, o) => {
    thump(c, o, { freq: 70, dur: 0.12, gain: 0.3 });
    burst(c, o, { bp: 1200, q: 7, dur: 0.04, gain: 0.14 });
    blip(c, o, { freq: 640, dur: 0.09, gain: 0.06, delay: 0.03 });
  },
  "power-off": (c, o) => {
    thump(c, o, { freq: 55, dur: 0.14, gain: 0.3 });
    burst(c, o, { bp: 700, q: 6, dur: 0.05, gain: 0.12 });
  },
  // Rotary detent: crisp tick as the selector lands.
  detent: (c, o) => {
    burst(c, o, { bp: 2300, q: 10, dur: 0.018, gain: 0.26 });
    blip(c, o, { freq: 2600, dur: 0.012, gain: 0.05 });
  },
  // Ratchet tick while dragging past detent zones (throttled).
  "drag-tick": (c, o) => {
    burst(c, o, { bp: 2100, q: 10, dur: 0.014, gain: 0.14 });
  },
  // Dial snap on release: tick plus the needle settling into lock.
  snap: (c, o) => {
    burst(c, o, { bp: 2300, q: 10, dur: 0.02, gain: 0.28 });
    thump(c, o, { freq: 240, dur: 0.05, gain: 0.1 });
  },
  // Cassette-library drawer sliding open and latching shut.
  "drawer-open": (c, o) => {
    burst(c, o, { bp: 350, q: 3, dur: 0.16, gain: 0.16, sweepTo: 1400 });
    burst(c, o, { bp: 1800, q: 8, dur: 0.02, gain: 0.14, delay: 0.15 });
    thump(c, o, { freq: 140, dur: 0.05, gain: 0.08, delay: 0.15 });
  },
  "drawer-close": (c, o) => {
    burst(c, o, { bp: 1200, q: 3, dur: 0.12, gain: 0.14, sweepTo: 400 });
    burst(c, o, { bp: 1500, q: 8, dur: 0.02, gain: 0.12, delay: 0.11 });
  },
  // Copy path: two ascending pings for success, low buzz for failure.
  confirm: (c, o) => {
    blip(c, o, { freq: 880, dur: 0.06, gain: 0.12 });
    blip(c, o, { freq: 1318, dur: 0.07, gain: 0.12, delay: 0.07 });
  },
  error: (c, o) => {
    blip(c, o, { freq: 130, dur: 0.14, gain: 0.14, type: "sawtooth" });
    thump(c, o, { freq: 110, dur: 0.1, gain: 0.08 });
  },
};

export const sfx = {
  get enabled(): boolean {
    return enabled;
  },
  setEnabled(on: boolean) {
    enabled = on;
    try {
      localStorage.setItem("af82-sound", on ? "on" : "off");
    } catch {
      /* storage unavailable: applies for this page only */
    }
  },
  play(name: SfxName) {
    if (!enabled) return;
    const gap = THROTTLE_MS[name];
    const now = performance.now();
    if (gap) {
      if (now - (lastAt[name] ?? 0) < gap) return;
      lastAt[name] = now;
    }
    const c = ensure();
    if (!c || !master) return;
    try {
      RECIPES[name](c, master);
    } catch {
      /* audio unavailable: stay silent */
    }
    record(name);
  },
};
