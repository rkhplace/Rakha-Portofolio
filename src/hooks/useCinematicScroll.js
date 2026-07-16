import { useLayoutEffect } from "react";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";
const DESKTOP = "(min-width: 1101px)";

const journeyEase = (t) => 1 - Math.pow(1 - t, 4);

export function useCinematicScroll({ enabled = true, refreshKey = "" } = {}) {
  useLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;

    let mounted = true;
    let cleanup = () => {};

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);
      const reduceMotion = window.matchMedia(REDUCE_MOTION).matches;
      const isDesktop = window.matchMedia(DESKTOP).matches;
      let lenis = null;
      let lenisRaf = null;

      if (!reduceMotion && isDesktop) {
        lenis = new Lenis({
          lerp: 0.085,
          wheelMultiplier: 0.9,
          smoothWheel: true,
          syncTouch: false,
        });
        lenisRaf = (time) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(lenisRaf);
        gsap.ticker.lagSmoothing(0);
      }

      let media = null;
      const context = gsap.context(() => {
        const sections = gsap.utils.toArray("[data-journey-section]");

        sections.forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 52%",
            end: "bottom 48%",
            onEnter: () => announceSection(section.id),
            onEnterBack: () => announceSection(section.id),
          });
        });

        ScrollTrigger.create({
          trigger: ".digital-journey",
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            document.documentElement.style.setProperty("--journey-progress", self.progress.toFixed(4));
          },
        });

        if (reduceMotion) return;

        media = gsap.matchMedia();
        media.add(DESKTOP, () => {
          buildHeroTimeline(gsap, ScrollTrigger);
          buildAboutTimeline(gsap, ScrollTrigger);
          buildExperienceTimeline(gsap, ScrollTrigger);
          buildProjectTimelines(gsap, ScrollTrigger);
          const removeProjectConstellation = buildProjectSkillBridge(gsap, ScrollTrigger);
          buildSkillsTimeline(gsap, ScrollTrigger);
          buildContactTimeline(gsap, ScrollTrigger);
          return () => removeProjectConstellation?.();
        });

        media.add("(max-width: 1100px)", () => {
          gsap.utils.toArray(".journey-section").forEach((section) => {
            const targets = section.querySelectorAll(".journey-kicker, h1, h2, h3, article, .project-mockup, .contact-link");
            gsap.fromTo(
              targets,
              { y: 22, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.045,
                ease: "power3.out",
                scrollTrigger: { trigger: section, start: "top 82%", once: true },
              },
            );
          });
        });

      });

      const removePointer = setupPointerInteractions(gsap, reduceMotion, isDesktop);
      const handleAnchorClick = (event) => {
        const link = event.target.closest("a[href^='#']");
        if (!link) return;
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.25, easing: journeyEase, offset: 0 });
        } else {
          target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
      };
      document.addEventListener("click", handleAnchorClick);

      let refreshFrame = null;
      const refresh = () => {
        if (refreshFrame) cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const resizeObserver = new ResizeObserver(refresh);
      const journey = document.querySelector(".digital-journey");
      if (journey) resizeObserver.observe(journey);
      const pendingImages = Array.from(document.querySelectorAll(".digital-journey img"));
      pendingImages.forEach((image) => {
        if (!image.complete) image.addEventListener("load", refresh, { once: true });
      });
      const handleVisibility = () => {
        if (document.visibilityState === "visible") refresh();
      };
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);
      requestAnimationFrame(refresh);

      cleanup = () => {
        document.removeEventListener("click", handleAnchorClick);
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
        document.removeEventListener("visibilitychange", handleVisibility);
        pendingImages.forEach((image) => image.removeEventListener("load", refresh));
        resizeObserver.disconnect();
        if (refreshFrame) cancelAnimationFrame(refreshFrame);
        removePointer();
        media?.revert();
        context.revert();
        if (lenisRaf) gsap.ticker.remove(lenisRaf);
        lenis?.destroy();
      };
    };

    setup();
    return () => {
      mounted = false;
      cleanup();
    };
  }, [enabled, refreshKey]);
}

function announceSection(id) {
  document.documentElement.dataset.journeyScene = id;
  window.dispatchEvent(new CustomEvent("cinematic-scene", { detail: { id } }));
}

