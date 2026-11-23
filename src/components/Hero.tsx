import { useEffect, useRef } from "react";
import { ChevronDown, Flame } from "lucide-react";
import HeroScene from "./HeroScene";
import Button from "./ui/Button";
import { IMG, px, whatsappLink } from "../lib/data";
import { gsap, scrollState, scrollToId } from "../lib/scroll";
import { useAnim } from "../hooks/useAnim";

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  useAnim(root, () => {
    const q = gsap.utils.selector(root.current!);

    // --- hidden initial states for the intro (revealed once loader finishes)
    gsap.set(q("[data-hl-in]"), { yPercent: 120, rotate: 4 });
    gsap.set(q("[data-intro]"), { y: 40, opacity: 0 });
    gsap.set(q("[data-bgin]"), { scale: 1.25, opacity: 0 });
    gsap.set(q("[data-canvasin]"), { opacity: 0 });

    const it = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
    it.to(q("[data-bgin]"), { opacity: 1, scale: 1.05, duration: 2.4 }, 0)
      .to(q("[data-canvasin]"), { opacity: 1, duration: 1.6 }, 0.1)
      .to(q("[data-hl-in]"), { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.14 }, 0.2)
      .to(q("[data-intro]"), { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, 0.9)
      .fromTo(q("[data-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 2, ease: "power3.out" }, 1.3);
    intro.current = it;

    // --- scroll-driven pin: dumbbell spins, zooms through the camera while headline splits apart
    scrollState.hero = 0;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=110%",
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
      },
    });
    tl.to(scrollState, { hero: 1, ease: "none", duration: 1 }, 0)
      .to(q("[data-bg]"), { scale: 1.45, ease: "none", duration: 1 }, 0)
      .to(q("[data-fg]"), { y: -80, opacity: 0, ease: "power2.in", duration: 0.5 }, 0)
      .to(q("[data-shade]"), { opacity: 1, ease: "none", duration: 0.35 }, 0.65)
      .to(q("[data-canvas]"), { opacity: 0, ease: "none", duration: 0.25 }, 0.8);
    q("[data-hl]").forEach((h, i) => {
      tl.to(h, { xPercent: i % 2 ? 28 : -28, ease: "none", duration: 1 }, 0).to(h, { opacity: 0, duration: 0.4, ease: "none" }, 0.5);
    });

    return () => {
      scrollState.hero = 0;
    };
  });

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  const explore = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId("about");
  };

  const lines = [
    { t: "BUILT FOR", c: "text-white" },
    { t: "THOSE WHO", c: "text-outline" },
    { t: "NEVER QUIT.", c: "text-lime" },
  ];

  return (
    <section ref={root} id="home" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* cinematic background */}
      <div data-bg className="absolute inset-0 will-change-transform">
        <div data-bgin className="h-full w-full">
          <img
            src={px(IMG.heroBg, 1920)}
            alt=""
            className="h-full w-full object-cover opacity-50 grayscale contrast-125"
            fetchPriority="high"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(255,255,255,0.1),transparent_55%)]" />
      <div className="absolute -left-40 bottom-[-20%] h-[70vh] w-[70vh] rounded-full bg-lime/[0.12] blur-[140px]" />
      <div className="absolute -right-32 -top-32 h-[60vh] w-[60vh] rounded-full bg-blood/[0.16] blur-[150px]" />
      <div className="grid-lines absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-sweep absolute -top-1/4 left-0 h-[150%] w-40 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />
      <div className="absolute inset-0 grain" />

      {/* giant headline (sits behind the 3D object) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-5 pb-[22vh] pt-20 sm:px-10 lg:pb-[16vh] lg:pl-[5vw]">
        <h1 className="font-display leading-[0.88] text-[clamp(3.6rem,min(12.5vw,19vh),13rem)]">
          <span className="sr-only">Built for those who never quit.</span>
          {lines.map((l, i) => (
            <div key={i} data-hl aria-hidden="true" className={`will-change-transform ${l.c}`}>
              <span className="block overflow-hidden pb-[0.06em] pr-[0.05em]">
                <span data-hl-in className="block">
                  {l.t}
                </span>
              </span>
            </div>
          ))}
        </h1>
      </div>

      {/* 3D */}
      <div data-canvas className="pointer-events-none absolute inset-0 z-20">
        <div data-canvasin className="absolute inset-0">
          <HeroScene ready={ready} />
        </div>
      </div>

      {/* foreground */}
      <div data-fg className="absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end gap-8 px-5 pb-8 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:pb-12 lg:pl-[5vw] lg:pr-[4vw]">
        <div className="max-w-xl">
          <p data-intro className="mb-7 max-w-md font-sans text-base font-light leading-relaxed text-white/80 sm:text-lg">
            More than a gym. A place where <span className="font-medium text-white">discipline becomes strength.</span>
          </p>
          <div data-intro className="flex flex-wrap items-center gap-4">
            <Button href={whatsappLink("Hi Peter's Gym! I want to start my journey.")} external size="lg">
              Start your journey
            </Button>
            <Button href="#about" onClick={explore} variant="ghost" size="lg">
              Explore the gym
            </Button>
          </div>
        </div>

        {/* glass session card */}
        <div data-intro className="glass hidden w-[360px] shrink-0 rounded-[28px] p-5 lg:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-cond text-[12px] font-semibold uppercase tracking-[0.25em] text-chrome">
              <Flame size={14} className="text-lime" /> Today's session
            </div>
            <span className="rounded-full bg-lime/15 px-3 py-1 font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-lime">Push day</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-display text-5xl leading-none text-white">78<span className="text-lime">%</span></span>
            <span className="pb-1 font-cond text-xs uppercase tracking-[0.2em] text-chrome">Discipline meter</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div data-bar className="h-full origin-left rounded-full bg-gradient-to-r from-lime/60 to-lime shadow-[0_0_16px_rgba(198,255,26,0.8)]" style={{ width: "78%" }} />
          </div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-white/10 text-center">
            {[
              ["12/16", "Sets"],
              ["96", "Reps"],
              ["48m", "Time"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl leading-none text-white">{v}</div>
                <div className="mt-1 font-cond text-[11px] uppercase tracking-[0.25em] text-chrome">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <button
        onClick={() => scrollToId("about")}
        aria-label="Scroll down"
        data-fg
        className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 font-cond text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60 [writing-mode:vertical-rl] xl:flex"
      >
        Scroll
        <span className="relative h-16 w-px overflow-hidden bg-white/20 [writing-mode:horizontal-tb]">
          <span className="animate-scroll-line absolute inset-0 bg-lime" />
        </span>
        <ChevronDown size={14} className="text-lime" />
      </button>

      <div data-shade className="pointer-events-none absolute inset-0 z-40 bg-ink opacity-0" />
    </section>
  );
}
