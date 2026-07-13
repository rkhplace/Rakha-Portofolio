import { useLayoutEffect } from "react";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

/*
  SCENE CONFIG
  ─────────────────────────────────────────────────────────────
  Each scene occupies:
    • stable: proportion of total scroll held at full visibility
    • offset: which viewport-height multiple this scene starts at

  Total scroll height = SCENES.length × SCENE_DURATION (in vh units)
  Each scene gets SCENE_DURATION × 100vh of scroll space.
  Breakdown per scene:
    0.15 → entrance  (fade/lift in)
    0.60 → stable    (fully visible, readable)
    0.25 → exit      (fade/scale out, overlaps next entrance)
*/
const SCENES = ["home", "about", "experience", "projects", "skills", "contact"];
const SCENE_DURATION = 1.5; // multiplier of 100vh per scene
const TOTAL_SCROLL_MULTIPLIER = SCENES.length * SCENE_DURATION;

// per-scene entrance and exit timing within its own [0..1] progress
const ENTRANCE_END = 0.22;   // fully visible by this point
const EXIT_START = 0.72;     // starts fading out here

function clamp(v, lo, hi) {
  return Math.min(Math.max(v, lo), hi);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

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
    let rafId = null;

    const setup = async () => {
      if (!isMounted) return;

      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { default: Lenis } = await import("lenis");

      if (!isMounted) return;

      const gsap = gsapModule.gsap || gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      /* ── Lenis smooth scroll ── */
      const lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 0.88,
        smoothWheel: true,
        syncTouch: false,
      });

      const raf = (time) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      /* ── Build DOM references ── */
      const track = document.querySelector(".cinematic-track");
      const stage = document.querySelector(".cinematic-stage");
      if (!track || !stage) return;

      const sceneEls = SCENES.map((id) => document.querySelector(`.scene-${id}`));

      /* ── World canvas parallax (home scene background layers) ── */
      const wcFar  = document.querySelector(".wc-far");
      const wcMid  = document.querySelector(".wc-mid");
      const wcRoad = document.querySelector(".wc-road");
      const wcGrid = document.querySelector(".wc-grid");
      const wcFog  = document.querySelector(".wc-fog");

      /* ── Stagger children refs per scene ── */
      const staggerMap = {};
      sceneEls.forEach((el, i) => {
        if (!el) return;
        staggerMap[SCENES[i]] = Array.from(
          el.querySelectorAll(".cs-eyebrow, .cs-h1, .cs-h2, .cs-para, .cs-actions, .cs-proof, .cs-grid, .cs-list, .cs-card, .cs-contact-card")
        );
      });

      /* ─────────────────────────────────────────────────────
         SCROLL DRIVER — runs on every frame, reads raw scrollY
         ───────────────────────────────────────────────────── */
      let lastProgress = -1;

      // Immediately show home scene (overrides CSS .scene-home pre-show)
      const homeEl = sceneEls[0];
      if (homeEl) {
        homeEl.style.opacity = "1";
        homeEl.style.visibility = "visible";
        homeEl.style.pointerEvents = "auto";
        homeEl.style.transform = "translateY(0px) scale(1)";
        homeEl.style.filter = "none";
      }

      const tick = () => {
        const trackHeight = track.scrollHeight - window.innerHeight;
        if (trackHeight <= 0) return;

        const raw = clamp(window.scrollY / trackHeight, 0, 1);
        if (Math.abs(raw - lastProgress) < 0.0001) return;
        lastProgress = raw;

        // which scene index + local progress [0..1] within that scene
        const totalSlots = SCENES.length;
        const scaledProgress = raw * totalSlots;
        const sceneIndex = clamp(Math.floor(scaledProgress), 0, totalSlots - 1);
        const localP = scaledProgress - sceneIndex; // 0..1 within current scene

        sceneEls.forEach((el, i) => {
          if (!el) return;

          let opacity = 0;
          let yShift = 0;
          let scale = 1;
          let blur = 0;
          let pointerEvents = "none";

          if (i === sceneIndex) {
            // active scene
            if (localP < ENTRANCE_END) {
              const t = easeInOut(localP / ENTRANCE_END);
              opacity = t;
              yShift = lerp(18, 0, t);
              scale = lerp(0.97, 1, t);
              blur = lerp(4, 0, t);
            } else if (localP < EXIT_START) {
              opacity = 1;
              yShift = 0;
              scale = 1;
              blur = 0;
              pointerEvents = "auto";
            } else {
              const t = easeInOut((localP - EXIT_START) / (1 - EXIT_START));
              opacity = 1 - t;
              yShift = lerp(0, -14, t);
              scale = lerp(1, 0.98, t);
              blur = lerp(0, 3, t);
            }
          } else if (i === sceneIndex + 1) {
            // next scene — entrance overlap crossfade
            const overlapStart = EXIT_START;
            if (localP >= overlapStart) {
              const t = easeInOut((localP - overlapStart) / (1 - overlapStart));
              opacity = t * 0.6; // pre-fade the next scene slightly
              yShift = lerp(22, 6, t);
              scale = lerp(0.96, 0.99, t);
              blur = lerp(5, 1, t);
            }
          } else if (i === sceneIndex - 1 && i >= 0) {
            // previous scene — fully gone
            opacity = 0;
          }

          el.style.opacity = opacity;
          el.style.transform = `translateY(${yShift.toFixed(2)}px) scale(${scale.toFixed(4)})`;
          el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "none";
          el.style.pointerEvents = pointerEvents;
          el.style.visibility = opacity < 0.005 ? "hidden" : "visible";
        });

        /* ── World canvas parallax: only during home scene ── */
        if (wcFar && wcMid && wcRoad) {
          const homeP = clamp(scaledProgress / 1, 0, 1); // 0 → 1 during home scene slot

          if (homeP < 1) {
            const approach = easeInOut(clamp((homeP - 0.1) / 0.7, 0, 1));

            gsap.set(wcFar,  { y: approach * -40, scale: 1 + approach * 0.14, opacity: 0.5 + approach * 0.25 });
            gsap.set(wcMid,  { y: approach * -70, scale: 1 + approach * 0.28, opacity: 0.45 + approach * 0.45 });
            gsap.set(wcRoad, { y: approach * -90, scale: 1 + approach * 0.5,  opacity: 0.15 + approach * 0.55 });
            if (wcGrid) gsap.set(wcGrid, { opacity: 0.2 + approach * 0.2 });
            if (wcFog)  gsap.set(wcFog,  { opacity: 0.55 - approach * 0.47 });
          }
        }

        /* ── Navbar active scene sync ── */
        const activeSceneId = SCENES[sceneIndex];
        document.querySelectorAll(".nav a").forEach((link) => {
          const href = link.getAttribute("href");
          const isActive = href === `#${activeSceneId}` ||
            (activeSceneId === "home" && href === "#home");
          link.classList.toggle("active", isActive);
        });

        /* ── Dispatch custom event for React state sync ── */
        window.dispatchEvent(new CustomEvent("cinematic-scene", { detail: { index: sceneIndex, id: activeSceneId } }));
      };

      const onScroll = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      tick(); // initial

      /* ── Navbar click → scroll to scene ── */
      const navClickHandler = (e) => {
        const link = e.target.closest("a[href^='#']");
        if (!link) return;
        const href = link.getAttribute("href");
        const targetId = href.replace("#", "");
        const sceneIdx = SCENES.indexOf(targetId);
        if (sceneIdx < 0) return;

        e.preventDefault();
        const trackH = track.scrollHeight - window.innerHeight;
        // scroll to the stable zone of that scene
        const targetProgress = (sceneIdx + ENTRANCE_END + 0.1) / SCENES.length;
        const targetScroll = targetProgress * trackH;
        lenis.scrollTo(targetScroll, { duration: 1.2, easing: easeInOut });
      };

      document.querySelector(".nav")?.addEventListener("click", navClickHandler);

      /* ── Enter world button ── */
      const enterBtnHandler = (e) => {
        const btn = e.target.closest(".enter-world-btn");
        if (!btn) return;
        e.preventDefault();
        const trackH = track.scrollHeight - window.innerHeight;
        const targetProgress = (1 + ENTRANCE_END + 0.1) / SCENES.length; // about scene
        lenis.scrollTo(targetProgress * trackH, { duration: 1.4, easing: easeInOut });
      };
      document.querySelector(".cinematic-stage")?.addEventListener("click", enterBtnHandler);

      const refresh = () => {
        ScrollTrigger.refresh();
        tick();
      };
      window.addEventListener("load", refresh);
      requestAnimationFrame(refresh);

      cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("load", refresh);
        document.querySelector(".nav")?.removeEventListener("click", navClickHandler);
        document.querySelector(".cinematic-stage")?.removeEventListener("click", enterBtnHandler);
        if (rafId) cancelAnimationFrame(rafId);
        lenis.destroy();
        gsap.ticker.remove(raf);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    };

    setup();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [enabled, refreshKey]);
}
