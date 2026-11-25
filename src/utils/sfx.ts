// Micro sound effects, synthesized with WebAudio — no audio files.
// Only two events earn a sound: a successful copy (rare, feedback)
// and the theme switch (occasional, state indication). Everything
// else stays silent: hovers, navigation, and the ⌘K palette are
// heard tens of times a session, where sound turns into noise.
// The context is created lazily inside a user gesture, and every
// failure mode (no WebAudio, blocked autoplay) degrades to silence.

let ctx: AudioContext | null = null;

export function soundOn(): boolean {
  return document.documentElement.getAttribute("data-sound") !== "off";
}

export function setSound(on: boolean): void {
  document.documentElement.setAttribute("data-sound", on ? "on" : "off");
  try {
    localStorage.setItem("sound", on ? "on" : "off");
  } catch {
    /* storage unavailable: choice applies for this page only */
  }
}

function audio(): AudioContext | null {
  try {
    ctx ??= new (window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOptions {
  from: number;
  to?: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
}

function tone({ from, to = from, dur = 0.09, type = "sine", gain = 0.1, delay = 0 }: ToneOptions): void {
  if (!soundOn()) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** Two-note tick: the clipboard heard you. */
export function playCopy(): void {
  tone({ from: 620, dur: 0.06 });
  tone({ from: 930, dur: 0.08, delay: 0.045 });
}

/** Pitch direction carries the state: down into dark, up into light. */
export function playTheme(dark: boolean): void {
  if (dark) tone({ from: 420, to: 280, dur: 0.12, type: "triangle", gain: 0.09 });
  else tone({ from: 280, to: 420, dur: 0.12, type: "triangle", gain: 0.09 });
}