function buildHeroTimeline(gsap, ScrollTrigger) {
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".journey-hero",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
    },
  });

  timeline
    .to(".hero-intro, .hero-commands", { opacity: 0, y: -32, duration: 0.24 }, 0.05)
    .to(".journey-hero-title span:nth-child(1)", { x: -90, y: -28, opacity: 0.42, duration: 0.72 }, 0)
    .to(".journey-hero-title span:nth-child(2)", { x: -36, y: -12, scale: 0.97, duration: 0.72 }, 0)
    .to(".journey-hero-title span:nth-child(3)", { x: 38, y: 18, scale: 1.03, duration: 0.72 }, 0)
    .to(".hero-visual-wrap", { xPercent: -8, yPercent: 9, scale: 1.22, rotateY: -3, duration: 0.82 }, 0)
    .to(".hero-photo-frame", { borderRadius: 10, duration: 0.55 }, 0.22)
    .to(".hero-proof-line", { y: 42, opacity: 0, duration: 0.3 }, 0.1)
    .to(".hero-scroll-cue", { opacity: 0, duration: 0.18 }, 0)
    .to(".hero-depth-grid", { scale: 1.35, opacity: 0.62, duration: 1 }, 0);
}

function buildAboutTimeline(gsap, ScrollTrigger) {
  const chapters = gsap.utils.toArray("[data-about-chapter]");
  gsap.set(chapters, { opacity: 0, y: 40, visibility: "hidden" });
  gsap.set("[data-about-stat]", { opacity: 0, y: 22 });
  gsap.set(".about-manifesto", { opacity: 0, y: 46, visibility: "hidden" });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".journey-about",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.85,
    },
  });

  timeline
    .fromTo(".about-statement", { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" })
    .fromTo(".about-photo-echo", { clipPath: "inset(48% 9% 48% 9%)", scale: 1.25 }, { clipPath: "inset(8% 9% 8% 9%)", scale: 1, duration: 0.26 }, 0)
    .to(".about-statement", { y: -70, autoAlpha: 0, duration: 0.22 }, 0.22)
    .to(".about-manifesto", { y: 0, autoAlpha: 1, duration: 0.2, ease: "power2.out" }, 0.31);

  chapters.forEach((chapter, index) => {
    const start = 0.22 + index * 0.16;
    timeline
      .to(chapter, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, start)
      .to(chapter, { autoAlpha: index === chapters.length - 1 ? 1 : 0, y: index === chapters.length - 1 ? 0 : -24, duration: 0.11 }, start + 0.12);
  });

  timeline
    .to("[data-about-stat]", { opacity: 1, y: 0, stagger: 0.06, duration: 0.18, ease: "power2.out" }, 0.58)
    .to(".about-photo-echo", { xPercent: 18, scale: 0.82, opacity: 0.28, duration: 0.22 }, 0.78);
}

function buildExperienceTimeline(gsap, ScrollTrigger) {
  const track = document.querySelector(".experience-track");
  const viewport = document.querySelector(".experience-viewport");
  if (!track || !viewport) return;

  const cards = gsap.utils.toArray("[data-experience-card]");
  let cardMetrics = [];
  let travel = 0;
  const measure = () => {
    cardMetrics = cards.map((card) => ({
      left: card.offsetLeft,
      width: card.offsetWidth,
      center: card.offsetLeft + card.offsetWidth / 2,
    }));
    const lastCard = cardMetrics[cardMetrics.length - 1];
    travel = Math.max(0, lastCard.center - viewport.clientWidth / 2);
  };
  measure();
  gsap.set(cards, { scale: 0.92, opacity: 0.32 });
  gsap.set(cards[0], { scale: 1, opacity: 1 });

  gsap.to(track, {
    x: () => {
      measure();
      return -travel;
    },
    ease: "none",
    scrollTrigger: {
      trigger: ".journey-experience",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.75,
      invalidateOnRefresh: true,
      onRefresh: measure,
      onUpdate: (self) => {
        gsap.set(".experience-progress i", { scaleX: self.progress });
        const translated = travel * self.progress;
        cards.forEach((card, index) => {
          const metric = cardMetrics[index];
          const delta = Math.abs(metric.center - translated - viewport.clientWidth / 2);
          const focus = Math.max(0, Math.min(1, 1 - delta / (metric.width * 0.82)));
          gsap.set(card, {
            scale: 0.92 + focus * 0.08,
            opacity: 0.32 + focus * 0.68,
            zIndex: Math.round(focus * 10),
          });
          gsap.set(card.querySelector(".experience-index"), { y: (1 - focus) * 18 });
          gsap.set(card.querySelector(".experience-card-copy"), { x: (1 - focus) * 24, opacity: 0.55 + focus * 0.45 });
        });
      },
    },
  });
}

function buildProjectTimelines(gsap, ScrollTrigger) {
  gsap.utils.toArray("[data-featured-project]").forEach((section, index) => {
    const mockup = section.querySelector("[data-project-mockup]");
    const copy = section.querySelector("[data-project-copy]");
    const ghost = section.querySelector(".project-ghost-title");
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    });
    timeline
      .fromTo(copy, { x: index % 2 ? 80 : -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.22 }, 0.08)
      .fromTo(mockup, { y: 150, rotateX: 12, rotateZ: index % 2 ? 2 : -2, scale: 0.78 }, { y: 0, rotateX: 0, rotateZ: 0, scale: 1, duration: 0.38 }, 0)
      .to(mockup, { xPercent: index % 2 ? -3 : 3, scale: 1.01, duration: 0.35 }, 0.4)
      .to(copy, { y: -30, opacity: 0.55, duration: 0.25 }, 0.66)
      .fromTo(ghost, { xPercent: -10 }, { xPercent: 10, duration: 1 }, 0);
  });
}

