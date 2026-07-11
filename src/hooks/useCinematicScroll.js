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
          const portalFrame = document.querySelector(".portal-frame");
          const portalWorld = document.querySelector(".portal-world");

          if (heroStage && heroWorld && portalFrame && portalWorld) {
            const getPortalCoverScale = () => {
              const scaleX = window.innerWidth / portalFrame.offsetWidth;
              const scaleY = window.innerHeight / portalFrame.offsetHeight;
              return Math.max(scaleX, scaleY) * 1.16;
            };

            const getPortalTranslate = () => {
              const rect = portalFrame.getBoundingClientRect();
              const focalX = rect.left + rect.width * 0.52;
              const focalY = rect.top + rect.height * 0.46;

              return {
                x: window.innerWidth / 2 - focalX,
                y: window.innerHeight / 2 - focalY,
              };
            };

            const getWorldCounterScale = () => 1 / getPortalCoverScale();

            gsap.set(portalFrame, {
              transformOrigin: "52% 46%",
              "--portal-border-alpha": 0.78,
              "--portal-shadow-alpha": 1,
              "--portal-glass-alpha": 0.055,
              "--portal-radius": "34px",
              "--portal-inner-radius": "24px",
              "--portal-inset": "10px",
            });
            gsap.set(portalWorld, {
              xPercent: -50,
              yPercent: -50,
              x: 0,
              scale: 0.34,
              transformOrigin: "52% 46%",
            });
            gsap.set([".world-content", ".world-profile"], { autoAlpha: 0.32 });
            gsap.set(".bridge-label", { autoAlpha: 0.22 });
            gsap.set([".world-tech-corridor", ".world-identity-chamber", ".world-capability-corridor", ".world-project-entry"], { autoAlpha: 0 });
            gsap.set(".world-tech-node", { autoAlpha: 0, y: 34, scale: 0.72, filter: "blur(2px)" });
            gsap.set([".world-identity-card", ".world-capability-card"], { autoAlpha: 0, y: 44, scale: 0.88 });

            const heroTimeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: heroStage,
                start: "top top",
                end: "+=760%",
                scrub: 1.28,
                pin: heroWorld,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            heroTimeline
              .addLabel("heroIdle", 0)
              .addLabel("portalApproach", 0.12)
              .addLabel("portalExpansion", 0.35)
              .addLabel("frameCrossing", 0.55)
              .addLabel("worldArrival", 0.68)
              .addLabel("introductionReveal", 0.8)
              .addLabel("identityExploration", 1.05)
              .addLabel("capabilityTransition", 1.34)
              .addLabel("projectEntry", 1.68)
              .fromTo(".distant-world", { scale: 0.72, y: 44, autoAlpha: 0.5 }, { scale: 1.7, y: -72, autoAlpha: 0.66, duration: 0.38 }, 0)
              .to(".distant-world", { scale: 2.1, autoAlpha: 0, filter: "blur(8px)", duration: 0.24 }, 0.48)
              .fromTo(portalFrame, { scale: 0.68, x: 0, y: 38 }, {
                scale: () => getPortalCoverScale() * 0.45,
                x: () => getPortalTranslate().x * 0.34,
                y: () => getPortalTranslate().y * 0.34,
                duration: 0.32,
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
                duration: 0.34,
              }, 0.43)
              .to(portalFrame, {
                scale: () => getPortalCoverScale() * 1.08,
                duration: 0.22,
              }, 0.76)
              .to(portalWorld, { scale: getWorldCounterScale, x: () => -window.innerWidth * 0.027, duration: 0.7 }, 0.1)
              .to(portalWorld, { borderRadius: 0, duration: 0.26 }, 0.5)
              .to(".world-far-background", { scale: 1.12, x: -24, y: 18, duration: 1 }, 0)
              .to(".world-grid", { scale: 1.18, y: -42, duration: 1.08 }, 0)
              .to(".world-perspective-path", { scale: 1.22, y: -36, autoAlpha: 0.72, duration: 1.1 }, 0)
              .to(".world-typography", { x: -70, y: -24, scale: 0.96, autoAlpha: 0.62, duration: 1.15 }, 0.18)
              .to(".world-object-left", { x: -96, y: -70, scale: 1.2, autoAlpha: 0.42, duration: 0.72 }, 0.18)
              .to(".world-object-right", { x: 86, y: 56, scale: 1.16, autoAlpha: 0.44, duration: 0.72 }, 0.2)
              .to([".world-content", ".world-profile"], { autoAlpha: 1, duration: 0.24 }, 0.48)
              .to(".world-content", { x: -16, y: -18, scale: 1.025, duration: 0.28 }, 0.76)
              .to(".world-profile", { x: 18, y: -16, scale: 1.035, duration: 0.28 }, 0.76)
              .to(".world-tech-corridor", { autoAlpha: 1, duration: 0.18 }, "introductionReveal")
              .to(".world-tech-node", {
                autoAlpha: (index) => (index > 7 ? 0.58 : 0.92),
                y: (index) => (index % 3 === 0 ? -16 : 0),
                x: (index) => (index % 2 === 0 ? -18 : 22),
                scale: (index) => (index < 4 ? 1 : 0.82),
                filter: "blur(0px)",
                stagger: 0.018,
                duration: 0.28,
              }, "introductionReveal+=0.02")
              .to(".world-tech-corridor", { autoAlpha: 0.28, duration: 0.28 }, "identityExploration")
              .to(".world-content", { x: -124, y: -82, scale: 0.66, autoAlpha: 0.22, duration: 0.34 }, "identityExploration")
              .to(".world-profile", { x: 126, y: 72, scale: 0.72, autoAlpha: 0.34, duration: 0.34 }, "identityExploration")
              .to(".world-label", { y: -26, scale: 0.92, autoAlpha: 0.72, stagger: 0.02, duration: 0.24 }, "identityExploration")
              .to(".world-tech-node", {
                y: (index) => -90 - index * 6,
                x: (index) => (index % 2 === 0 ? -100 : 110),
                scale: 0.6,
                autoAlpha: 0.22,
                filter: "blur(1px)",
                stagger: 0.01,
                duration: 0.34,
              }, "identityExploration")
              .to(".world-identity-chamber", { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.32 }, "identityExploration+=0.05")
              .to(".world-identity-card", {
                autoAlpha: 1,
                y: (index) => (index % 2 === 0 ? -10 : 18),
                scale: (index) => (index === 1 ? 1.04 : 0.94),
                stagger: 0.045,
                duration: 0.34,
              }, "identityExploration+=0.12")
              .to(".world-content", { autoAlpha: 0.08, y: -122, duration: 0.24 }, "capabilityTransition")
              .to(".world-tech-corridor", { autoAlpha: 0.12, duration: 0.24 }, "capabilityTransition")
              .to(".world-identity-chamber", { x: -170, y: -34, scale: 0.78, autoAlpha: 0.2, duration: 0.34 }, "capabilityTransition")
              .to(".world-identity-card", { y: -34, scale: 0.82, autoAlpha: 0.42, stagger: 0.018, duration: 0.26 }, "capabilityTransition")
              .to(".world-capability-corridor", { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.34 }, "capabilityTransition+=0.04")
              .to(".world-capability-card", {
                autoAlpha: 1,
                y: (index) => (index % 2 === 0 ? -18 : 22),
                scale: (index) => (index === 0 ? 1.06 : 0.92),
                stagger: 0.055,
                duration: 0.36,
              }, "capabilityTransition+=0.1")
              .to(".world-identity-chamber", { autoAlpha: 0.06, duration: 0.24 }, "projectEntry")
              .to(".world-tech-corridor", { autoAlpha: 0, duration: 0.2 }, "projectEntry")
              .to(".world-content", { autoAlpha: 0, duration: 0.2 }, "projectEntry")
              .to(".world-capability-corridor > .eyebrow", { autoAlpha: 0.16, duration: 0.2 }, "projectEntry")
              .to(".world-capability-card", {
                x: (index) => -130 + index * 32,
                y: (index) => -30 + index * 12,
                scale: (index) => (index === 3 ? 1.08 : 0.76),
                autoAlpha: (index) => (index === 3 ? 0.95 : 0.36),
                stagger: 0.015,
                duration: 0.32,
              }, "projectEntry")
              .to(".world-project-entry", { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.34 }, "projectEntry+=0.14")
              .to(".world-project-entry article", { scale: 1.05, duration: 0.28 }, "projectEntry+=0.32")
              .to(".world-far-background", { x: -86, y: 36, scale: 1.24, duration: 0.56 }, "projectEntry")
              .to(".world-perspective-path", { y: -96, scale: 1.38, autoAlpha: 0.46, duration: 0.56 }, "projectEntry")
              .to(".hero-copy", { y: -90, autoAlpha: 0.18, filter: "blur(5px)", duration: 0.4 }, 0.1)
              .to(".hero-copy", { autoAlpha: 0, duration: 0.18 }, 0.5)
              .to(".entry-hint", { y: -40, autoAlpha: 0, duration: 0.22 }, 0.08)
              .to(".foreground-word.left", { xPercent: -62, y: -42, autoAlpha: 0.18, duration: 0.48 }, 0)
              .to(".foreground-word.right", { xPercent: 62, y: 52, autoAlpha: 0.16, duration: 0.48 }, 0)
              .to(".floating-card.frontend", { x: -170, y: -96, scale: 1.18, autoAlpha: 0.42, duration: 0.56 }, 0.08)
              .to(".floating-card.webgis", { x: 72, y: -10, scale: 0.92, autoAlpha: 0, duration: 0.46 }, 0.14)
              .to(".floating-card.systems", { x: -120, y: 120, scale: 1.1, autoAlpha: 0.34, duration: 0.58 }, 0.12)
              .to(".floating-card.interaction", { x: 152, y: 102, scale: 1.16, autoAlpha: 0.32, duration: 0.58 }, 0.14)
              .to(".bridge-label", { autoAlpha: 1, scale: 1.05, duration: 0.26 }, 0.48)
              .to(".hero-world", { scale: 1.015, duration: 2.05 }, 0);
          }

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
