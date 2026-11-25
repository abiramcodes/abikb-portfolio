/**
 * Shared copy-command path for the whole site.
 *
 * One delegated listener serves every [data-copy] key, including keys
 * the tuner swaps at runtime. Uses the Clipboard API when available
 * and falls back to a hidden textarea. Success and failure are both
 * announced by swapping the key label in place, so layout never
 * shifts and a failed copy never reports success.
 */

import { sfx } from "./console-audio";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

document.addEventListener("click", async (e) => {
  const btn = (e.target as Element | null).closest<HTMLElement>("[data-copy]");
  if (!btn) return;
  const text = btn.getAttribute("data-copy");
  if (!text) return;

  e.preventDefault();
  const ok = await copyText(text);
  sfx.play(ok ? "confirm" : "error");

  const label = btn.querySelector<HTMLElement>("[data-copy-label]") ?? btn;
  const original = label.textContent ?? "";
  label.textContent = ok ? "Copied" : "Copy failed";
  btn.style.color = ok ? "var(--led-side-b)" : "var(--accent-strong)";

  window.setTimeout(() => {
    label.textContent = original;
    btn.style.color = "";
  }, 1400);
});
