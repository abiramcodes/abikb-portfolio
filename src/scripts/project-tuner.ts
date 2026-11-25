/**
 * AF-82 project tuner: the console's client state machine.
 *
 * The server renders Side A, track 1, powered on. Everything the
 * visitor can then do (dial, detents, side switch, power, auto-play)
 * runs here. Selection never hides content and never requires
 * JavaScript to have run: the track listing always links to the
 * full project pages.
 */

import { sfx } from "./console-audio";

interface Track {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  stack: string;
  command?: string;
  github?: string;
  docs?: string;
  internalHref?: string;
}

interface Payload {
  A: Track[];
  B: Track[];
}

const root = document.getElementById("af82");
if (root) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const payload: Payload = JSON.parse(
    (document.getElementById("af82-data") as HTMLElement).textContent ?? "{}",
  );
  const BANK_SUB: Record<string, string> = { A: "Shipped tools", B: "Client work" };

  let bank: "A" | "B" = "A";
  let index = 0;
  let playing = false;
  let playTimer: number | undefined;
  let spinTimer: number | undefined;
  let onScreen = true;
  let pointerOver = false;
  let focusWithin = false;

  const $ = (id: string) => document.getElementById(id);
  const tracks = () => payload[bank];
  const angleAt = (i: number, n: number) => (n > 1 ? -135 + (270 * i) / (n - 1) : 0);

  // ── Readout ──
  function updateReadout(t: Track) {
    ($("af-proj-title") as HTMLElement).textContent = t.name;
    ($("af-proj-stack") as HTMLElement).textContent = t.stack;
    ($("af-proj-desc") as HTMLElement).textContent = t.description;

    const cmdWrap = $("af-cmd-wrap") as HTMLElement | null;
    const cmd = $("af-cmd") as HTMLElement | null;
    const copy = $("af-copy") as HTMLElement | null;
    const github = $("af-github") as HTMLAnchorElement | null;
    const docs = $("af-docs") as HTMLAnchorElement | null;
    const internal = $("af-internal") as HTMLAnchorElement | null;

    if (cmdWrap && cmd && copy) {
      cmdWrap.hidden = !t.command;
      if (t.command) cmd.textContent = t.command;
      copy.hidden = !t.command;
      if (t.command) {
        copy.setAttribute("data-copy", t.command);
        const label = copy.querySelector("[data-copy-label]");
        if (label) label.textContent = "Copy command";
      }
    }
    if (github) {
      github.hidden = !t.github;
      if (t.github) github.href = t.github;
    }
    if (docs) {
      docs.hidden = !t.docs;
      if (t.docs) docs.href = t.docs;
    }
    if (internal) {
      internal.hidden = !t.internalHref;
      if (t.internalHref) internal.href = t.internalHref;
    }
  }

  function updateLed(t: Track) {
    const n = tracks().length;
    ($("af-led-name") as HTMLElement).textContent = t.name;
    ($("af-led-sub") as HTMLElement).textContent = `Track ${index + 1} of ${n} · ${t.stack}`;
    ($("af-counter") as HTMLElement).textContent = String(index + 1).padStart(3, "0");
    ($("af-side-label") as HTMLElement).textContent = `Side ${bank} · ${BANK_SUB[bank]}`;
    const out = $("af-track-out") as HTMLElement | null;
    if (out) out.textContent = `Track ${index + 1} / ${n}`;
  }

  function updateTrackRows() {
    const list = root.querySelector<HTMLElement>(`[data-bank-list="${bank}"]`);
    if (!list) return;
    list.querySelectorAll<HTMLElement>(".trow").forEach((row) => {
      const on = Number(row.dataset.index) === index;
      if (on) row.setAttribute("aria-current", "true");
      else row.removeAttribute("aria-current");
    });
  }

  function updateDial() {
    const dial = $("af-dial") as HTMLElement | null;
    if (!dial) return;
    const n = tracks().length;
    dial.style.transform = `rotate(${angleAt(index, n).toFixed(2)}deg)`;
    dial.setAttribute("aria-valuemax", String(n));
    dial.setAttribute("aria-valuenow", String(index + 1));
    dial.setAttribute(
      "aria-valuetext",
      `${tracks()[index].name}, track ${index + 1} of ${n}`,
    );
  }

  function updateDetents() {
    root.querySelectorAll<HTMLElement>(".detent").forEach((b) => {
      b.setAttribute("aria-checked", Number(b.dataset.track) === index ? "true" : "false");
    });
  }

  function setLock(v01: number) {
    const v = Math.max(0, Math.min(1, v01));
    const needle = $("af-needle-lock") as HTMLElement | null;
    if (needle) needle.style.setProperty("--needle", `${(-42 + 84 * v).toFixed(1)}deg`);
    const word = $("af-lock-word") as HTMLElement | null;
    const sr = $("af-lock-sr") as HTMLElement | null;
    const locked = v > 0.98;
    if (word) word.textContent = locked ? "Locked" : "Tuning";
    if (sr) sr.textContent = locked ? "Tuning locked" : "Tuning in progress";
  }

  function spinReels() {
    if (reducedMotion || root.dataset.power !== "on") return;
    root.classList.remove("spinning");
    void root.offsetWidth;
    root.classList.add("spinning");
    if (spinTimer) window.clearTimeout(spinTimer);
    spinTimer = window.setTimeout(() => root.classList.remove("spinning"), 760);
  }

  // ── Selection ──
  function select(i: number, spin = true) {
    const n = tracks().length;
    index = Math.max(0, Math.min(n - 1, i));
    const t = tracks()[index];
    updateReadout(t);
    updateLed(t);
    updateTrackRows();
    updateDial();
    updateDetents();
    setLock(1);
    if (spin) spinReels();
  }

  function userSelect(i: number) {
    stopPlay();
    select(i, true);
  }

  // ── Bank switching ──
  function buildTicks(n: number) {
    const svg = $("af-ticks") as SVGSVGElement | null;
    if (!svg) return;
    let lines = "";
    let labels = "";
    for (let i = 0; i < n; i++) {
      const a = (angleAt(i, n) * Math.PI) / 180;
      const sin = Math.sin(a);
      const cos = Math.cos(a);
      const at = (r: number) => ({ x: 120 + r * sin, y: 120 - r * cos });
      const from = at(102);
      const to = at(116);
      const lab = at(86);
      lines += `<line x1="${from.x.toFixed(1)}" y1="${from.y.toFixed(1)}" x2="${to.x.toFixed(1)}" y2="${to.y.toFixed(1)}"/>`;
      labels += `<text class="hw-svg-dim-fill" x="${lab.x.toFixed(1)}" y="${(lab.y + 4).toFixed(1)}" text-anchor="middle">${i + 1}</text>`;
    }
    svg.innerHTML = `<g class="hw-svg-dim" stroke-width="3" stroke-linecap="round">${lines}</g><g class="mono" font-size="13" font-weight="600">${labels}</g>`;
  }

  function buildDetents() {
    const box = $("af-detents") as HTMLElement | null;
    if (!box) return;
    const list = tracks();
    box.style.gridTemplateColumns = `repeat(${list.length}, 1fr)`;
    const buttons = list.map((p, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "detent";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", i === index ? "true" : "false");
      b.dataset.track = String(i);
      b.textContent = p.shortLabel;
      return b;
    });
    box.replaceChildren(...buttons);
  }

  function setBank(next: "A" | "B") {
    if (bank === next) return;
    bank = next;
    index = 0;
    root.setAttribute("data-side", bank);
    root.querySelectorAll<HTMLElement>("[data-bank-list]").forEach((list) => {
      list.hidden = list.dataset.bankList !== bank;
    });
    buildTicks(tracks().length);
    buildDetents();
    const sw = $("af-sw-side");
    if (sw) {
      sw.setAttribute("aria-checked", bank === "B" ? "true" : "false");
      const state = sw.querySelector(".sw-state");
      if (state) state.textContent = bank === "B" ? "Side B" : "Side A";
    }
    select(0, true);
  }

  // ── Power ──
  function powerOn(): boolean {
    return root.getAttribute("data-power") === "on";
  }

  function applyPower(on: boolean, persist = true) {
    root.setAttribute("data-power", on ? "on" : "off");
    const sw = $("af-sw-power");
    if (sw) {
      sw.setAttribute("aria-checked", on ? "true" : "false");
      const state = sw.querySelector(".sw-state");
      if (state) state.textContent = on ? "On" : "Off";
    }
    const ledState = $("af-led-state");
    if (ledState) ledState.textContent = on ? "Power on" : "Power off";
    if (!on) stopPlay();
    if (persist) {
      try {
        localStorage.setItem("af82-power", on ? "on" : "off");
      } catch {
        /* storage unavailable */
      }
    }
  }

  // ── Auto-play ──
  function canPlay(): boolean {
    return (
      powerOn() &&
      !document.hidden &&
      onScreen &&
      !pointerOver &&
      !focusWithin &&
      !reducedMotion
    );
  }

  function tick() {
    if (!canPlay()) return;
    sfx.play("detent");
    select((index + 1) % tracks().length, true);
  }

  function stopPlay() {
    playing = false;
    if (playTimer) window.clearInterval(playTimer);
    playTimer = undefined;
    root.setAttribute("data-play", "off");
    const sw = $("af-sw-play");
    if (sw) {
      sw.setAttribute("aria-checked", "false");
      const state = sw.querySelector(".sw-state");
      if (state) state.textContent = "Off";
    }
  }

  function startPlay() {
    if (reducedMotion) return; // never cycles for reduced-motion visitors
    if (!powerOn()) applyPower(true);
    playing = true;
    root.setAttribute("data-play", "on");
    const sw = $("af-sw-play");
    if (sw) {
      sw.setAttribute("aria-checked", "true");
      const state = sw.querySelector(".sw-state");
      if (state) state.textContent = "Playing";
    }
    if (playTimer) window.clearInterval(playTimer);
    playTimer = window.setInterval(tick, 4800);
  }

  // ── Experience readout: recalculate so static HTML never goes stale ──
  function recalcExperience() {
    const now = new Date();
    const months = (now.getFullYear() - 2021) * 12 + (now.getMonth() - 11);
    const years = Math.max(0, months / 12);
    const expEl = $("af-exp");
    if (expEl) expEl.textContent = years.toFixed(1);
    const needle = $("af-needle-exp") as HTMLElement | null;
    if (needle) {
      needle.style.setProperty(
        "--needle",
        `${(-42 + (84 * Math.min(years, 6)) / 6).toFixed(1)}deg`,
      );
    }
    const sr = $("af-exp-sr");
    if (sr) sr.textContent = `Experience ${years.toFixed(1)} of 6 years`;
  }

  // ── Rotary dial ──
  const dial = $("af-dial") as HTMLElement | null;
  if (dial) {
    const stage = dial.closest(".dial-stage") as HTMLElement | null;

    dial.addEventListener("keydown", (e) => {
      const n = tracks().length;
      let next: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") next = index + 1;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = index - 1;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = n - 1;
      if (next !== null) {
        e.preventDefault();
        sfx.play("detent");
        userSelect(Math.max(0, Math.min(n - 1, next)));
      }
    });

    if (stage) {
      let dragging = false;
      let totalMove = 0;
      let lastX = 0;
      let lastY = 0;
      let mode: "cap" | "drag" = "cap";
      let downDeg = 0;
      let nearest = index;
      let lastTickIndex = index;

      const geometry = (e: PointerEvent) => {
        const rect = stage.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const deg = Math.max(-135, Math.min(135, (Math.atan2(dx, -dy) * 180) / Math.PI));
        return { deg, r: Math.hypot(dx, dy), radius: rect.width / 2 };
      };

      const nearestIndex = (deg: number) => {
        const n = tracks().length;
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < n; i++) {
          const d = Math.abs(deg - angleAt(i, n));
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        return { i: best, d: bestD };
      };

      const applyDrag = (deg: number) => {
        dial.classList.add("dragging");
        dial.style.transform = `rotate(${deg.toFixed(2)}deg)`;
        const n = tracks().length;
        const half = n > 1 ? 270 / (n - 1) / 2 : 135;
        const hit = nearestIndex(deg);
        if (hit.i !== lastTickIndex) {
          lastTickIndex = hit.i;
          sfx.play("drag-tick");
        }
        nearest = hit.i;
        setLock(1 - Math.min(1, hit.d / Math.max(1, half)));
      };

      stage.addEventListener("pointerdown", (e) => {
        dragging = true;
        totalMove = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        const g = geometry(e);
        downDeg = g.deg;
        mode = g.r < g.radius * 0.44 ? "cap" : "drag";
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          /* capture unsupported: still track through the stage */
        }
        if (mode === "drag") applyDrag(g.deg);
      });

      stage.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        totalMove += Math.hypot(e.clientX - lastX, e.clientY - lastY);
        lastX = e.clientX;
        lastY = e.clientY;
        if (mode === "cap" && totalMove > 10) mode = "drag";
        if (mode === "drag") applyDrag(geometry(e).deg);
      });

      const endDrag = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        try {
          stage.releasePointerCapture(e.pointerId);
        } catch {
          /* nothing captured */
        }
        dial.classList.remove("dragging");
        sfx.play("snap");
        if (totalMove < 8) {
          // A click: the dial cap advances, a tick area picks nearest.
          if (mode === "cap") userSelect((index + 1) % tracks().length);
          else userSelect(nearestIndex(downDeg).i);
        } else {
          userSelect(nearest);
        }
      };

      stage.addEventListener("pointerup", endDrag);
      stage.addEventListener("pointercancel", endDrag);
    }
  }

  // ── Detents: delegated, survives bank regeneration ──
  const detents = $("af-detents");
  if (detents) {
    detents.addEventListener("click", (e) => {
      const btn = (e.target as Element).closest<HTMLElement>(".detent");
      if (btn?.dataset.track === undefined) return;
      sfx.play("detent");
      userSelect(Number(btn.dataset.track));
    });
    detents.addEventListener("keydown", (e) => {
      const btn = (e.target as Element).closest<HTMLElement>(".detent");
      if (!btn) return;
      const n = tracks().length;
      const i = Number(btn.dataset.track);
      let next: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
      if (next !== null) {
        e.preventDefault();
        sfx.play("detent");
        userSelect(next);
        const target = detents.querySelector<HTMLElement>(`[data-track="${next}"]`);
        target?.focus();
      }
    });
  }

  // ── Switches ──
  $("af-sw-power")?.addEventListener("click", () => {
    const on = !powerOn();
    sfx.play(on ? "power-on" : "power-off");
    applyPower(on);
  });

  $("af-sw-play")?.addEventListener("click", (e) => {
    if (playing) {
      sfx.play("toggle-off");
      stopPlay();
      return;
    }
    sfx.play("toggle-on");
    startPlay();
    // A pointer activation leaves focus on this switch, and the
    // focus gate would then read the console as "being operated"
    // and pause playback the moment it starts. Pointer users are
    // done with the key; keyboard users keep focus and keep the
    // pause-while-focused safety.
    if (e.detail > 0) ($("af-sw-play") as HTMLElement)?.blur();
  });

  $("af-sw-side")?.addEventListener("click", () => {
    const toB = bank === "A";
    sfx.play(toB ? "toggle-on" : "toggle-off");
    setBank(toB ? "B" : "A");
  });

  // Sound: the machine's mute key. Turning it off still gets its
  // final click; the preference persists across visits.
  $("af-sw-sound")?.addEventListener("click", () => {
    const sw = $("af-sw-sound")!;
    const next = sw.getAttribute("aria-checked") !== "true";
    if (!next) sfx.play("toggle-off");
    sfx.setEnabled(next);
    sw.setAttribute("aria-checked", next ? "true" : "false");
    const state = sw.querySelector(".sw-state");
    if (state) state.textContent = next ? "On" : "Off";
    if (next) sfx.play("toggle-on");
  });

  // ── Auto-play gates ──
  new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
    },
    { threshold: 0.15 },
  ).observe(root);

  root.addEventListener("pointerenter", () => {
    pointerOver = true;
  });
  root.addEventListener("pointerleave", () => {
    pointerOver = false;
  });
  root.addEventListener("focusin", () => {
    focusWithin = true;
  });
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget as Node)) focusWithin = false;
  });

  // ── Boot: sync switches with the pre-paint power attribute ──
  applyPower(powerOn(), false);
  if (playing) stopPlay();
  recalcExperience();
  const soundSw = $("af-sw-sound");
  if (soundSw) {
    soundSw.setAttribute("aria-checked", sfx.enabled ? "true" : "false");
    const state = soundSw.querySelector(".sw-state");
    if (state) state.textContent = sfx.enabled ? "On" : "Off";
  }
}
