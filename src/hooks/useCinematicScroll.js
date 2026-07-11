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
        lerp: 0.09,
        wheelMultiplier: 0.88,
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

          if (heroStage && heroWorld) {
            const heroTimeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: heroStage,
                start: "top top",
                end: "+=280%",
                scrub: 1.15,
                pin: heroWorld,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            heroTimeline
              .fromTo(".distant-world", { scale: 0.72, y: 44, autoAlpha: 0.5 }, { scale: 1.85, y: -86, autoAlpha: 0.72, duration: 0.56 }, 0)
              .to(".distant-world", { autoAlpha: 0, filter: "blur(8px)", duration: 0.24 }, 0.66)
              .fromTo(".portal-frame", { scale: 0.72, y: 38 }, { scale: 1.82, y: -28, duration: 0.9 }, 0.05)
              .to(".portal-frame", { borderRadius: 20, duration: 0.54 }, 0.42)
              .to(".portal-image img", { scale: 1.13, duration: 0.9 }, 0.1)
              .to(".hero-copy", { y: -126, autoAlpha: 0, filter: "blur(7px)", duration: 0.42 }, 0.08)
              .to(".entry-hint", { y: -40, autoAlpha: 0, duration: 0.22 }, 0.08)
              .to(".foreground-word.left", { xPercent: -55, y: -42, autoAlpha: 0.22, duration: 0.5 }, 0)
              .to(".foreground-word.right", { xPercent: 56, y: 52, autoAlpha: 0.2, duration: 0.5 }, 0)
              .to(".floating-card.frontend", { x: -150, y: -88, scale: 1.18, autoAlpha: 0.7, duration: 0.7 }, 0.06)
              .to(".floating-card.webgis", { x: 128, y: -118, scale: 1.12, autoAlpha: 0.6, duration: 0.7 }, 0.08)
              .to(".floating-card.systems", { x: -100, y: 120, scale: 1.1, autoAlpha: 0.52, duration: 0.72 }, 0.12)
              .to(".floating-card.interaction", { x: 142, y: 102, scale: 1.16, autoAlpha: 0.56, duration: 0.72 }, 0.14)
              .fromTo(".portal-intro", { y: 70, autoAlpha: 0, scale: 0.92 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.32 }, 0.7)
              .to(".hero-world", { scale: 1.035, duration: 1 }, 0);
          }

          const aboutTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: "#about",
              start: "top 72%",
              end: "bottom 42%",
              scrub: 0.9,
            },
          });

          aboutTimeline
            .from(".about-copy", { x: -44, autoAlpha: 0, duration: 0.32 }, 0)
            .from(".story-chapter", { y: 70, autoAlpha: 0, clipPath: "inset(18% 0 0 0 round 30px)", stagger: 0.1, duration: 0.5 }, 0.12);

          const skillTimeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: "#services",
              start: "top top+=92",
              end: "+=125%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          skillTimeline
            .fromTo(".service-card", { y: (index) => 92 + index * 28, scale: 0.86, autoAlpha: 0.36, filter: "blur(2px)" }, { y: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", stagger: 0.08, duration: 0.52 }, 0)
            .to(".service-card:nth-child(odd)", { y: -24, duration: 0.42 }, 0.5)
            .to(".service-card:nth-child(even)", { y: 18, duration: 0.42 }, 0.5);

          const projectSection = document.querySelector(".project-story");
          const projectViewport = document.querySelector(".project-story-viewport");
          const projectTrack = document.querySelector(".project-story-track");

          if (projectSection && projectViewport && projectTrack) {
            const getDistance = () => Math.max(0, projectTrack.scrollWidth - projectViewport.offsetWidth);

            gsap.set(".project-story-status i", { scaleX: 0, transformOrigin: "left center" });

            const projectTimeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: projectSection,
                start: "top 86px",
                end: "bottom bottom",
                scrub: 0.95,
                invalidateOnRefresh: true,
              },
            });

            projectTimeline
              .to(projectTrack, { x: () => -getDistance(), duration: 1 }, 0)
              .to(projectTrack, { scale: 1.012, duration: 0.5 }, 0)
              .to(projectTrack, { scale: 0.985, duration: 0.5 }, 0.5)
              .to(".project-story-status i", { scaleX: 1, duration: 1 }, 0);
          }

          gsap.from(".timeline-item", {
            y: 54,
            autoAlpha: 0,
            stagger: 0.14,
            scrollTrigger: {
              trigger: "#experience",
              start: "top 70%",
              end: "bottom 54%",
              scrub: 0.8,
            },
          });

          gsap.from(".contact-card", {
            y: 48,
            scale: 0.94,
            autoAlpha: 0,
            scrollTrigger: {
              trigger: "#contact",
              start: "top 72%",
              end: "center 55%",
              scrub: 0.85,
            },
          });
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
