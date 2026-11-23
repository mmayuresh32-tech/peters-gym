import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/scroll";

/** Gym-inspired loader: a barbell gets loaded plate by plate as the counter climbs. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const plates = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-plate]"));
    const reduced = prefersReducedMotion();
    const state = { v: 0 };

    const ctx = gsap.context(() => {
      gsap.set(plates, { scaleY: 0, opacity: 0 });
      const tl = gsap.timeline();
      tl.from("[data-brand] span", { yPercent: 120, duration: 0.9, ease: "expo.out", stagger: 0.05 }, 0.1)
        .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.inOut" }, 0.1)
        .to(
          state,
          {
            v: 100,
            duration: reduced ? 0.6 : 2.3,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(state.v)).padStart(2, "0");
              const n = Math.floor((state.v / 100) * plates.length);
              plates.forEach((p, i) => {
                if (i < n && !p.dataset.on) {
                  p.dataset.on = "1";
                  gsap.to(p, { scaleY: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" });
                }
              });
            },
          },
          0.5
        )
        .to(plates, { scaleY: 1, opacity: 1, duration: 0.2 }, ">-0.1")
        .to("[data-content]", { opacity: 0, y: -30, duration: 0.5, ease: "power3.in" }, "+=0.25")
        .call(onDone, undefined, ">-0.05")
        .to("[data-half='top']", { yPercent: -101, duration: 1.1, ease: "expo.inOut" }, "<")
        .to("[data-half='bottom']", { yPercent: 101, duration: 1.1, ease: "expo.inOut" }, "<")
        .set(el, { display: "none" });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const plateSet = [
    { h: 150, c: "bg-iron" },
    { h: 118, c: "bg-iron" },
    { h: 88, c: "bg-iron" },
    { h: 60, c: "bg-lime" },
  ];

  const Side = ({ flip }: { flip?: boolean }) => (
    <div className={`flex items-center gap-[5px] ${flip ? "flex-row-reverse" : ""}`}>
      {plateSet.map((p, i) => (
        <div
          key={i}
          data-plate
          className={`w-3 rounded-[3px] sm:w-4 ${p.c} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),0_0_30px_rgba(198,255,26,0.08)]`}
          style={{ height: p.h * 0.85 }}
        />
      ))}
    </div>
  );

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-label="Loading Peter's Gym" role="status">
      <div data-half="top" className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-half="bottom" className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
      <div className="absolute inset-0 grain" />

      <div data-content className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div data-brand className="mb-14 flex overflow-hidden font-display text-[clamp(2.4rem,7vw,5rem)] leading-none text-white">
          {"PETER'S".split("").map((c, i) => (
            <span key={i} className="inline-block">
              {c}
            </span>
          ))}
          <span className="inline-block w-4" />
          {"GYM".split("").map((c, i) => (
            <span key={i} className="inline-block text-lime">
              {c}
            </span>
          ))}
        </div>

        <div className="flex w-full max-w-[640px] items-center justify-center">
          <Side />
          <div ref={bar} className="mx-1 h-[7px] flex-1 origin-center rounded-full bg-gradient-to-b from-[#e8e8e8] via-[#8a8f94] to-[#3b3e41]" />
          <Side flip />
        </div>

        <div className="mt-14 flex items-end gap-5">
          <div className="font-display text-[clamp(4rem,12vw,8rem)] leading-[0.8] text-white tabular-nums">
            <span ref={counter}>00</span>
          </div>
          <div className="pb-1 font-cond text-xs font-semibold uppercase tracking-[0.35em] text-chrome">
            % loading
            <br />
            the bar
          </div>
        </div>
      </div>
    </div>
  );
}
