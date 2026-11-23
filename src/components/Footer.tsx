import { Phone, Mail } from "lucide-react";
import { Logo } from "./Navbar";
import { CONFIG, NAV, telLink } from "../lib/data";
import { scrollToId } from "../lib/scroll";
import { InstagramIcon } from "./ui/Icons";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black pt-20">
      <div className="relative z-10 mx-auto grid max-w-[1520px] gap-14 px-5 sm:px-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm text-[15px] font-light leading-relaxed text-white/55">
            Built for those who never quit. Advanced machines, spacious zones and an atmosphere that turns discipline into strength.
          </p>
          <a
            href={CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-2.5 font-cond text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all hover:border-lime hover:bg-lime hover:text-black"
          >
            <InstagramIcon className="h-[18px] w-[18px]" /> {CONFIG.instagramHandle}
          </a>
        </div>

        <div className="md:col-span-3">
          <div className="mb-5 font-cond text-xs font-semibold uppercase tracking-[0.35em] text-lime">Navigate</div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <button onClick={() => scrollToId(n.id)} data-cursor="hover" className="group flex items-center gap-2 font-cond text-lg font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white">
                  <span className="h-px w-0 bg-lime transition-all duration-500 group-hover:w-5" />
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="mb-5 font-cond text-xs font-semibold uppercase tracking-[0.35em] text-lime">Contact</div>
          <ul className="space-y-4 text-[15px] text-white/70">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-lime" />
              <a href={telLink} className="transition-colors hover:text-white">{CONFIG.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-lime" />
              <a href={`mailto:${CONFIG.email}`} className="transition-colors hover:text-white">{CONFIG.email}</a>
            </li>
            <li className="text-white/50">
              {CONFIG.addressLines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div className="font-display text-outline-dim pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[clamp(5rem,22vw,26rem)] leading-[0.75]" aria-hidden="true">
        PETER'S GYM
      </div>

      <div className="relative z-10 border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-[1520px] flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/45 sm:flex-row sm:px-10">
          <span>© {new Date().getFullYear()} Peter's Gym. All rights reserved.</span>
          <span className="font-cond uppercase tracking-[0.3em]">Train hard · Stay disciplined · Never quit</span>
        </div>
      </div>
    </footer>
  );
}
