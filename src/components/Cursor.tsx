import { useEffect, useRef } from "react";
import { gsap, isFinePointer } from "../lib/scroll";

/** Custom desktop cursor: precise dot + trailing ring that morphs on interactive elements. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    document.documentElement.classList.add("has-cursor");
    const r = ring.current!;
    const d = dot.current!;
    gsap.set([r, d], { xPercent: -50, yPercent: -50, opacity: 0 });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "none" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "none" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([r, d], { opacity: 1, duration: 0.3 });
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const labelEl = t?.closest<HTMLElement>("[data-cursor-label]");
      const interactive = t?.closest("a,button,[data-cursor]");
      if (labelEl) {
        label.current!.textContent = labelEl.dataset.cursorLabel ?? "";
        gsap.to(r, { scale: 2.6, backgroundColor: "rgba(198,255,26,0.95)", borderColor: "rgba(198,255,26,1)", duration: 0.35 });
        gsap.to(label.current, { opacity: 1, duration: 0.2 });
        gsap.to(d, { scale: 0, duration: 0.2 });
      } else if (interactive) {
        gsap.to(r, { scale: 1.7, backgroundColor: "rgba(198,255,26,0.12)", borderColor: "rgba(198,255,26,1)", duration: 0.35 });
        gsap.to(label.current, { opacity: 0, duration: 0.15 });
        gsap.to(d, { scale: 0.5, duration: 0.2 });
      } else {
        gsap.to(r, { scale: 1, backgroundColor: "rgba(198,255,26,0)", borderColor: "rgba(255,255,255,0.6)", duration: 0.35 });
        gsap.to(label.current, { opacity: 0, duration: 0.15 });
        gsap.to(d, { scale: 1, duration: 0.2 });
      }
    };

    const down = () => gsap.to(r, { scale: "-=0.25", duration: 0.15, yoyo: true, repeat: 1 });
    const leave = () => {
      gsap.to([r, d], { opacity: 0, duration: 0.2 });
      shown = false;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-10 w-10 items-center justify-center rounded-full border border-white/60 [@media(hover:hover)_and_(pointer:fine)]:flex"
      >
        <span ref={label} className="font-cond text-[7px] font-bold uppercase tracking-[0.15em] text-black opacity-0" />
      </div>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[201] hidden h-1.5 w-1.5 rounded-full bg-lime [@media(hover:hover)_and_(pointer:fine)]:block"
      />
    </>
  );
}
