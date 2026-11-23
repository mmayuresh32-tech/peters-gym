import { useRef } from "react";
import Button from "./ui/Button";
import { IMG, px, whatsappLink } from "../lib/data";
import { gsap } from "../lib/scroll";
import { useAnim } from "../hooks/useAnim";

const WORDS = ["THE", "ONLY", "COMPETITION", "IS", "WHO", "YOU", "WERE", "YESTERDAY."];
const MARQUEE = "NO EXCUSES • NO LIMITS • NO SHORTCUTS • NO QUIT • ";

export default function Motivation() {
  const root = useRef<HTMLElement>(null);

  useAnim(root, () => {
    const q = gsap.utils.selector(root.current!);
    gsap.set(q("[data-w]"), { opacity: 0.1, y: 30 });
    gsap.set(q("[data-after]"), { opacity: 0, y: 40 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: 0.7, anticipatePin: 1 },
    });
    tl.fromTo(q("[data-mbg]"), { scale: 1.05 }, { scale: 1.45, ease: "none", duration: 1 }, 0)
      .fromTo(q("[data-mrow='0']"), { xPercent: 0 }, { xPercent: -25, ease: "none", duration: 1 }, 0)
      .fromTo(q("[data-mrow='1']"), { xPercent: -30 }, { xPercent: 0, ease: "none", duration: 1 }, 0)
      .fromTo(q("[data-glow]"), { opacity: 0.2, scale: 0.8 }, { opacity: 1, scale: 1.3, ease: "none", duration: 1 }, 0)
      .to(q("[data-w]"), { opacity: 1, y: 0, stagger: 0.12, duration: 0.2, ease: "power2.out" }, 0.05)
      .to(q("[data-last]"), { color: "#c6ff1a", textShadow: "0 0 60px rgba(198,255,26,0.45)", duration: 0.2 }, ">")
      .to(q("[data-after]"), { opacity: 1, y: 0, duration: 0.25, stagger: 0.1 }, ">-0.05")
      .to({}, { duration: 0.3 });
  });

  return (
    <section ref={root} id="transformation" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
      <div data-mbg className="absolute inset-0 will-change-transform">
        <img
          src={px(IMG.motivation, 1920, 1200)}
          alt=""
          loading="lazy"
          className="animate-kenburns h-full w-full object-cover opacity-45 grayscale contrast-125"
        />
      </div>
      <div data-glow className="absolute bottom-[-30%] left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 rounded-full bg-blood/30 blur-[160px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000_95%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      <div className="absolute inset-0 grain" />
      <div className="animate-sweep pointer-events-none absolute -top-1/4 left-0 h-[150%] w-60 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* outlined marquee rows */}
      <div className="pointer-events-none absolute inset-x-0 top-[9%] select-none overflow-hidden" aria-hidden="true">
        <div data-mrow="0" className="whitespace-nowrap font-display text-[clamp(5rem,13vw,13rem)] leading-none text-outline-dim">
          {MARQUEE.repeat(3)}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[7%] select-none overflow-hidden" aria-hidden="true">
        <div data-mrow="1" className="whitespace-nowrap font-display text-[clamp(5rem,13vw,13rem)] leading-none text-outline-dim">
          {MARQUEE.repeat(3)}
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center sm:px-10">
        <div className="mb-8 flex items-center gap-4 font-cond text-[13px] font-semibold uppercase tracking-[0.4em] text-lime">
          <span className="h-px w-10 bg-lime" /> Transformation <span className="h-px w-10 bg-lime" />
        </div>
        <h2 className="max-w-[1400px] font-display text-[clamp(2.7rem,8.4vw,9rem)] leading-[0.95] text-white" aria-label={WORDS.join(" ")}>
          {WORDS.map((w, i) => (
            <span
              key={w}
              data-w
              {...(i === WORDS.length - 1 ? { "data-last": true } : {})}
              aria-hidden="true"
              className="mr-[0.22em] inline-block will-change-transform"
            >
              {w}
            </span>
          ))}
        </h2>
        <div className="mt-10 flex flex-col items-center gap-8 sm:mt-14">
          <p data-after className="max-w-md font-sans text-base font-light text-white/70 sm:text-lg">
            Show up today. Outwork the person you were yesterday. Repeat until you don't recognise them.
          </p>
          <div data-after>
            <Button href={whatsappLink("Hi Peter's Gym! I'm ready to start my transformation.")} external size="lg">
              Start your transformation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
