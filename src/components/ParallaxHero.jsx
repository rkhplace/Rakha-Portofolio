import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import mountain from "../../images/mountain.avif";
import cloud from "../../images/cloud.avif";

/*
 * Depth comes from the same cut-out ridge stacked at different scales and
 * speeds, with the headline deliberately sitting *between* the hazy far range
 * and the sharp near one — so the foreground sweeps up in front of it as you
 * scroll, the way a real landscape occludes what is behind it.
 *
 * The far copy is mirrored and held at low opacity: over the sky gradient that
 * reads as atmospheric haze, which is cheaper than an actual blur filter.
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

export default function ParallaxHero({ name, tagline }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
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

  // Slowest at the back, fastest at the front — that spread is the depth.
  const copyY = useTransform(p, [0, 1], [0, -150]);
  // Stays lit while the ridge swallows it: the mountain hides it, not a fade.
  const copyOpacity = useTransform(p, [0, 0.82, 0.97], [1, 1, 0]);
  const farY = useTransform(p, [0, 1], [0, -240]);
  const cloudAX = useTransform(p, [0, 1], [0, -300]);
  const cloudAY = useTransform(p, [0, 1], [0, -210]);
  const cloudBX = useTransform(p, [0, 1], [0, 330]);
  const cloudBY = useTransform(p, [0, 1], [0, -300]);
  // Rides in front of the ridge, so it needs the biggest drift of the three.
  const cloudCX = useTransform(p, [0, 1], [0, 520]);
  const cloudCY = useTransform(p, [0, 1], [0, -520]);
  const nearY = useTransform(p, [0, 1], [0, -760]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero-viewport">
        <motion.div
          className="hero-copy"
          style={on ? { y: copyY, opacity: copyOpacity } : undefined}
        >
          <p className="hero-eyebrow">Portfolio / 2026</p>
          <h1 className="hero-title">{name}</h1>
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

        <motion.div className="hero-layer layer-far" style={on ? { y: farY } : undefined}>
          <img src={mountain} alt="" aria-hidden="true" />
          <span className="layer-ground" />
        </motion.div>

        <motion.div
          className="cloud layer-cloud-a"
          style={{ top: "28%", left: "4%", ...(on ? { x: cloudAX, y: cloudAY } : {}) }}
        >
          <Cloud width={340} opacity={0.92} />
        </motion.div>

        <motion.div
          className="cloud layer-cloud-b"
          style={{ top: "46%", right: "3%", ...(on ? { x: cloudBX, y: cloudBY } : {}) }}
        >
          <Cloud width={230} opacity={0.85} flip />
        </motion.div>

        <motion.div className="hero-layer layer-near" style={on ? { y: nearY } : undefined}>
          <img src={mountain} alt="Mountain ridge" />
          <span className="layer-ground" />
        </motion.div>

        <motion.div
          className="cloud layer-cloud-c"
          style={{ top: "62%", left: "22%", ...(on ? { x: cloudCX, y: cloudCY } : {}) }}
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
