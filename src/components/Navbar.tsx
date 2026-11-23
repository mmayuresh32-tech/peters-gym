import { useEffect, useRef, useState } from "react";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import { NAV, whatsappLink, CONFIG } from "../lib/data";
import { gsap, getLenis, scrollToId, scrollToTop } from "../lib/scroll";
import { isSoundOn, playClank, setSound } from "../lib/sound";
import { InstagramIcon } from "./ui/Icons";
import Button from "./ui/Button";

export default function Navbar({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sound, setSoundState] = useState(false);
  const wrap = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // appearance change on scroll
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // intro
  useEffect(() => {
    if (!ready || !wrap.current) return;
    gsap.fromTo(wrap.current, { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.2 });
  }, [ready]);

  // mobile menu animation + scroll lock
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.set(m, { display: "flex" });
      gsap.fromTo(m, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo("[data-m-item]", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.07, duration: 0.9, ease: "expo.out", delay: 0.35 });
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      gsap.to(m, {
        clipPath: "circle(0% at 92% 4%)",
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(m, { display: "none" });
        },
      });
    }
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  const toggleSound = async () => {
    const next = !isSoundOn();
    await setSound(next);
    setSoundState(next);
    if (next) playClank(180, 0.09);
  };

  return (
    <>
      <header ref={wrap} className="fixed inset-x-0 top-0 z-[70] flex justify-center px-3 pt-3 opacity-0 sm:px-6 sm:pt-5">
        <nav
          className={`flex w-full items-center justify-between transition-all duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${
            scrolled
              ? "glass max-w-[1100px] rounded-full py-2.5 pl-6 pr-2.5 shadow-2xl"
              : "max-w-[1600px] rounded-full border border-transparent py-3 pl-2 pr-2 sm:pl-4"
          }`}
        >
          <button onClick={scrollToTop} className="group flex items-center gap-2.5" aria-label="Peter's Gym — back to top" data-cursor="hover">
            <Logo />
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => go(n.id)}
                  data-cursor="hover"
                  className="group relative px-4 py-2 font-cond text-[14px] font-semibold uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-white"
                >
                  {n.label}
                  <span className="absolute bottom-1 left-4 right-4 h-px origin-left scale-x-0 bg-lime transition-transform duration-500 group-hover:scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              aria-label={sound ? "Turn sound off" : "Turn sound on"}
              aria-pressed={sound}
              data-cursor="hover"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-lime hover:text-lime"
              title="Ambient sound (off by default)"
            >
              {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <div className="hidden sm:block">
              <Button href={whatsappLink()} external variant={scrolled ? "primary" : "ghost"}>
                Join Now
              </Button>
            </div>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              data-cursor="hover"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-black lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div ref={menu} style={{ display: "none" }} className="fixed inset-0 z-[95] flex-col justify-between bg-ink px-6 pb-8 pt-5 grain">
        <div className="absolute -right-24 top-1/3 h-[420px] w-[420px] rounded-full bg-lime/10 blur-[120px]" />
        <div className="relative flex items-center justify-between">
          <Logo />
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20">
            <X size={20} />
          </button>
        </div>
        <ul className="relative space-y-1">
          {NAV.map((n, i) => (
            <li key={n.id} className="overflow-hidden">
              <button data-m-item onClick={() => go(n.id)} className="group flex w-full items-baseline gap-4 py-1.5 text-left">
                <span className="font-cond text-sm tracking-widest text-lime">0{i + 1}</span>
                <span className="font-display text-[clamp(2.6rem,12vw,4.5rem)] leading-[1.02] text-white transition-colors group-active:text-lime">{n.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="relative space-y-5">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="clip-chamfer flex items-center justify-center bg-lime py-4 font-cond text-sm font-bold uppercase tracking-[0.2em] text-black">
            Join Now on WhatsApp
          </a>
          <div className="flex items-center justify-between font-cond text-sm uppercase tracking-[0.2em] text-chrome">
            <span>{CONFIG.phoneDisplay}</span>
            <a href={CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white">
              <InstagramIcon /> Instagram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center clip-chamfer bg-lime">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" fill="currentColor">
          <path d="M3 9h2V7h2v10H5v-2H3v-2H1v-2h2V9Zm18 0v2h2v2h-2v2h-2v2h-2V7h2v2h2ZM8 11h8v2H8v-2Z" />
        </svg>
      </span>
      <span className="font-display text-[22px] leading-none tracking-wide text-white">
        PETER'S <span className="text-lime">GYM</span>
      </span>
    </span>
  );
}
