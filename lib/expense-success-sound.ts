const SOUND_ENABLED_KEY = "evven-expense-sound-enabled";

let audioContext: AudioContext | null = null;
let cachedSoundEnabled: boolean | null = null;

function ensureAudioContext() {
  if (audioContext) return audioContext;

  if (typeof window === "undefined") return null;
  const webkitCtor = (
    window as unknown as { webkitAudioContext?: typeof AudioContext }
  ).webkitAudioContext;
  const Ctor = window.AudioContext ?? webkitCtor;
  if (!Ctor) return null;

  audioContext = new Ctor();
  return audioContext;
}

export function isSoundEnabled() {
  if (cachedSoundEnabled !== null) return cachedSoundEnabled;

  if (typeof window === "undefined") {
    cachedSoundEnabled = true;
    return cachedSoundEnabled;
  }

  const stored = window.localStorage.getItem(SOUND_ENABLED_KEY);
  cachedSoundEnabled = stored === null ? true : stored !== "false";
  return cachedSoundEnabled;
}

export function setSoundEnabled(enabled: boolean) {
  cachedSoundEnabled = enabled;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  }
}

export function playExpenseStampThud() {
  if (typeof window === "undefined") return;
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 0.16);
  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.22);
}

export function playExpenseSuccessChime() {
  if (typeof window === "undefined") return;
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const note = (frequency: number, delay: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(
      0.18,
      ctx.currentTime + delay + 0.02,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + delay + 0.44,
    );
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.45);
  };

  note(880, 0);
  note(1318.5, 0.09);
}
