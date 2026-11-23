import { useRef, type ReactNode, type ElementType } from "react";
import { useAnim } from "../../hooks/useAnim";
import { gsap } from "../../lib/scroll";

/** Masked line-by-line headline reveal triggered on scroll. */
export function RevealText({
  lines,
  as: Tag = "h2",
  className = "",
  start = "top 82%",
  stagger = 0.12,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  start?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useAnim(ref, () => {
    const inners = ref.current!.querySelectorAll("[data-line]");
    gsap.from(inners, {
      yPercent: 115,
      rotate: 3,
      duration: 1.25,
      ease: "expo.out",
      stagger,
      scrollTrigger: { trigger: ref.current, start, once: true },
    });
  });

  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.07em] -mb-[0.07em]">
          <span data-line className="block origin-left will-change-transform">
            {l}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Directional fade-in on scroll. */
export function FadeIn({
  children,
  from = "up",
  delay = 0,
  distance = 70,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  from?: "up" | "down" | "left" | "right";
  delay?: number;
  distance?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useAnim(ref, () => {
    const vars: gsap.TweenVars = { opacity: 0, duration: 1.2, delay, ease: "power4.out" };
    if (from === "up") vars.y = distance;
    if (from === "down") vars.y = -distance;
    if (from === "left") vars.x = -distance;
    if (from === "right") vars.x = distance;
    gsap.from(ref.current, {
      ...vars,
      scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
    });
  });
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-4 font-cond text-[13px] font-semibold uppercase tracking-[0.35em] text-lime ${className}`}>
      <span className="h-px w-10 bg-lime" />
      {children}
    </div>
  );
}
