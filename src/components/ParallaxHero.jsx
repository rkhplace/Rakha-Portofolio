import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import portrait from "../../images/hero-portrait.webp";
import cloud from "../../images/cloud.avif";

/*
 * The portrait is a cut-out, which is what lets it work the way the ridge it
 * replaced did: it has no rectangular edge to give itself away, so it can rise
 * through the sky and sweep up *in front of* the headline — the copy sits at
 * z-index 1, the portrait at 6, so the figure occludes the name rather than the
 * name fading out under it.
 *
 * It starts a full viewport down and climbs into frame, so the hero opens on
 * sky, clouds and the name alone, and you arrive as the page is scrolled.
 */

function Cloud({ width, opacity = 0.9, flip = false }) {
  return (
    <img
      src={cloud}
      alt=""
      aria-hidden="true"
      style={{
        width,
        opacity,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    />
  );
}

/* Where the face sits inside the cut-out, as a fraction of its height. Taken
 * from the alpha bounding box the asset was cropped to, so it holds for this
 * image and would need re-measuring if the portrait is ever replaced. */
const FACE_TOP = 0.136;
const FACE_BOTTOM = 0.467;

/* Layout offset of an element within an ancestor. Uses offsetTop rather than
 * getBoundingClientRect because the copy is mid-transform whenever this runs
 * after a resize, and we want its resting position, not its animated one. */
function offsetWithin(el, ancestor) {
  let y = 0;
  let node = el;
  while (node && node !== ancestor) {
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return y;
}

export default function ParallaxHero({ name, tagline }) {
  const ref = useRef(null);
  const viewportRef = useRef(null);
  const titleRef = useRef(null);
  const figureRef = useRef(null);
  const reduceMotion = useReducedMotion();

  /*
   * How far the figure climbs. This has to be measured rather than fixed: the
   * face lands wherever the cut-out's own height puts it, and that height
   * collapses from ~636px on a laptop to ~302px on a phone once the width cap
   * bites. A single distance that suits the desktop overshoots on mobile badly
   * enough that the face finishes above the headline instead of over it.
   */
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const title = titleRef.current;
      const figure = figureRef.current;
      if (!viewport || !title || !figure) return;

      const figureHeight = figure.offsetHeight;
      const titleTop = offsetWithin(title, viewport);
      const titleCentre = titleTop + title.offsetHeight / 2;
      const faceCentre = (FACE_TOP + FACE_BOTTOM) / 2;

      // Rest position is 68vh (see the layer's inline style); the end position
      // is whatever puts the middle of the face on the middle of the headline.
      const rest = 0.68 * window.innerHeight;
      const end = titleCentre - faceCentre * figureHeight;
      setTravel(Math.max(0, rest - end));
    };

    measure();
    window.addEventListener("resize", measure);

    // Guarded: ResizeObserver throws on a null target, and an effect that
    // throws takes the whole tree down with it rather than just losing the
    // measurement.
    const observer = new ResizeObserver(measure);
    [figureRef.current, titleRef.current].forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 34,
    mass: 0.32,
    restDelta: 0.0005,
  });

  const on = !reduceMotion;

  /*
   * The copy barely moves. It used to travel -150, but the portrait starts a
   * whole viewport lower than the ridge did, so a copy that climbs stays ahead
   * of the figure the entire way and the two never actually meet — the occlusion
   * lands at p≈1.1, i.e. never. Holding the name almost still is what lets the
   * face catch up to it and pass in front.
   */
  const copyY = useTransform(p, [0, 1], [0, -60]);
  /*
   * Held lit until the face actually reaches it at p≈0.72, then dimmed over the
   * pass. The figure is narrower than the headline and can never cover it end to
   * end the way the full-width ridge did, so the name hands over by fading as
   * the face crosses rather than being left stranded either side of it.
   */
  const copyOpacity = useTransform(p, [0, 0.72, 0.95], [1, 1, 0]);
  const cloudAX = useTransform(p, [0, 1], [0, -300]);
  const cloudAY = useTransform(p, [0, 1], [0, -210]);
  const cloudBX = useTransform(p, [0, 1], [0, 330]);
  const cloudBY = useTransform(p, [0, 1], [0, -300]);
  // Rides in front of the portrait, so it needs the biggest drift of the three.
  const cloudCX = useTransform(p, [0, 1], [0, 520]);
  const cloudCY = useTransform(p, [0, 1], [0, -520]);
  const portraitY = useTransform(p, [0, 1], [0, -travel]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero-viewport" ref={viewportRef}>
        <motion.div
          className="hero-copy"
          style={on ? { y: copyY, opacity: copyOpacity } : undefined}
        >
          <p className="hero-eyebrow">Portfolio / 2026</p>
          <h1 className="hero-title" ref={titleRef}>{name}</h1>
          <p className="hero-sub">{tagline}</p>
          <div className="hero-actions">
            <a className="btn btn-solid" href="#projects">
              See my work <ArrowUpRight size={16} />
            </a>
            <a className="btn btn-light" href="#contact">
              Get in touch
            </a>
          </div>
        </motion.div>

        <motion.div
          className="cloud layer-cloud-a"
          style={{ top: "22%", left: "4%", ...(on ? { x: cloudAX, y: cloudAY } : {}) }}
        >
          <Cloud width={340} opacity={0.92} />
        </motion.div>

        <motion.div
          className="cloud layer-cloud-b"
          style={{ top: "40%", right: "3%", ...(on ? { x: cloudBX, y: cloudBY } : {}) }}
        >
          <Cloud width={230} opacity={0.85} flip />
        </motion.div>

        <motion.div
          className="hero-portrait-layer"
          ref={figureRef}
          /* Head already showing at rest, like the ridge before it — the figure
             grows into frame rather than arriving from nowhere. With motion off
             there is no scroll to ride, so it sits fully in frame instead. */
          style={{ top: on ? "68vh" : "12vh", ...(on ? { y: portraitY } : {}) }}
        >
          <img src={portrait} alt="Muhammad Rakha Pratama looking upward" />
        </motion.div>

        <motion.div
          className="cloud layer-cloud-c"
          style={{ top: "62%", left: "20%", ...(on ? { x: cloudCX, y: cloudCY } : {}) }}
        >
          <Cloud width={280} opacity={0.78} />
        </motion.div>

        <motion.div className="hero-cue" style={on ? { opacity: cueOpacity } : undefined}>
          <span>Scroll</span>
          <ArrowDown size={14} />
        </motion.div>
      </div>
    </section>
  );
}
