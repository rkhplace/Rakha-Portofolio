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

        const N = SCENES.length;
        const p = raw * N; // scaled progress from 0 to N

        // Determine which transition or stable zone we are in
        let activeTransitionIdx = -1; // if in transition zone [i + 0.55, i + 1.2], this is i
        let activeStableIdx = -1;      // if in stable zone, this is the scene index

        for (let i = 0; i < N - 1; i++) {
          if (p >= i + 0.55 && p < i + 1.2) {
            activeTransitionIdx = i;
            break;
          }
        }

        if (activeTransitionIdx === -1) {
          // We are in a stable zone. Find which one.
          if (p < 0.55) {
            activeStableIdx = 0;
          } else if (p >= N - 0.8) { // 5.20
            activeStableIdx = N - 1;
          } else {
            for (let i = 1; i < N - 1; i++) {
              if (p >= i + 0.2 && p < i + 0.55) {
                activeStableIdx = i;
                break;
              }
            }
          }
        }

        // Apply styles to all scenes with mathematically continuous interpolation
        sceneEls.forEach((el, idx) => {
          if (!el) return;

          let opacity = 0;
          let yShift = 0;
          let scale = 1;
          let blur = 0;
          let pointerEvents = "none";

          if (activeStableIdx !== -1) {
            if (idx === activeStableIdx) {
              opacity = 1;
              yShift = 0;
              scale = 1;
              blur = 0;
              pointerEvents = "auto";
            }
          } else if (activeTransitionIdx !== -1) {
            if (idx === activeTransitionIdx) {
              // Fading out over a wider 0.65-unit window
              const t = (p - (activeTransitionIdx + 0.55)) / 0.65;
              const ease = easeInOut(t);
              opacity = 1 - ease;
              yShift = lerp(0, -20, ease);
              scale = lerp(1, 0.97, ease);
              blur = lerp(0, 3, ease);
            } else if (idx === activeTransitionIdx + 1) {
              // Fading in over a wider 0.65-unit window
              const t = (p - (activeTransitionIdx + 0.55)) / 0.65;
              const ease = easeInOut(t);
              opacity = ease;
              yShift = lerp(20, 0, ease);
              scale = lerp(0.97, 1, ease);
              blur = lerp(3, 0, ease);
              if (ease > 0.5) {
                pointerEvents = "auto";
              }
            }
          }

          el.style.opacity = opacity;
          el.style.transform = `translateY(${yShift.toFixed(2)}px) scale(${scale.toFixed(4)})`;
          el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "none";
          el.style.pointerEvents = pointerEvents;
          el.style.visibility = opacity < 0.005 ? "hidden" : "visible";
        });

        // Determine current active section for navbar
        let currentActiveIdx = 0;
        if (activeTransitionIdx !== -1) {
          const t = (p - (activeTransitionIdx + 0.55)) / 0.65;
          currentActiveIdx = t > 0.5 ? activeTransitionIdx + 1 : activeTransitionIdx;
        } else if (activeStableIdx !== -1) {
          currentActiveIdx = activeStableIdx;
        }

        const activeSceneId = SCENES[currentActiveIdx];
        document.querySelectorAll(".nav a").forEach((link) => {
          const href = link.getAttribute("href");
          const isActive = href === `#${activeSceneId}` ||
            (activeSceneId === "home" && href === "#home");
          link.classList.toggle("active", isActive);
        });

        window.dispatchEvent(new CustomEvent("cinematic-scene", { detail: { index: currentActiveIdx, id: activeSceneId } }));

        /* ── World canvas parallax: runs continuously across all scene transitions ── */
        if (wcFar && wcMid && wcRoad) {
          const approach = easeInOut(raw); // 0 → 1 globally across all pages

          gsap.set(wcFar,  { y: approach * -60, scale: 1 + approach * 0.2, opacity: 0.5 + approach * 0.3 });
          // Keep the background vertical glass panels (wcMid) visible at the far left/right edges as framing elements
          const midOpacity = 0.5 + (1 - approach) * 0.3; // ranges from 0.8 to 0.5 continuously
          gsap.set(wcMid,  { y: approach * -100, scale: 1 + approach * 0.4, opacity: midOpacity });
          gsap.set(wcRoad, { y: approach * -130, scale: 1 + approach * 0.7, opacity: 0.15 + approach * 0.65 });
          if (wcGrid) gsap.set(wcGrid, { opacity: 0.2 + approach * 0.3 });
          if (wcFog)  gsap.set(wcFog,  { opacity: 0.55 - approach * 0.45 });
        }
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
        // scroll to the middle of the stable zone of that scene
        let targetProgress = 0;
        if (sceneIdx === 0) {
          targetProgress = 0.275 / SCENES.length;
        } else if (sceneIdx === SCENES.length - 1) {
          targetProgress = (SCENES.length - 0.4) / SCENES.length;
        } else {
          targetProgress = (sceneIdx + 0.375) / SCENES.length;
        }
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
        const targetProgress = (1 + 0.375) / SCENES.length; // about scene
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
