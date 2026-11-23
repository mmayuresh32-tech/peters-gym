import { useRef } from "react";
import { Cog, Maximize2, Flame, Users } from "lucide-react";
import { Eyebrow, FadeIn, RevealText } from "./ui/Reveal";
import { IMG, px } from "../lib/data";
import { gsap } from "../lib/scroll";
import { useAnim } from "../hooks/useAnim";

const FEATURES = [
  { icon: Cog, t: "Advanced equipment", d: "Modern machines for every muscle group." },
  { icon: Maximize2, t: "Spacious training zones", d: "Room to lift, move and breathe." },
  { icon: Flame, t: "Motivating environment", d: "Energy that pulls you through the last rep." },
  { icon: Users, t: "All levels welcome", d: "Beginners and seasoned athletes, side by side." },
];

const STATS = [
  { n: 5, l: "Training zones", suffix: "" },
  { n: 6, l: "Equipment categories", suffix: "" },
  { n: 100, l: "Commitment", suffix: "%" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useAnim(root, ({ isDesktop }) => {
    const q = gsap.utils.selector(root.current!);
    const st = (trigger: Element | string, extra: object = {}) => ({
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      ...extra,
    });

    // scroll-based image zoom
    gsap.fromTo(q("[data-zoom] img"), { scale: 1.45 }, { scale: 1.05, ease: "none", scrollTrigger: st(q("[data-collage]")[0], { start: "top 90%", end: "bottom 30%" }) });
    // entering from different directions
    gsap.from(q("[data-main]"), { xPercent: -14, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: q("[data-collage]")[0], start: "top 80%", once: true } });
    gsap.from(q("[data-second]"), { xPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: q("[data-collage]")[0], start: "top 65%", once: true } });
    gsap.from(q("[data-third]"), { yPercent: 40, xPercent: -20, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: q("[data-collage]")[0], start: "top 55%", once: true } });
    // parallax layers
    if (isDesktop) {
      gsap.to(q("[data-second-wrap]"), { yPercent: -18, ease: "none", scrollTrigger: st(q("[data-collage]")[0]) });
      gsap.to(q("[data-third-wrap]"), { yPercent: 14, ease: "none", scrollTrigger: st(q("[data-collage]")[0]) });
      gsap.to(q("[data-copy]"), { yPercent: -8, ease: "none", scrollTrigger: st(q("[data-collage]")[0]) });
    }
    gsap.to(q("[data-bgtext]"), { xPercent: -18, ease: "none", scrollTrigger: st(root.current!) });
    gsap.to(q("[data-spin]"), { rotate: 220, ease: "none", scrollTrigger: st(root.current!) });

    // counters
    q("[data-count]").forEach((el) => {
      const target = Number((el as HTMLElement).dataset.count);
      const o = { v: 0 };
      gsap.to(o, {
        v: target,
        duration: 2,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = String(Math.round(o.v)).padStart(2, "0");
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    gsap.from(q("[data-feature]"), { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: q("[data-features]")[0], start: "top 85%", once: true } });
  });

  return (
    <section ref={root} id="about" className="relative overflow-hidden bg-ink py-28 sm:py-36 lg:py-48">
      {/* backdrop */}
      <div
        data-bgtext
        className="font-display text-outline-dim pointer-events-none absolute left-0 top-24 select-none whitespace-nowrap text-[clamp(10rem,32vw,34rem)] leading-none"
        aria-hidden="true"
      >
        PETER'S GYM — PETER'S GYM
      </div>
      <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-lime/[0.05] blur-[140px]" />

      <div className="relative mx-auto max-w-[1520px] px-5 sm:px-10">
        <Eyebrow className="mb-8">About Peter's Gym</Eyebrow>

        <RevealText
          className="font-display text-[clamp(3.2rem,10.2vw,10.5rem)] leading-[0.9]"
          lines={[
            <span key="1" className="text-white">YOUR GOALS.</span>,
            <span key="2" className="text-outline">OUR MACHINES.</span>,
            <span key="3" className="text-lime">NO EXCUSES.</span>,
          ]}
        />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* collage */}
          <div data-collage className="relative h-[560px] sm:h-[760px] lg:col-span-7 lg:h-[880px]">
            <div data-main className="absolute left-0 top-0 h-[78%] w-[78%] sm:w-[72%]">
              <div data-zoom className="clip-chamfer-lg relative h-full w-full overflow-hidden bg-steel">
                <img src={px(IMG.aboutMain, 1200, 1400)} alt="Spacious training floor at Peter's Gym with modern machines" loading="lazy" className="h-full w-full object-cover brightness-[0.85] contrast-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 font-cond text-xs font-semibold uppercase tracking-[0.3em] text-white/80">The main floor</div>
              </div>
            </div>

            <div data-second-wrap className="absolute right-0 top-[26%] z-10 w-[48%] sm:w-[44%]">
              <div data-second className="clip-chamfer relative aspect-[3/4] overflow-hidden bg-steel ring-8 ring-ink shadow-2xl">
                <div data-zoom className="h-full w-full">
                  <img src={px(IMG.aboutSecond, 800, 1100)} alt="Athlete training with determination" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>

            <div data-third-wrap className="absolute bottom-0 left-[6%] z-20 w-[42%] sm:w-[34%]">
              <div data-third className="clip-chamfer relative aspect-[5/4] overflow-hidden bg-steel ring-8 ring-ink shadow-2xl">
                <div data-zoom className="h-full w-full">
                  <img src={px(IMG.aboutThird, 700, 600)} alt="Weight stack detail on a strength machine" loading="lazy" className="h-full w-full object-cover grayscale" />
                </div>
                <div className="absolute inset-0 bg-lime/20 mix-blend-multiply" />
              </div>
            </div>

            {/* rotating badge */}
            <div className="absolute -right-2 bottom-[8%] z-30 hidden h-36 w-36 items-center justify-center sm:flex lg:right-[6%]">
              <svg data-spin viewBox="0 0 120 120" className="absolute inset-0 h-full w-full text-white">
                <defs>
                  <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                </defs>
                <text fontSize="10.5" fontFamily="Barlow Condensed" fontWeight="700" letterSpacing="3.4" fill="currentColor">
                  <textPath href="#circ">BEGINNERS • ATHLETES • EVERYONE •</textPath>
                </text>
              </svg>
              <div className="flex h-16 w-16 items-center justify-center clip-chamfer bg-lime font-display text-2xl text-black">PG</div>
            </div>
          </div>

          {/* copy */}
          <div data-copy className="flex flex-col justify-center lg:col-span-5 lg:pl-8">
            <FadeIn>
              <p className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15] text-white">
                A modern fitness facility, built around one idea: <span className="text-lime">become stronger than yesterday.</span>
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-7 text-[17px] font-light leading-[1.75] text-white/65">
                Peter's Gym brings together advanced equipment, spacious training zones and a motivating environment — a place where first-timers feel welcome and experienced
                athletes find the tools to push further. No clutter. No noise. Just space, iron and intent.
              </p>
            </FadeIn>

            <div data-features className="mt-10 grid gap-3 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, t, d }) => (
                <div key={t} data-feature className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-500 hover:border-lime/60 hover:bg-lime/[0.06]">
                  <Icon size={22} className="mb-4 text-lime transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-12" />
                  <div className="font-cond text-lg font-bold uppercase tracking-wider text-white">{t}</div>
                  <div className="mt-1 text-sm text-white/55">{d}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {STATS.map((s) => (
                <div key={s.l}>
                  <div className="font-display text-5xl leading-none text-white sm:text-6xl">
                    <span data-count={s.n}>00</span>
                    <span className="text-lime">{s.suffix ?? "+"}</span>
                  </div>
                  <div className="mt-2 font-cond text-xs font-semibold uppercase tracking-[0.25em] text-chrome">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
