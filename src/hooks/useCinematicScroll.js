import { useLayoutEffect } from "react";

const reduceMotionQuery = "(prefers-reduced-motion: reduce)";

export function useCinematicScroll({ enabled = true, refreshKey = "" } = {}) {
  useLayoutEffect(() => {
    if (!enabled || typeof window === "undefined" || window.matchMedia(reduceMotionQuery).matches) {
      return undefined;
    }

    let isMounted = true;
    let cleanup = () => {};

    const setup = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { default: Lenis } = await import("lenis");

      if (!isMounted) {
        return;
      }

      const gsap = gsapModule.gsap || gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 0.86,
        smoothWheel: true,
        syncTouch: false,
      });

      const raf = (time) => {
        lenis.raf(time * 1000);
      };

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const root = document.querySelector("#root") || document.body;
      let mediaContext;

      const context = gsap.context(() => {
        const mm = gsap.matchMedia();
        mediaContext = mm;

        mm.add("(min-width: 981px)", () => {
          const heroStage = document.querySelector(".hero-stage");
          const heroWorld = document.querySelector(".hero-world");
          const heroCopy = document.querySelector(".hero-copy");
          const portalFrame = document.querySelector(".portal-frame");

          if (!heroStage || !heroWorld || !heroCopy || !portalFrame) {
            return undefined;
          }

          const getPortalCoverScale = () => {
            const scaleX = window.innerWidth / Math.max(portalFrame.offsetWidth, 1);
            const scaleY = window.innerHeight / Math.max(portalFrame.offsetHeight, 1);
            return Math.max(scaleX, scaleY) * 1.12;
          };

          const getPortalTranslate = () => {
            const rect = portalFrame.getBoundingClientRect();
            const currentX = Number(gsap.getProperty(portalFrame, "x")) || 0;
            const currentY = Number(gsap.getProperty(portalFrame, "y")) || 0;
            const focalX = rect.left + rect.width * 0.5 - currentX;
            const focalY = rect.top + rect.height * 0.5 - currentY;

            return {
              x: window.innerWidth / 2 - focalX,
              y: window.innerHeight / 2 - focalY,
            };
          };

          gsap.set(portalFrame, {
            clearProps: "x,y,scale",
            transformOrigin: "50% 50%",
            "--portal-border-alpha": 0.78,
            "--portal-shadow-alpha": 1,
            "--portal-glass-alpha": 0.055,
            "--portal-radius": "34px",
            "--portal-inner-radius": "24px",
            "--portal-inset": "10px",
          });

          gsap.set([".hero-copy", ".floating-card", ".scroll-indicator", ".entry-hint"], {
            clearProps: "all",
          });

          const heroTimeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: heroStage,
              start: "top top",
              end: "+=260%",
              scrub: 1.05,
              pin: heroWorld,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          heroTimeline
            .to(heroCopy, { x: -72, autoAlpha: 0.1, filter: "blur(3px)", duration: 0.44 }, 0.05)
            .to(".floating-card", { autoAlpha: 0, y: -28, scale: 0.94, duration: 0.28 }, 0.06)
            .to([".scroll-indicator", ".entry-hint"], { autoAlpha: 0, y: -20, duration: 0.18 }, 0.04)
            .to(portalFrame, {
              scale: () => getPortalCoverScale() * 0.46,
              x: () => getPortalTranslate().x * 0.34,
              y: () => getPortalTranslate().y * 0.34,
              duration: 0.36,
            }, 0.1)
            .to(portalFrame, {
              scale: getPortalCoverScale,
              x: () => getPortalTranslate().x,
              y: () => getPortalTranslate().y,
              "--portal-radius": "0px",
              "--portal-inner-radius": "0px",
              "--portal-inset": "0px",
              "--portal-border-alpha": 0,
              "--portal-shadow-alpha": 0,
              "--portal-glass-alpha": 0,
              duration: 0.48,
            }, 0.48);

          return () => {
            heroTimeline.kill();
          };
        });
      }, root);

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      requestAnimationFrame(refresh);

      cleanup = () => {
        window.removeEventListener("load", refresh);
        mediaContext?.revert();
        context.revert();
        lenis.destroy();
        gsap.ticker.remove(raf);
      };
    };

    setup();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [enabled, refreshKey]);
}
