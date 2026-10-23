import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const WHEEL_KEY = "upw-rd";
const DISMISSED_KEY = "rf-exit-discount-dismissed";

function hasRecentSpin() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(WHEEL_KEY) || "null") as { t?: number } | null;
    return Boolean(saved?.t && Date.now() - saved.t < 7 * 864e5);
  } catch { return false; }
}

export function ExitDiscountPopup() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let armed = false;
    let previousY = window.scrollY;
    const wasDismissed = () => {
      try { return window.sessionStorage.getItem(DISMISSED_KEY) === "1"; } catch { return false; }
    };
    const progress = () => window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const show = () => {
      if (!armed || wasDismissed() || hasRecentSpin()) return;
      try { window.sessionStorage.setItem(DISMISSED_KEY, "1"); } catch {}
      setOpen(true);
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (progress() >= .88) armed = true;
      const touch = window.matchMedia("(hover: none), (max-width: 768px)").matches;
      if (touch && armed && previousY - y >= 42 && progress() >= .78) show();
      previousY = y;
    };
    const onMouseOut = (event: MouseEvent) => {
      if (!window.matchMedia("(hover: hover) and (min-width: 769px)").matches) return;
      if (event.clientY <= 4 && (event.relatedTarget === null || event.relatedTarget === document.documentElement)) show();
    };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && open) setOpen(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseout", onMouseOut);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  const close = () => setOpen(false);
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }} style={{ position: "fixed", inset: 0, zIndex: 10000, display: "grid", placeItems: "center", padding: "16px", background: "rgba(7,7,7,.82)", backdropFilter: "blur(8px)" }}>
      <section role="dialog" aria-modal="true" aria-labelledby="exit-discount-title" style={{ width: "min(1080px, 100%)", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid rgba(244,241,234,.24)", background: "#111", boxShadow: "0 28px 90px rgba(0,0,0,.6)" }}>
        <header style={{ minHeight: "48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "6px 12px 6px 18px", color: "#f4f1ea", background: "#171716" }}>
          <span id="exit-discount-title" style={{ font: "700 9px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: ".12em" }}>UMA CONDIÇÃO PARA O SEU PROJETO</span>
          <button ref={closeRef} type="button" onClick={close} aria-label="Fechar oferta" style={{ display: "grid", width: "34px", height: "34px", flex: "none", placeItems: "center", border: "1px solid rgba(244,241,234,.35)", borderRadius: "50%", color: "#f4f1ea", background: "transparent", cursor: "pointer" }}><X size={16} aria-hidden="true" /></button>
        </header>
        <iframe title="Roleta: gire e ganhe 10% de desconto no projeto" src="/exit-discount-wheel.html" style={{ width: "100%", height: "min(720px, calc(92vh - 50px))", flex: "none", border: 0, background: "#111" }} />
      </section>
    </div>,
    document.body,
  );
}