function buildProjectSkillBridge(gsap, ScrollTrigger) {
  const section = document.querySelector(".project-skill-bridge");
  const sticky = section?.querySelector(".bridge-sticky");
  const frame = section?.querySelector(".bridge-browser-frame");
  const coreIcon = section?.querySelector(".bridge-core-icon");
  const coreCopy = section?.querySelector(".bridge-core-copy");
  const coreStatus = coreCopy?.querySelector("span");
  const nodes = gsap.utils.toArray(".bridge-tech-nodes span", section);
  if (!section || !sticky || !frame || !coreIcon || !coreCopy || !nodes.length) return () => {};

  const profiles = [
    { angle: -Math.PI / 2, radius: 0.54, orbit: -0.64, phase: 0.2 },
    { angle: Math.PI / 6, radius: 0.56, orbit: -0.68, phase: 2.3 },
    { angle: Math.PI * 5 / 6, radius: 0.52, orbit: -0.61, phase: 4.4 },
    { angle: -1.92, radius: 0.78, orbit: 0.98, phase: 0.9 },
    { angle: -0.68, radius: 0.8, orbit: 1.02, phase: 2.1 },
    { angle: 0.58, radius: 0.76, orbit: 0.96, phase: 3.5 },
    { angle: 1.84, radius: 0.81, orbit: 1.04, phase: 4.8 },
    { angle: 3.08, radius: 0.77, orbit: 1, phase: 5.7 },
    { angle: -2.42, radius: 1.02, orbit: 0.76, phase: 1.4 },
    { angle: -0.82, radius: 1, orbit: 0.72, phase: 2.9 },
    { angle: 0.78, radius: 1.04, orbit: 0.78, phase: 4.2 },
    { angle: 2.36, radius: 0.99, orbit: 0.74, phase: 5.4 },
  ];
  const baseScale = [1.02, 0.96, 0.9];
  const baseOpacity = [1, 0.92, 0.82];
  const layout = { radiusX: 270, radiusY: 195 };
  const state = {
    progress: 0,
    active: false,
    time: 0,
    hovered: -1,
  };
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (from, to, value) => {
    const t = clamp((value - from) / (to - from));
    return t * t * (3 - 2 * t);
  };
  const measure = () => {
    const laptopScale = window.innerHeight < 800 ? 0.92 : window.innerWidth < 1366 ? 0.95 : 1;
    layout.radiusX = Math.max(235, Math.min(window.innerWidth * 0.24, 350) * laptopScale);
    layout.radiusY = Math.max(175, Math.min(window.innerHeight * 0.31, 245) * laptopScale);
  };
  measure();

  gsap.set(nodes, { opacity: 0, scale: 0.35, x: 0, y: 0 });
  gsap.set(coreIcon, { opacity: 0, scale: 0.55 });
  gsap.set(coreCopy, { opacity: 0, y: 8, scale: 1 });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.05,
      invalidateOnRefresh: true,
      onRefresh: measure,
      onEnter: () => { state.active = true; },
      onEnterBack: () => { state.active = true; },
      onLeave: () => { state.progress = 1; state.active = false; },
      onLeaveBack: () => { state.progress = 0; state.active = false; },
      onUpdate: (self) => {
        state.progress = self.progress;
        state.active = true;
      },
    },
  });
  timeline
    .fromTo(frame, { scale: 0.92, borderRadius: 8 }, {
      scale: 0.38,
      borderRadius: 999,
      duration: 0.32,
      ease: "power2.inOut",
    })
    .to(".bridge-browser-frame strong, .bridge-browser-bar", { opacity: 0, duration: 0.14, ease: "power2.out" }, 0.12)
    .to(coreIcon, { opacity: 1, scale: 2.05, duration: 0.15, ease: "power2.out" }, 0.24)
    .to(coreCopy, { opacity: 1, y: 0, scale: 2.35, duration: 0.16, ease: "power2.out" }, 0.25)
    .to(".bridge-sticky > p", { opacity: 0, y: -18, duration: 0.16, ease: "power2.out" }, 0.2)
    .to(frame, { scale: 0.32, opacity: 0.82, duration: 0.16, ease: "power2.inOut" }, 0.86)
    .to({}, { duration: 0.01 }, 0.99);

  const update = (_time, deltaTime) => {
    if (!state.active || document.hidden) return;
    state.time += Math.min(deltaTime / 1000, 0.05) * (state.hovered >= 0 ? 0.25 : 1);

    const progress = state.progress;
    const revealAll = smoothstep(0.17, 0.31, progress);
    const orbitProgress = smoothstep(0.22, 0.84, progress);
    const exit = smoothstep(0.86, 1, progress);
    const nodeExit = smoothstep(0.84, 0.94, progress);
    const time = state.time;
    const frameX = exit * 34;
    const frameY = Math.sin(time * 0.45) * 1.5 + exit * 18;
    frame.style.translate = `${frameX.toFixed(2)}px ${frameY.toFixed(2)}px`;

    nodes.forEach((node, index) => {
      const profile = profiles[index];
      const layer = index < 3 ? 0 : index < 8 ? 1 : 2;
      const reveal = revealAll * smoothstep(0, 1, (progress - 0.16 - index * 0.003) / 0.1);
      const spread = reveal;
      const scrollAngle = orbitProgress * Math.PI * 2 * profile.orbit;
      const idleAngle = Math.sin(time * 0.42 + profile.phase) * 0.025;
      const angle = profile.angle + scrollAngle + idleAngle;
      const radial = 1 + Math.sin(time * 0.55 + profile.phase) * 0.012;
      const depth = 0.5 + Math.sin(angle) * 0.5;
      let x = Math.cos(angle) * layout.radiusX * profile.radius * radial * spread;
      let y = Math.sin(angle) * layout.radiusY * profile.radius * radial * spread;
      y += Math.sin(time * 0.62 + profile.phase) * (2.5 + layer) * reveal;

      const isActive = state.hovered === index;
      const isDimmed = state.hovered >= 0 && !isActive;
      const scale = baseScale[layer] * (0.96 + depth * 0.07) * reveal + (isActive ? 0.12 : 0);
      const opacity = baseOpacity[layer] * (0.88 + depth * 0.12) * reveal * (1 - nodeExit) * (isDimmed ? 0.62 : 1);

      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${(scale || 0.35).toFixed(4)})`;
      node.style.opacity = String(opacity);
      node.style.zIndex = String(3 + Math.round(depth * 8) + (isActive ? 20 : 0));
      node.style.filter = "none";
    });
  };
  gsap.ticker.add(update);

  const nodeHandlers = nodes.map((node, index) => {
    const activate = () => {
      state.hovered = index;
      nodes.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
      if (coreStatus) coreStatus.textContent = node.dataset.tech || "Connected tool";
    };
    const deactivate = () => {
      state.hovered = -1;
      node.classList.remove("is-active");
      if (coreStatus) coreStatus.textContent = `${nodes.length} technologies`;
    };
    node.addEventListener("pointerenter", activate);
    node.addEventListener("pointerleave", deactivate);
    node.addEventListener("focus", activate);
    node.addEventListener("blur", deactivate);
    return [node, activate, deactivate];
  });
  const resize = () => measure();
  window.addEventListener("resize", resize, { passive: true });

  return () => {
    gsap.ticker.remove(update);
    window.removeEventListener("resize", resize);
    nodeHandlers.forEach(([node, activate, deactivate]) => {
      node.removeEventListener("pointerenter", activate);
      node.removeEventListener("pointerleave", deactivate);
      node.removeEventListener("focus", activate);
      node.removeEventListener("blur", deactivate);
    });
  };
}

function buildSkillsTimeline(gsap, ScrollTrigger) {
  gsap.to(".orbit-ring-outer", {
    rotate: 38,
    ease: "none",
    scrollTrigger: {
      trigger: ".journey-skills",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2,
    },
  });
  gsap.to(".orbit-ring-inner", {
    rotate: -26,
    ease: "none",
    scrollTrigger: {
      trigger: ".journey-skills",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2,
    },
  });
  gsap.fromTo(".orbit-tech", { scale: 0.76, opacity: 0.45 }, {
    scale: 1,
    opacity: 1,
    stagger: 0.025,
    scrollTrigger: {
      trigger: ".journey-skills",
      start: "top 76%",
      end: "top 25%",
      scrub: 0.8,
    },
  });
}

function buildContactTimeline(gsap, ScrollTrigger) {
  const timeline = gsap.timeline({
    scrollTrigger: { trigger: ".journey-contact", start: "top 72%", once: true },
  });
  timeline
    .from(".contact-title span", { yPercent: 115, stagger: 0.1, duration: 0.9, ease: "power4.out" })
    .from(".contact-intro", { y: 25, opacity: 0, duration: 0.55 }, "-=0.45")
    .from(".contact-link", { y: 30, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.25")
    .from(".journey-footer", { opacity: 0, duration: 0.6 }, "-=0.2");
}

function setupPointerInteractions(gsap, reduceMotion, isDesktop) {
  if (reduceMotion || !isDesktop || !window.matchMedia("(pointer: fine)").matches) return () => {};

  const cursor = document.querySelector(".journey-cursor");
  const cursorDot = cursor?.querySelector("i");
  const moveCursor = (event) => {
    if (!cursor) return;
    cursor.classList.add("is-visible");
    gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.18, ease: "power3.out", overwrite: true });
  };
  const cursorEnter = () => cursor?.classList.add("is-active");
  const cursorLeave = () => cursor?.classList.remove("is-active");
  window.addEventListener("pointermove", moveCursor, { passive: true });
  document.querySelectorAll("a, button, [data-tilt]").forEach((el) => {
    el.addEventListener("pointerenter", cursorEnter);
    el.addEventListener("pointerleave", cursorLeave);
  });

  const magneticHandlers = [];
  document.querySelectorAll(".magnetic").forEach((element) => {
    const move = (event) => {
      const rect = element.getBoundingClientRect();
      gsap.to(element, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.16,
        y: (event.clientY - rect.top - rect.height / 2) * 0.16,
        duration: 0.35,
        ease: "power3.out",
      });
    };
    const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" });
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    magneticHandlers.push([element, move, leave]);
  });

  const tilt = document.querySelector("[data-tilt]");
  const tiltMove = (event) => {
    if (!tilt) return;
    const rect = tilt.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(tilt, { rotateY: px * 5, rotateX: py * -4, duration: 0.55, ease: "power3.out" });
    if (cursorDot) gsap.to(cursorDot, { scale: 0.7 + Math.abs(px) * 0.25, duration: 0.25 });
  };
  const tiltLeave = () => tilt && gsap.to(tilt, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
  tilt?.addEventListener("pointermove", tiltMove);
  tilt?.addEventListener("pointerleave", tiltLeave);

  return () => {
    window.removeEventListener("pointermove", moveCursor);
    document.querySelectorAll("a, button, [data-tilt]").forEach((el) => {
      el.removeEventListener("pointerenter", cursorEnter);
      el.removeEventListener("pointerleave", cursorLeave);
    });
    magneticHandlers.forEach(([element, move, leave]) => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    });
    tilt?.removeEventListener("pointermove", tiltMove);
    tilt?.removeEventListener("pointerleave", tiltLeave);
  };
}
