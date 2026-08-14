import { Fragment, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

/*
 * Shared motion vocabulary for the page.
 *
 * The rule the sections follow: each one gets *one* signature move, and
 * everything else in it uses the plain `rise`. Variety between sections is what
 * makes the scroll feel like a journey; variety *within* a section just reads
 * as an animation demo.
 */

export const rise = {
  initial: { y: 28, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const stagger = (index, step = 0.07) => ({
  ...rise,
  transition: { ...rise.transition, delay: index * step },
});

/* Slides in from the side instead of up — used where a column of cards sits
 * beside something static, so the two halves do not enter identically. */
export const slideIn = (index, from = 40, step = 0.08) => ({
  initial: { x: from, opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 0.65, delay: index * step, ease: [0.22, 1, 0.36, 1] },
});

/* ── Media query ────────────────────────────────────────────────────────── */

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/* ── Scroll-linked text reveal ──────────────────────────────────────────── */

function RevealWord({ progress, start, end, children }) {
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const y = useTransform(progress, [start, end], ["0.42em", "0em"]);

  return (
    <span className="reveal-word">
      <motion.span style={{ opacity, y }}>{children}</motion.span>
    </span>
  );
}

/*
 * Words lift into place one after another as the heading crosses the screen —
 * tied to scroll position rather than fired on entry, so the reveal tracks how
 * fast you are actually reading rather than running on its own clock.
 */
export function RevealText({ as: Tag = "h2", text, progress, className }) {
  const reduce = useReducedMotion();

  if (reduce || !progress) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");
  // Each word finishes before the next starts moving, but the windows overlap
  // enough that the line reads as one sweep instead of a metronome.
  const span = 1 / words.length;

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <RevealWord
            progress={progress}
            start={index * span * 0.72}
            end={index * span * 0.72 + span * 1.5}
          >
            {word}
          </RevealWord>
          {/* A real text node, not a margin: the gap has to survive into
              textContent or screen readers and copy-paste run the whole
              heading together as one unbroken word. */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ── Count-up ───────────────────────────────────────────────────────────── */

/*
 * Takes the display string as authored ("16+", "5+") and animates only the
 * numeric part, so the surrounding punctuation is never re-derived here.
 */
export function CountUp({ value, duration = 1.5 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const match = String(value).match(/^(\D*?)([\d.]+)(.*)$/);
  const prefix = match ? match[1] : "";
  const target = match ? Number(match[2]) : 0;
  const suffix = match ? match[3] : "";
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;

  const count = useMotionValue(0);
  const text = useTransform(count, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (!inView || !match || reduce) return undefined;
    const controls = animate(count, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, target, duration, count, match, reduce]);

  if (!match || reduce) {
    return <strong ref={ref}>{value}</strong>;
  }

  return <motion.strong ref={ref}>{text}</motion.strong>;
}

/*
 * A Marquee component lived here, used by the old Skills panel. It went out
 * with that panel: it could only ever scroll one flat list, which is what made
 * every skill area show the same nineteen logos.
 */
