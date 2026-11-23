import { useRef } from "react";
import { Activity, Cog, Dumbbell, HeartHandshake, Maximize2, Sprout, Warehouse } from "lucide-react";
import { Eyebrow, RevealText } from "./ui/Reveal";
import Button from "./ui/Button";
import { WHY } from "../lib/data";
import { gsap, scrollToId } from "../lib/scroll";
import { useAnim } from "../hooks/useAnim";

const ICONS = [Cog, Warehouse, Maximize2, Activity, HeartHandshake, Sprout];

export default function Why() {
  const root = useRef<HTMLElement>(null);

  useAnim(root, () => {
    const q = gsap.utils.selector(root.current!);
    q("[data-row]").forEach((row, i) => {
      const r = gsap.utils.selector(row);
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } });
      tl.from(r("[data-rline]"), { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "expo.inOut" }, 0)
        .from(r("[data-rin]"), { x: i % 2 ? 120 : 70, opacity: 0, duration: 1.2, ease: "power4.out", stagger: 0.08 }, 0.1)
        .from(r("[data-ricon]"), { scale: 0, rotate: -90, duration: 0.9, ease: "back.out(2)" }, 0.25);
    });
    gsap.to(q("[data-ring]"), { rotate: 360, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } });
  });

  return (
    <section ref={root} id="why" className="relative overflow-x-clip bg-coal py-28 sm:py-36 lg:py-44">
      <div className="absolute inset-0 grain" />
      <div className="absolute right-[-10%] top-1/4 h-[600px] w-[600px] rounded-full bg-lime/[0.05] blur-[160px]" />

      <div className="relative mx-auto grid max-w-[1520px] gap-16 px-5 sm:px-10 lg:grid-cols-12 lg:gap-12">
        {/* sticky intro */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow className="mb-8">Why choose Peter's Gym</Eyebrow>
            <RevealText
              className="font-display text-[clamp(3.2rem,8vw,8.5rem)] leading-[0.9]"
              lines={[
                <span key="1" className="text-white">STRONGER</span>,
                <span key="2" className="text-white">STARTS</span>,
                <span key="3" className="text-lime">HERE.</span>,
              ]}
            />
            <p className="mt-8 max-w-md text-[17px] font-light leading-relaxed text-white/60">
              Everything you need to train hard, recover well and keep coming back — under one roof, in an environment that rewards effort.
            </p>
            <div className="mt-10 flex items-center gap-8">
              <Button variant="ghost" onClick={() => scrollToId("membership")}>
                See memberships
              </Button>
              <div className="relative hidden h-28 w-28 items-center justify-center sm:flex">
                <svg data-ring viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-white/30">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 5" />
                  <circle cx="50" cy="2" r="2.5" fill="#c6ff1a" />
                </svg>
                <Dumbbell size={30} className="text-lime" />
              </div>
            </div>
          </div>
        </div>

        {/* benefit rows */}
        <ul className="lg:col-span-7">
          {WHY.map((w, i) => {
            const Icon = ICONS[i];
            return (
              <li key={w.title} data-row className="group relative">
                <div data-rline className="absolute inset-x-0 top-0 h-px bg-white/15" />
                <div className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-lime/[0.09] to-transparent transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-x-100" />
                <div className="relative flex items-start gap-5 py-9 sm:gap-8 sm:py-11">
                  <span data-rin className="w-10 shrink-0 pt-2 font-cond text-lg font-bold tracking-widest text-lime sm:w-14">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div data-rin className="min-w-0 flex-1">
                    <h3 className="font-display text-[clamp(1.7rem,3.2vw,3rem)] leading-[1] text-white transition-transform duration-500 group-hover:translate-x-3">
                      {w.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-[15px] font-light leading-relaxed text-white/55 transition-colors duration-500 group-hover:text-white/80">
                      {w.desc}
                    </p>
                  </div>
                  <span
                    data-ricon
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-500 group-hover:rotate-[360deg] group-hover:border-lime group-hover:bg-lime group-hover:text-black sm:h-16 sm:w-16"
                  >
                    <Icon size={24} />
                  </span>
                </div>
              </li>
            );
          })}
          <li className="h-px bg-white/15" />
        </ul>
      </div>
    </section>
  );
}
