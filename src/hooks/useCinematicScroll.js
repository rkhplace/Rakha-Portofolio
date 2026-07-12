import { useLayoutEffect } from "react";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

export function useCinematicScroll({ enabled = true, refreshKey = "" } = {}) {
  useLayoutEffect(() => {
    if (
      !enabled ||
      typeof window === "undefined" ||
      window.matchMedia(REDUCE_MOTION).matches
    ) {
      return undefined;
    }

    let isMounted = true;
    let cleanup = () => {};

    const setup = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { default: Lenis } = await import("lenis");

      if (!isMounted) return;

      const gsap = gsapModule.gsap || gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      /* ── Lenis smooth scroll ── */
      const lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 0.86,
        smoothWheel: true,
        syncTouch: false,
      });

      const raf = (time) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const root = document.querySelector("#root") || document.body;
      let mediaContext;

      const context = gsap.context(() => {
        const mm = gsap.matchMedia();
        mediaContext = mm;

        mm.add("(min-width: 981px)", () => {
          const stage = document.querySelector(".hero-stage");
          if (!stage) return undefined;

          /* ══════════════════════════════════════════
             MASTER TIMELINE — single source of truth
             ══════════════════════════════════════════ */
          const master = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "+=400%",
              scrub: 1.2,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          /* ── heroIdle ── 0.00 — 0.05
             Landing is static and readable */
          master.addLabel("heroIdle", 0);

          /* ── departure ── 0.05 — 0.22
             Hero copy fades left + blurs, labels drift up */
          master.addLabel("departure", 0.05);

          master.to(
            ".hero-content-layer",
            {
              autoAlpha: 0,
              x: -90,
              filter: "blur(5px)",
              duration: 0.17,
              ease: "power2.in",
            },
            "departure",
          );

          master.to(
            ".floating-label",
            {
              autoAlpha: 0,
              y: -30,
              scale: 0.9,
              stagger: 0.012,
              duration: 0.13,
              ease: "power2.in",
            },
            "departure+=0.02",
          );

          master.to(
            ".scroll-to-enter",
            { autoAlpha: 0, y: -16, duration: 0.08 },
            "departure",
          );

          /* ── worldApproach ── 0.14 — 0.56
             Overlaps departure end so mid-panels act as visual anchor.
             Far, mid, road scale up with parallax, fog lifts. */
          master.addLabel("worldApproach", 0.14);

          master.to(
            ".wc-far",
            { scale: 1.2, y: -50, opacity: 0.75, duration: 0.42, ease: "none" },
            "worldApproach",
          );

          master.to(
            ".wc-mid",
            { scale: 1.4, y: -90, opacity: 0.9, duration: 0.42, ease: "none" },
            "worldApproach",
          );

          master.to(
            ".wc-road",
            { opacity: 0.65, scale: 1.6, y: -100, duration: 0.42, ease: "none" },
            "worldApproach",
          );

          master.to(
            ".wc-grid",
            { opacity: 0.4, duration: 0.35, ease: "none" },
            "worldApproach",
          );

          master.to(
            ".wc-fog",
            { opacity: 0.08, duration: 0.35, ease: "none" },
            "worldApproach",
          );

          /* ── immersion ── 0.48 — 0.68
             Road becomes dominant, world deepens */
          master.addLabel("immersion", 0.48);

          master.to(
            ".wc-road",
            { scale: 2.4, y: -200, opacity: 0.72, duration: 0.2, ease: "none" },
            "immersion",
          );

          master.to(
            ".wc-far",
            { scale: 1.35, y: -80, duration: 0.2, ease: "none" },
            "immersion",
          );

          master.to(
            ".wc-mid",
            { scale: 1.65, y: -150, duration: 0.2, ease: "none" },
            "immersion",
          );

          /* ── aboutReveal ── 0.58 — 0.74
             About text emerges from depth: scale + x + opacity */
          master.addLabel("aboutReveal", 0.58);

          master.fromTo(
            ".about-content-layer",
            { autoAlpha: 0, scale: 0.82, x: -50 },
            { autoAlpha: 1, scale: 1, x: 0, duration: 0.16, ease: "power2.out" },
            "aboutReveal",
          );

          /* ── capabilityReveal ── 0.72 — 0.88
             Cards start at different depths, stagger to settled grid */
          master.addLabel("capabilityReveal", 0.72);

          const cards = gsap.utils.toArray(".cap-card");
          cards.forEach((card, i) => {
            const depthScale = 0.62 + i * 0.06;
            const xOff = 35 + i * 12;
            master.fromTo(
              card,
              { autoAlpha: 0, scale: depthScale, x: xOff },
              { autoAlpha: 1, scale: 1, x: 0, duration: 0.09, ease: "power2.out" },
              `capabilityReveal+=${i * 0.028}`,
            );
          });

          /* ── projectHint ── 0.89 — 1.00
             Selected project fades up AFTER about + capabilities */
          master.addLabel("projectHint", 0.89);

          master.fromTo(
            ".project-hint-layer",
            { autoAlpha: 0, scale: 0.84, y: 40 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.11, ease: "power2.out" },
            "projectHint",
          );

          return () => master.kill();
        });

        /* ═══════════════════════════════════════════════
           SECTION SCROLL ANIMATIONS — all breakpoints
           Depth-based reveals matching hero-to-about quality
           ═══════════════════════════════════════════════ */

        /* ── Ticker ── */
        const ticker = document.querySelector(".ticker");
        if (ticker) {
          gsap.fromTo(
            ticker,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              scrollTrigger: {
                trigger: ticker,
                start: "top 94%",
                end: "top 72%",
                scrub: 0.5,
              },
            },
          );
        }

        /* ── Section headings ── */
        gsap.utils.toArray(".section-heading").forEach((heading) => {
          gsap.fromTo(
            heading,
            { y: 32, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              scrollTrigger: {
                trigger: heading,
                start: "top 90%",
                end: "top 60%",
                scrub: 0.7,
              },
            },
          );
        });

        /* ── About sticky header ── */
        const aboutSticky = document.querySelector(".about-sticky");
        if (aboutSticky) {
          gsap.fromTo(
            aboutSticky,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              scrollTrigger: {
                trigger: aboutSticky,
                start: "top 90%",
                end: "top 62%",
                scrub: 0.6,
              },
            },
          );
        }

        /* ── About copy + stats ── */
        const aboutCopy = document.querySelector(".about-copy");
        if (aboutCopy) {
          gsap.fromTo(
            aboutCopy,
            { y: 36, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              scrollTrigger: {
                trigger: aboutCopy,
                start: "top 92%",
                end: "top 64%",
                scrub: 0.6,
              },
            },
          );
        }

        /* ── Story chapters: stagger from depth ── */
        gsap.utils.toArray(".story-chapter").forEach((ch, i) => {
          gsap.fromTo(
            ch,
            { y: 44, opacity: 0, scale: 0.92 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              scrollTrigger: {
                trigger: ch,
                start: "top 93%",
                end: "top 66%",
                scrub: 0.5,
              },
            },
          );
        });

        /* ── Service cards: enter from different depths ── */
        gsap.utils.toArray(".service-card").forEach((card, i) => {
          const xOffset = i % 2 === 0 ? -18 : 18;
          gsap.fromTo(
            card,
            { y: 48, opacity: 0, scale: 0.9, x: xOffset },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              x: 0,
              duration: 1,
              scrollTrigger: {
                trigger: card,
                start: "top 94%",
                end: "top 64%",
                scrub: 0.6,
              },
            },
          );
        });

        /* ── Project cards: rise from depth with slight rotation ── */
        gsap.utils.toArray(".project-card").forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 55, opacity: 0, scale: 0.88, rotateX: 4 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotateX: 0,
              duration: 1,
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "top 64%",
                scrub: 0.6,
              },
            },
          );
        });

        /* ── Timeline items: slide from left ── */
        gsap.utils.toArray(".timeline-item").forEach((item, i) => {
          gsap.fromTo(
            item,
            { x: -28, opacity: 0, scale: 0.95 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              scrollTrigger: {
                trigger: item,
                start: "top 92%",
                end: "top 68%",
                scrub: 0.5,
              },
            },
          );
        });

        /* ── Contact card ── */
        const contactCard = document.querySelector(".contact-card");
        if (contactCard) {
          gsap.fromTo(
            contactCard,
            { y: 36, opacity: 0, scale: 0.94 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              scrollTrigger: {
                trigger: contactCard,
                start: "top 90%",
                end: "top 62%",
                scrub: 0.6,
              },
            },
          );
        }

        /* ── Contact lede text ── */
        const contactLede = document.querySelector(".contact-lede");
        if (contactLede) {
          gsap.fromTo(
            contactLede,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              scrollTrigger: {
                trigger: contactLede,
                start: "top 92%",
                end: "top 72%",
                scrub: 0.5,
              },
            },
          );
        }

        /* ── Stat cards ── */
        gsap.utils.toArray(".stat-card").forEach((stat) => {
          gsap.fromTo(
            stat,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              scrollTrigger: {
                trigger: stat,
                start: "top 94%",
                end: "top 76%",
                scrub: 0.4,
              },
            },
          );
        });

        /* ── Footer ── */
        const footer = document.querySelector("footer");
        if (footer) {
          gsap.fromTo(
            footer,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              scrollTrigger: {
                trigger: footer,
                start: "top 96%",
                end: "top 82%",
                scrub: 0.4,
              },
            },
          );
        }

        /* ── Section bridges: subtle fade-in ── */
        gsap.utils.toArray(".section-bridge").forEach((bridge) => {
          gsap.fromTo(
            bridge,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1,
              scrollTrigger: {
                trigger: bridge,
                start: "top 92%",
                end: "top 72%",
                scrub: 0.4,
              },
            },
          );
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
