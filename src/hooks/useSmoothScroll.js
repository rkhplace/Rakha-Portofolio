import { useEffect, useRef } from "react";
import Lenis from "lenis";

/*
 * Inertia scrolling for the whole page.
 *
 * Lenis drives the real window scroll position rather than transforming a
 * wrapper, so everything already keyed off scroll — the progress bar, the hero
 * parallax, the IntersectionObserver that lights up the nav — keeps working
 * untouched. Two things it does take over: anchor jumps (native `scrollTo`
 * fights the loop and lands in the wrong place) and the body lock used by the
 * project modal.
 */
export default function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: quick to respond, long settle. Anything springier
      // reads as lag rather than weight.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;

      const link = event.target.closest?.('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      // Clears the floating header, which would otherwise cover the heading.
      lenis.scrollTo(target, { offset: -90, duration: 1.3 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
