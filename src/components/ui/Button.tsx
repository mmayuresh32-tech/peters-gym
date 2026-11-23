import type { ReactNode, MouseEventHandler } from "react";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  variant?: "primary" | "ghost" | "dark";
  icon?: ReactNode;
  external?: boolean;
  className?: string;
  size?: "md" | "lg";
  ariaLabel?: string;
};

const variants = {
  primary: {
    base: "bg-lime text-black",
    fill: "bg-white",
    text: "",
  },
  ghost: {
    base: "bg-white/[0.06] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)] backdrop-blur-md",
    fill: "bg-lime",
    text: "group-hover:text-black",
  },
  dark: {
    base: "bg-black text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]",
    fill: "bg-lime",
    text: "group-hover:text-black",
  },
};

/** CTA with chamfered corners, animated fill-sweep and magnetic pull. */
export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  icon,
  external,
  className = "",
  size = "md",
  ariaLabel,
}: Props) {
  const v = variants[variant];
  const pad = size === "lg" ? "px-9 py-5 text-[15px]" : "px-7 py-4 text-[13px]";
  const cls = `group relative inline-flex items-center overflow-hidden clip-chamfer font-cond font-bold uppercase tracking-[0.18em] ${pad} ${v.base} ${className}`;
  const inner = (
    <>
      <span
        className={`absolute inset-0 -translate-x-full ${v.fill} transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-x-0`}
      />
      <span className={`relative z-10 flex items-center gap-3 transition-colors duration-300 ${v.text} ${variant === "primary" ? "group-hover:text-black" : ""}`}>
        {children}
        <span className="relative block h-[18px] w-[18px] overflow-hidden">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-full group-hover:-translate-y-full">
            {icon ?? <ArrowUpRight size={18} strokeWidth={2.4} />}
          </span>
          <span className="absolute inset-0 flex -translate-x-full translate-y-full items-center justify-center transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0">
            {icon ?? <ArrowUpRight size={18} strokeWidth={2.4} />}
          </span>
        </span>
      </span>
    </>
  );

  return (
    <Magnetic className={className.includes("w-full") ? "!block w-full" : ""}>
      {href ? (
        <a
          href={href}
          className={cls}
          data-cursor="hover"
          aria-label={ariaLabel}
          onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </a>
      ) : (
        <button type="button" className={cls} data-cursor="hover" aria-label={ariaLabel} onClick={onClick as MouseEventHandler<HTMLButtonElement>}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
