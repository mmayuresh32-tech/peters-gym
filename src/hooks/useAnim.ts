import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "../lib/scroll";

/**
 * Scoped GSAP setup that only runs when the user has no reduced-motion preference.
 * Receives `isDesktop` so layouts can swap pinned/horizontal scroll for native behavior.
 */
export function useAnim(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: { isDesktop: boolean }) => void | (() => void)
) {
  useLayoutEffect(() => {
    if (!scope.current) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 1024px)",
      },
      (c) => {
        const conds = c.conditions as { motion: boolean; desktop: boolean };
        if (!conds.motion) return;
        return setup({ isDesktop: conds.desktop });
      },
      scope.current
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
