import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { ScrollTrigger, gsap, scrollToTop } from "../lib/scroll";

/** Top progress bar + circular progress/back-to-top button. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const C = 2 * Math.PI * 22;
    gsap.set(ring.current, { strokeDasharray: C, strokeDashoffset: C });
    gsap.set(btn.current, { autoAlpha: 0, scale: 0.6 });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(bar.current, { scaleX: p });
        gsap.set(ring.current, { strokeDashoffset: C * (1 - p) });
        if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
        const show = p > 0.04;
        gsap.to(btn.current, { autoAlpha: show ? 1 : 0, scale: show ? 1 : 0.6, duration: 0.4, overwrite: "auto" });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-lime shadow-[0_0_14px_rgba(198,255,26,0.9)]" />
      </div>
      <button
        ref={btn}
        onClick={scrollToTop}
        aria-label="Back to top"
        data-cursor="hover"
        className="group fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-md sm:bottom-8 sm:right-8"
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
          <circle ref={ring} cx="26" cy="26" r="22" fill="none" stroke="#c6ff1a" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span ref={pct} className="font-cond text-[13px] font-bold text-white transition-opacity group-hover:opacity-0">
          00
        </span>
        <ArrowUp size={18} className="absolute text-lime opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
    </>
  );
}
