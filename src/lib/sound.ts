/** Tiny procedural audio engine. Disabled by default; user opts in via the toggle. */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let drone: { stop: () => void } | null = null;
let enabled = false;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  return ctx;
}

function startDrone() {
  if (!ctx || !master || drone) return;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 260;
  const g = ctx.createGain();
  g.gain.value = 0.5;
  const oscs = [55, 55.4, 82.5].map((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i === 2 ? "triangle" : "sawtooth";
    o.frequency.value = f;
    o.connect(filter);
    o.start();
    return o;
  });
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = 90;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();
  filter.connect(g).connect(master);
  drone = {
    stop: () => {
      oscs.forEach((o) => o.stop());
      lfo.stop();
      drone = null;
    },
  };
}

export function isSoundOn() {
  return enabled;
}

export async function setSound(on: boolean) {
  enabled = on;
  const c = ensure();
  if (!c || !master) return;
  if (on) {
    await c.resume();
    startDrone();
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.linearRampToValueAtTime(0.05, c.currentTime + 1.2);
  } else {
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.linearRampToValueAtTime(0, c.currentTime + 0.4);
    window.setTimeout(() => {
      if (!enabled) drone?.stop();
    }, 600);
  }
}

/** Metallic "clank" — used on clicks when sound is enabled. */
export function playClank(freq = 220, vol = 0.07) {
  if (!enabled || !ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "square";
  o2.type = "sine";
  o.frequency.setValueAtTime(freq * 2.7, t);
  o.frequency.exponentialRampToValueAtTime(freq, t + 0.12);
  o2.frequency.setValueAtTime(freq * 4.1, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  o.connect(g);
  o2.connect(g);
  g.connect(ctx.destination);
  o.start(t);
  o2.start(t);
  o.stop(t + 0.3);
  o2.stop(t + 0.3);
}

export function playTick() {
  playClank(520, 0.025);
}
