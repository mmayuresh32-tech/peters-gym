import { useRef } from "react";
import { Eyebrow, RevealText } from "./ui/Reveal";
import { ZONES, px } from "../lib/data";
import { gsap } from "../lib/scroll";
import { useAnim } from "../hooks/useAnim";

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="mr-[0.25em] inline-block overflow-hidden whitespace-nowrap pb-[0.06em] align-bottom">
          {w.split("").map((c, ci) => (
            <span key={ci} data-char className="inline-block will-change-transform">
              {c}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function Zones() {
  const root = useRef<HTMLElement>(null);

  useAnim(root, () => {
    const q = gsap.utils.selector(root.current!);

    q("[data-zone]").forEach((zone, i) => {
      const z = gsap.utils.selector(zone);
      const dir = i % 2 === 0 ? -1 : 1;

      // image clip opens up as the zone enters (scroll-based zoom/reveal)
      gsap.fromTo(
        z("[data-clip]"),
        { clipPath: "inset(14% 7% 14% 7%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: zone, start: "top 95%", end: "top 15%", scrub: true } }
      );
      gsap.fromTo(
        z("[data-zimg]"),
        { yPercent: -9, scale: 1.3 },
        { yPercent: 9, scale: 1.02, ease: "none", scrollTrigger: { trigger: zone, start: "top bottom", end: "bottom top", scrub: true } }
      );
      // giant number parallax
      gsap.fromTo(z("[data-num]"), { yPercent: 25, xPercent: dir * -8 }, { yPercent: -25, xPercent: dir * 8, ease: "none", scrollTrigger: { trigger: zone, start: "top bottom", end: "bottom top", scrub: true } });

      // animated title
      gsap.from(z("[data-char]"), {
        yPercent: 120,
        rotate: 8,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: zone, start: "top 45%", once: true },
      });
      gsap.from(z("[data-zin]"), {
        x: dir * -90,
        opacity: 0,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: zone, start: "top 40%", once: true },
      });
      gsap.from(z("[data-zline]"), { scaleX: 0, transformOrigin: dir === -1 ? "left" : "right", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: zone, start: "top 45%", once: true } });
    });
  });

  return (
    <section ref={root} id="zones" className="relative bg-ink">
      <div className="mx-auto max-w-[1520px] px-5 pb-20 pt-28 sm:px-10 sm:pb-28 sm:pt-36 lg:pt-44">
        <Eyebrow className="mb-8">Training zones</Eyebrow>
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <RevealText
            className="font-display text-[clamp(3rem,9vw,9.5rem)] leading-[0.9]"
            lines={[
              <span key="a" className="text-white">FIVE ZONES.</span>,
              <span key="b" className="text-lime">ONE MISSION.</span>,
            ]}
          />
          <ol className="grid grid-cols-1 gap-x-10 gap-y-2 font-cond text-sm font-semibold uppercase tracking-[0.25em] text-chrome sm:grid-cols-2 lg:max-w-md">
            {ZONES.map((z) => (
              <li key={z.no} className="flex items-center gap-3 border-b border-white/10 py-2">
                <span className="text-lime">{z.no}</span>
                {z.name}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {ZONES.map((z, i) => {
        const right = i % 2 === 1;
        return (
          <div key={z.no} data-zone className="relative h-[92svh] min-h-[620px] w-full overflow-hidden bg-ink">
            <div data-clip className="absolute inset-0 overflow-hidden">
              <img
                data-zimg
                src={px(z.img, 1920, 1200)}
                alt={z.name}
                loading="lazy"
                className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover brightness-[0.62] contrast-110 saturate-[0.9]"
              />
              <div className={`absolute inset-0 ${right ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-ink/90 via-ink/40 to-transparent`} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />
              <div className="absolute inset-0 grain" />
            </div>

            {/* giant outline number */}
            <div
              data-num
              aria-hidden="true"
              className={`font-display text-outline pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-[clamp(12rem,38vw,40rem)] leading-none opacity-70 ${right ? "left-[-2vw]" : "right-[-2vw]"}`}
            >
              {z.no}
            </div>

            <div className={`relative z-10 mx-auto flex h-full max-w-[1520px] items-end px-5 pb-14 sm:px-10 sm:pb-20 lg:items-center lg:pb-0 ${right ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[640px] ${right ? "lg:text-right" : ""}`}>
                <div data-zin className={`mb-5 flex items-center gap-4 font-cond text-[13px] font-semibold uppercase tracking-[0.35em] text-lime ${right ? "lg:flex-row-reverse" : ""}`}>
                  <span>Zone {z.no} / 05</span>
                  <span data-zline className="h-px w-24 bg-lime" />
                </div>
                <h3 className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.92] text-white" aria-label={z.name}>
                  <span aria-hidden="true">
                    <Chars text={z.name} />
                  </span>
                </h3>
                <p data-zin className="mt-5 font-display text-2xl text-lime sm:text-3xl">
                  {z.line}
                </p>
                <p data-zin className="mt-5 max-w-lg text-base font-light leading-relaxed text-white/70 sm:text-lg lg:inline-block">
                  {z.desc}
                </p>
                <div data-zin className={`mt-7 flex flex-wrap gap-2 ${right ? "lg:justify-end" : ""}`}>
                  {z.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/25 bg-black/30 px-4 py-1.5 font-cond text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
