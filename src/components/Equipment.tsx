import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, RevealText } from "./ui/Reveal";
import { EQUIPMENT, px } from "../lib/data";
import { gsap, isFinePointer, prefersReducedMotion } from "../lib/scroll";
import { useAnim } from "../hooks/useAnim";
import { playTick } from "../lib/sound";

function EquipmentCard({ item }: { item: (typeof EQUIPMENT)[number] }) {
  const wrap = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);

  // interactive 3D tilt + cursor-following sheen
  useEffect(() => {
    const el = wrap.current;
    const t = tilt.current;
    if (!el || !t || !isFinePointer() || prefersReducedMotion()) return;
    const rx = gsap.quickTo(t, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(t, "rotationY", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px_ = (e.clientX - r.left) / r.width;
      const py_ = (e.clientY - r.top) / r.height;
      ry((px_ - 0.5) * 12);
      rx(-(py_ - 0.5) * 10);
      t.style.setProperty("--mx", `${px_ * 100}%`);
      t.style.setProperty("--my", `${py_ * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerenter", playTick);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerenter", playTick);
    };
  }, []);

  return (
    <article
      ref={wrap}
      data-card
      tabIndex={0}
      data-cursor-label="LIFT"
      className="group relative h-[540px] w-[80vw] shrink-0 snap-center outline-none [perspective:1200px] sm:w-[420px] lg:h-[min(52vh,580px)] lg:w-[min(32vw,500px)]"
    >
      <div ref={tilt} className="relative h-full w-full [transform-style:preserve-3d]">
        <div className="clip-chamfer-lg relative h-full w-full overflow-hidden bg-steel">
          <div className="absolute inset-0 overflow-hidden">
            <img
              data-cardimg
              src={px(item.img, 1000, 1300)}
              alt={item.name}
              loading="lazy"
              className="absolute -left-[12.5%] top-0 h-full w-[125%] max-w-none object-cover grayscale brightness-[0.7] contrast-110 transition-all duration-[1200ms] ease-out group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-90 group-focus-within:grayscale-0"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-transparent" />
          {/* sheen */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(198,255,26,0.18), transparent 60%)" }}
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-8">
            <span className="font-display text-[88px] leading-[0.8] text-outline transition-all duration-500 group-hover:text-lime group-hover:[-webkit-text-stroke:0]">{item.no}</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/30 backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-black">
              <ArrowUpRight size={20} />
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8" style={{ transform: "translateZ(40px)" }}>
            <div className="mb-3 font-cond text-[13px] font-semibold uppercase tracking-[0.25em] text-lime">{item.short}</div>
            <h3 className="font-display text-[clamp(2rem,3vw,2.9rem)] leading-[0.98] text-white">{item.name}</h3>
            <div className="grid grid-rows-[1fr] transition-all duration-700 ease-out lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="pt-4 text-[15px] font-light leading-relaxed text-white/75">{item.desc}</p>
                <div className="flex flex-wrap gap-2 pt-5">
                  {item.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 font-cond text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 h-[2px] origin-left scale-x-[0.12] bg-lime transition-transform duration-700 group-hover:scale-x-100" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Equipment() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useAnim(root, ({ isDesktop }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q("[data-eq-head]"), { y: 60, opacity: 0, stagger: 0.1, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });

    if (!isDesktop) {
      gsap.from(q("[data-card]"), { x: 80, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: track.current, start: "top 85%", once: true } });
      return;
    }

    const getDist = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
    const tween = gsap.to(track.current, {
      x: () => -getDist(),
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: () => `+=${getDist()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(bar.current, { scaleX: self.progress });
          if (count.current) count.current.textContent = String(Math.min(EQUIPMENT.length, Math.round(self.progress * (EQUIPMENT.length - 1)) + 1)).padStart(2, "0");
        },
      },
    });

    // image parallax inside each card, driven by horizontal scroll
    q("[data-card]").forEach((card) => {
      const img = card.querySelector("[data-cardimg]");
      if (!img) return;
      gsap.fromTo(
        img,
        { xPercent: -7 },
        {
          xPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        }
      );
      gsap.fromTo(
        card,
        { opacity: 0.35, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 105%", end: "left 55%", scrub: true },
        }
      );
    });
  });

  return (
    <section ref={root} id="equipment" className="relative overflow-hidden bg-coal py-24 sm:py-32 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="absolute inset-0 grain" />
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-blood/[0.07] blur-[160px]" />
      <div className="absolute -left-20 bottom-0 h-[500px] w-[500px] rounded-full bg-lime/[0.06] blur-[160px]" />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col justify-between gap-8 px-5 sm:px-10 lg:flex-row lg:items-end lg:pl-[5vw] lg:pr-[4vw]">
        <div>
          <div data-eq-head>
            <Eyebrow className="mb-6">Advanced equipment</Eyebrow>
          </div>
          <RevealText
            className="font-display text-[clamp(2.8rem,min(6.6vw,12vh),7.5rem)] leading-[0.92]"
            lines={[
              <span key="a" className="text-white">THE MACHINES</span>,
              <span key="b" className="text-outline-lime">BEHIND THE BEAST.</span>,
            ]}
          />
        </div>
        <div data-eq-head className="flex max-w-sm flex-col gap-5">
          <p className="text-base font-light leading-relaxed text-white/60">
            Six categories of professional-grade equipment, covering every muscle group, every goal and every level.
          </p>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="font-display text-3xl text-white">
              <span ref={count}>01</span>
              <span className="text-white/30"> / {String(EQUIPMENT.length).padStart(2, "0")}</span>
            </span>
            <div className="h-px flex-1 bg-white/15">
              <div ref={bar} className="h-full origin-left scale-x-0 bg-lime" />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="relative mt-12 flex gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] snap-x snap-mandatory sm:gap-7 sm:px-10 lg:mt-10 lg:w-max lg:gap-10 lg:overflow-visible lg:pb-0 lg:pl-[5vw] lg:pr-[8vw] lg:snap-none [&::-webkit-scrollbar]:hidden"
      >
        {EQUIPMENT.map((item) => (
          <EquipmentCard key={item.no} item={item} />
        ))}
      </div>
    </section>
  );
}
