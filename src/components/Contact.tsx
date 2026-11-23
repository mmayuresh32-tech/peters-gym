import { useRef } from "react";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { Eyebrow, FadeIn, RevealText } from "./ui/Reveal";
import Button from "./ui/Button";
import { InstagramIcon, WhatsAppIcon } from "./ui/Icons";
import { CONFIG, IMG, directionsLink, mapEmbedSrc, px, telLink, whatsappLink } from "../lib/data";
import { gsap } from "../lib/scroll";
import { useAnim } from "../hooks/useAnim";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useAnim(root, () => {
    const q = gsap.utils.selector(root.current!);
    gsap.fromTo(q("[data-cbg]"), { yPercent: -10, scale: 1.2 }, { yPercent: 10, scale: 1.05, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(q("[data-map]"), { clipPath: "inset(0 0 100% 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: q("[data-map]")[0], start: "top 85%", once: true } });
    gsap.from(q("[data-info]"), { x: -60, opacity: 0, duration: 1.1, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: q("[data-infos]")[0], start: "top 82%", once: true } });
  });

  const info = [
    {
      icon: MapPin,
      label: "Location",
      body: (
        <>
          {CONFIG.addressLines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </>
      ),
    },
    {
      icon: Phone,
      label: "Call us",
      body: (
        <a href={telLink} data-cursor="hover" className="transition-colors hover:text-lime">
          {CONFIG.phoneDisplay}
        </a>
      ),
    },
    {
      icon: Clock,
      label: "Opening hours",
      body: (
        <div className="space-y-1">
          {CONFIG.hours.map((h) => (
            <div key={h.day} className="flex justify-between gap-6">
              <span className="text-white/55">{h.day}</span>
              <span>{h.time}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section ref={root} id="contact" className="relative overflow-hidden bg-ink py-28 sm:py-36 lg:py-44">
      <div className="absolute inset-0 overflow-hidden">
        <img data-cbg src={px(IMG.contactBg, 1920, 1200)} alt="" loading="lazy" className="h-full w-full object-cover opacity-[0.16] grayscale" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      <div className="absolute inset-0 grain" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[700px] rounded-full bg-lime/[0.08] blur-[160px]" />

      <div className="relative mx-auto max-w-[1520px] px-5 sm:px-10">
        <Eyebrow className="mb-8">Contact & location</Eyebrow>
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <RevealText
            className="font-display text-[clamp(3rem,9.2vw,10rem)] leading-[0.9]"
            lines={[
              <span key="1" className="text-white">YOUR FIRST REP</span>,
              <span key="2" className="text-lime">STARTS HERE.</span>,
            ]}
          />
          <FadeIn className="flex flex-wrap gap-4 lg:max-w-[460px] lg:justify-end">
            <Button href={whatsappLink()} external size="lg" icon={<WhatsAppIcon className="h-[18px] w-[18px]" />}>
              WhatsApp enquiry
            </Button>
            <Button href={telLink} variant="ghost" size="lg" icon={<Phone size={17} />}>
              Call now
            </Button>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12">
          <div data-infos className="flex flex-col gap-4 lg:col-span-5">
            {info.map(({ icon: Icon, label, body }) => (
              <div key={label} data-info className="glass group flex gap-5 rounded-3xl p-6 transition-colors duration-500 hover:border-lime/50 sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime/10 text-lime transition-all duration-500 group-hover:bg-lime group-hover:text-black">
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 font-cond text-xs font-semibold uppercase tracking-[0.3em] text-chrome">{label}</div>
                  <div className="font-sans text-[17px] leading-relaxed text-white">{body}</div>
                </div>
              </div>
            ))}

            <div data-info className="grid gap-4 sm:grid-cols-2">
              <a
                href={CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="glass group flex items-center justify-between rounded-3xl p-6 transition-colors duration-500 hover:border-lime/50"
              >
                <div>
                  <div className="mb-1 font-cond text-xs font-semibold uppercase tracking-[0.3em] text-chrome">Instagram</div>
                  <div className="text-[17px] text-white">{CONFIG.instagramHandle}</div>
                </div>
                <InstagramIcon className="h-8 w-8 text-lime transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12" />
              </a>
              <a
                href={directionsLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group flex items-center justify-between rounded-3xl bg-lime p-6 text-black transition-transform duration-500 hover:-translate-y-1"
              >
                <div>
                  <div className="mb-1 font-cond text-xs font-bold uppercase tracking-[0.3em] text-black/60">Google Maps</div>
                  <div className="font-display text-2xl leading-none">Get directions</div>
                </div>
                <Navigation className="h-8 w-8 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>

          <div data-map className="relative lg:col-span-7">
            <div className="clip-chamfer-lg relative h-[420px] overflow-hidden bg-steel shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] sm:h-[520px] lg:h-full lg:min-h-[560px]">
              <iframe
                title="Peter's Gym location on Google Maps"
                src={mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-dark absolute inset-0 h-full w-full border-0"
              />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />
              <div className="glass absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 sm:left-7 sm:right-auto sm:min-w-[360px]">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-lime" />
                  </span>
                  <div>
                    <div className="font-display text-xl leading-none text-white">PETER'S GYM</div>
                    <div className="mt-1 text-xs text-white/55">Map placeholder — update address in config</div>
                  </div>
                </div>
                <a href={directionsLink} target="_blank" rel="noopener noreferrer" data-cursor="hover" className="clip-chamfer bg-lime px-4 py-2 font-cond text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-white">
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
