import { useRef } from "react";
import { Check, Crown } from "lucide-react";
import { Eyebrow, RevealText } from "./ui/Reveal";
import Button from "./ui/Button";
import { PLANS, PLAN_PRICE_PLACEHOLDER, whatsappLink } from "../lib/data";
import { gsap } from "../lib/scroll";
import { useAnim } from "../hooks/useAnim";
import { WhatsAppIcon } from "./ui/Icons";

const PERKS = ["Access to all five training zones", "Full equipment floor — every machine", "Welcome orientation for new members"];

export default function Membership() {
  const root = useRef<HTMLElement>(null);

  useAnim(root, () => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q("[data-plan]"), {
      y: 120,
      opacity: 0,
      rotateX: -12,
      transformOrigin: "50% 100%",
      duration: 1.3,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: q("[data-plans]")[0], start: "top 82%", once: true },
    });
  });

  // spotlight that follows the cursor on each card
  const spot = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={root} id="membership" className="relative overflow-hidden bg-ink py-28 sm:py-36 lg:py-44">
      <div className="absolute inset-0 grid-lines opacity-60" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-lime/[0.06] blur-[160px]" />

      <div className="relative mx-auto max-w-[1520px] px-5 sm:px-10">
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow className="mb-8">Membership</Eyebrow>
            <RevealText
              className="font-display text-[clamp(3rem,8.5vw,9rem)] leading-[0.9]"
              lines={[
                <span key="1" className="text-white">PICK YOUR</span>,
                <span key="2" className="text-outline-lime">COMMITMENT.</span>,
              ]}
            />
          </div>
          <p className="max-w-sm text-base font-light leading-relaxed text-white/60">
            Four ways to join. Pricing is shared on enquiry — message us on WhatsApp and we'll send current rates and offers.
          </p>
        </div>

        <div data-plans className="grid gap-5 [perspective:1400px] sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p, i) => (
            <article
              key={p.name}
              data-plan
              onPointerMove={spot}
              className={`group relative ${p.featured ? "xl:-mt-6 xl:mb-6" : ""}`}
            >
              <div
                className={`clip-chamfer-lg relative flex h-full min-h-[560px] flex-col overflow-hidden p-8 transition-transform duration-700 ease-out group-hover:-translate-y-2 ${
                  p.featured ? "bg-lime text-black" : "bg-gradient-to-b from-steel to-coal text-white"
                }`}
              >
                {!p.featured && (
                  <>
                    <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(198,255,26,0.16), transparent 65%)" }}
                    />
                  </>
                )}
                {p.featured && <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/30 blur-3xl" />}

                <div className="relative flex items-start justify-between">
                  <span className={`font-cond text-sm font-bold uppercase tracking-[0.3em] ${p.featured ? "text-black/70" : "text-lime"}`}>
                    {String(i + 1).padStart(2, "0")} — {p.term}
                  </span>
                  {p.featured && (
                    <span className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1 font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
                      <Crown size={12} /> Full year
                    </span>
                  )}
                </div>

                <h3 className="relative mt-10 font-display text-[clamp(2.6rem,4vw,3.6rem)] leading-[0.95]">{p.name}</h3>
                <p className={`relative mt-3 text-sm ${p.featured ? "text-black/70" : "text-white/55"}`}>{p.note}</p>

                <div className={`relative my-8 h-px ${p.featured ? "bg-black/20" : "bg-white/10"}`} />

                <div className="relative">
                  <div className={`font-cond text-xs font-semibold uppercase tracking-[0.3em] ${p.featured ? "text-black/60" : "text-chrome"}`}>Price</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-[clamp(3.4rem,5vw,4.6rem)] leading-none">{PLAN_PRICE_PLACEHOLDER}</span>
                    <span className={`font-cond text-sm uppercase tracking-widest ${p.featured ? "text-black/60" : "text-white/40"}`}>/ {p.term.toLowerCase()}</span>
                  </div>
                  <div className={`mt-1 text-xs italic ${p.featured ? "text-black/50" : "text-white/35"}`}>Placeholder — edit in lib/data.ts</div>
                </div>

                <ul className="relative mt-8 space-y-3 text-sm">
                  {PERKS.map((perk) => (
                    <li key={perk} className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${p.featured ? "bg-black text-lime" : "bg-lime/15 text-lime"}`}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className={p.featured ? "text-black/80" : "text-white/70"}>{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto pt-10">
                  <Button
                    href={whatsappLink(`Hi Peter's Gym! I'm interested in the ${p.name} membership (${p.term}). Could you share the details?`)}
                    external
                    variant={p.featured ? "dark" : "primary"}
                    icon={<WhatsAppIcon className="h-[17px] w-[17px]" />}
                    className="w-full justify-center"
                  >
                    Join now
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
