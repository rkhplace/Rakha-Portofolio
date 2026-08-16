import { Children, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

import {
  CountUp,
  RevealText,
  rise,
  slideIn,
  stagger,
  useMediaQuery,
} from "./motion";

/*
 * Every section gets one signature move of its own, so scrolling the page runs
 * through a sequence of different behaviours rather than the same fade-up
 * repeated six times: headings unpack word by word, About counts its numbers
 * up, Experience turns the scroll sideways, Projects tilts its cards up off the
 * page, Skills runs its stack past on a loop, Contact breathes.
 *
 * Continuous scroll-linked motion is still spent carefully — on things that
 * carry meaning (reading position, progress through a list), not on every block
 * of text.
 */

function SectionHead({ eyebrow, title, children }) {
  const ref = useRef(null);
  // Runs while the heading crosses the upper half of the screen, so the words
  // have finished landing by the time you are actually reading them.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "start 36%"],
  });

  return (
    <div className="section-head" ref={ref}>
      <motion.span className="eyebrow" {...rise}>{eyebrow}</motion.span>
      <RevealText text={title} progress={scrollYProgress} />
      {children && <motion.p {...rise}>{children}</motion.p>}
    </div>
  );
}

/* ── About ──────────────────────────────────────────────────────────────── */

export function About({ profileImage, chapters, stats }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });
  // A single restrained accent: the portrait drifts slightly slower than the
  // page, which reads as depth without touching anything readable.
  const portraitY = useTransform(p, [0, 1], [-18, 18]);

  return (
    <section className="section" id="about" ref={ref}>
      <div className="shell">
        <SectionHead eyebrow="About" title="I build software end to end, and put it in production.">
          Informatics student in Bandung, working across cloud delivery, security, mapping,
          and the interfaces in front of them.
        </SectionHead>

        <div className="about-grid">
          <motion.div className="about-media" {...rise}>
            {/* Below the 220vh hero, so it never competes with the first paint.
                The 4/5 aspect-ratio in CSS reserves the box, so deferring it
                costs no layout shift. */}
            <motion.div className="about-portrait" style={reduce ? undefined : { y: portraitY }}>
              <img
                src={profileImage}
                alt="Muhammad Rakha Pratama"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <div className="stat-row">
              {stats.map(([value, label]) => (
                <div className="stat" key={label}>
                  <CountUp value={value} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Enters from the side rather than from below — the portrait beside it
              already rises, and two identical entrances read as one block. */}
          <div className="about-cards">
            {chapters.map((chapter, index) => (
              <motion.article className="about-card" key={chapter.kicker} {...slideIn(index)}>
                <span>{chapter.kicker}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Experience ─────────────────────────────────────────────────────────── */

const experienceCopy = {
  eyebrow: "Experience",
  title: "Learning through shipped work.",
  blurb: "Coursework turned into public repositories, deployable apps, and interface experiments.",
};

/*
 * The horizontal rail, shared by Experience and Skills. The section is made
 * taller than the screen by exactly the amount the track overflows, its inner
 * viewport is pinned to the top, and scroll progress through that extra height
 * is spent moving the track sideways — so scrolling down walks the row left to
 * right and hands you back to the normal page once it runs out.
 *
 * Shared rather than copied: the measurement, the pin and the degenerate-range
 * guard below are all subtle enough that maintaining two of them would mean
 * fixing every bug twice.
 */
function HorizontalRail({ id, eyebrow, title, blurb, children, deps, reverse = false }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    // Measured rather than assumed: card widths are in clamp units and the item
    // count comes from data, so the overflow is not knowable up front.
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [deps]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  });

  /*
   * A reversed rail starts parked at its far end and travels back, so the row
   * sweeps the opposite way to the one above it. The children have to be
   * reversed to match: flipping only the direction would show the last card
   * first and count the numbering down. Reversing the rendered elements — not
   * the source data — keeps each card's own index intact, so the sequence still
   * reads 01 upward in the order you actually meet them.
   */
  const x = useTransform(p, [0, 1], reverse ? [-distance, 0] : [0, -distance]);
  const railFill = useTransform(p, [0, 1], [0.06, 1]);
  const cards = reverse ? Children.toArray(children).reverse() : children;

  /*
   * On a screen wide enough to hold the whole track there is nothing to travel,
   * and pinning would leave the section stapled to the top with a scroll range
   * of zero — which also makes the progress value degenerate. Below that width
   * the rail behaves; at or above it the section simply lays out normally.
   * This is also the state on the very first render, before the measurement
   * effect runs, so the pin never flashes at the wrong height.
   */
  const pinned = distance > 0;

  return (
    <section
      className="section-alt exp-pin"
      id={id}
      ref={sectionRef}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "exp-viewport" : "exp-viewport exp-viewport-static"}>
        <div className="shell">
          <SectionHead eyebrow={eyebrow} title={title}>{blurb}</SectionHead>
        </div>

        <motion.div className="exp-track" ref={trackRef} style={pinned ? { x } : undefined}>
          {cards}
        </motion.div>

        {pinned && (
          <div className="shell">
            {/* Fills from whichever edge the row travels away from, so the bar
                tracks the movement instead of contradicting it. */}
            <span
              className={reverse ? "exp-progress exp-progress-reverse" : "exp-progress"}
              aria-hidden="true"
            >
              <motion.i style={{ scaleX: railFill }} />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function ExperienceRail({ items }) {
  return (
    <HorizontalRail id="experience" deps={items} {...experienceCopy}>
      {items.map((item, index) => (
        <article className="exp-card" key={item.title}>
          <span className="exp-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="exp-year">{item.year}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <div className="tags">
            {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </article>
      ))}

      {/* Gives the rail somewhere to arrive. Without it the track simply stops
          mid-air, and the pin releases on an empty beat. */}
      <a
        className="exp-card exp-card-end"
        href="https://github.com/rkhplace"
        target="_blank"
        rel="noreferrer"
      >
        <span className="exp-year">Next</span>
        <h3>The rest lives on GitHub.</h3>
        <p>Every project above started as a public repository — coursework, experiments, and the things that turned into real apps.</p>
        <span className="exp-card-cta">
          Browse repositories <ArrowUpRight size={16} />
        </span>
      </a>
    </HorizontalRail>
  );
}

/* Narrow screens and reduced-motion get the original vertical timeline: a
 * pinned sideways rail on a phone costs the user their scroll direction. */
function ExperienceList({ items }) {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const rail = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.3 });

  return (
    <section className="section section-alt" id="experience">
      <div className="shell">
        <SectionHead eyebrow={experienceCopy.eyebrow} title={experienceCopy.title}>
          {experienceCopy.blurb}
        </SectionHead>

        <div className="timeline" ref={listRef}>
          <span className="timeline-rail" aria-hidden="true">
            <motion.i style={reduce ? { scaleY: 1 } : { scaleY: rail }} />
          </span>
          {items.map((item, index) => (
            <motion.div className="timeline-row" key={item.title} {...stagger(index, 0.08)}>
              <i className="timeline-dot" aria-hidden="true" />
              <div className="timeline-year">{item.year}</div>
              <div>
                <h3>{item.title}</h3>
                <div className="tags">
                  {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <div>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience({ items }) {
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 900px)");

  return wide && !reduce ? <ExperienceRail items={items} /> : <ExperienceList items={items} />;
}

/* ── Projects ───────────────────────────────────────────────────────────── */

function ProjectCard({ project, index, onSelect, progress, drift }) {
  const Icon = project.icon;
  // Columns move at slightly different rates, which breaks the grid's flat
  // single-plane feel without ever pulling a card away from its neighbours.
  const column = index % 3;
  const offset = column * 22;
  const y = useTransform(progress, [0, 1], [offset, -offset]);

  return (
    <motion.div className="project-cell" style={drift ? { y } : undefined}>
      <motion.button
        type="button"
        className="project-card"
        onClick={() => onSelect(project)}
        initial={{ opacity: 0, y: 62, rotateX: 15 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.7, delay: column * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="project-icon">{Icon ? <Icon size={22} /> : null}</span>
        <small>{project.type}</small>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.stack.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </motion.button>
    </motion.div>
  );
}

export function Projects({ projects, loading, onSelect }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.4 });

  return (
    <section className="section" id="projects" ref={ref}>
      <div className="shell">
        <SectionHead eyebrow="Projects" title="Things I have designed, built, and shipped.">
          {loading
            ? "Loading the latest repositories…"
            : "A selection of public work, from marketplace flows to cloud deployment practice."}
        </SectionHead>

        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onSelect={onSelect}
              progress={p}
              drift={wide && !reduce}
            />
          ))}
        </div>

        <div className="projects-footer">
          <a
            className="btn btn-ghost"
            href="https://github.com/rkhplace"
            target="_blank"
            rel="noreferrer"
          >
            View all repositories <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Work gallery ───────────────────────────────────────────────────────── */

/*
 * Screens, with nothing to click through to.
 *
 * Two of the four demo links on the project cards are dead 404s and the image
 * coverage is uneven — three shots of one project, none of two others — so
 * wiring these to individual projects would have produced broken links and a
 * grid where some cards carry a picture and some do not. Standing on their own
 * they only have to be true, which they are: every one is the real interface.
 *
 * Laid on a dark panel because the screenshots are near-white UI; on the light
 * page they would bleed into the background at the edges.
 */
export function Work({ items }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 900px)");
  const [distance, setDistance] = useState(0);

  const drifting = wide && !reduce;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !drifting) {
      setDistance(0);
      return undefined;
    }

    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [drifting, items]);

  /*
   * Deliberately not pinned, unlike Experience and Skills. A pinned rail costs
   * a full viewport plus the whole track overflow — measured at ~2900px here,
   * against 1374px for the grid this replaced. Tying the drift to the section's
   * own pass through the screen instead keeps it one row tall and leaves the
   * reader's scroll under their control: a gallery is worth glancing at, not
   * worth trapping someone in.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  });
  const x = useTransform(p, [0, 1], [0, -distance]);

  return (
    <section className="section section-dark work" id="work" ref={sectionRef}>
      <div className="shell">
        <SectionHead eyebrow="Work" title="What it actually looks like.">
          Interfaces from the projects above — mapping, marketplace, and public-sector work,
          captured from the running applications.
        </SectionHead>
      </div>

      {/* Full-bleed: the strip runs past both edges so it reads as a longer
          reel than the screen, which is what makes the drift legible. */}
      <div className={drifting ? "work-strip" : "work-strip work-strip-swipe"}>
        <motion.div className="work-track" ref={trackRef} style={drifting ? { x } : undefined}>
          {items.map((item) => (
            <figure className="work-item" key={item.src}>
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.note}</span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Skills ─────────────────────────────────────────────────────────────── */

const skillsCopy = {
  eyebrow: "Skills",
  title: "Tools I reach for.",
  blurb: "Chosen to fit the problem — each area carries only the stack it actually runs on.",
};

/*
 * One card per area, each holding its own tools. The tabbed panel this replaced
 * showed the same nineteen logos whichever tab was open, which made choosing an
 * area mean nothing — Cloud Deployment and Frontend Engineering displayed an
 * identical stack. Names are resolved against techStack so a logo has one
 * definition, and an unrecognised name drops out rather than rendering blank.
 */
function SkillCard({ service, techStack, index }) {
  const Icon = service.icon;
  const tools = service.stack
    .map((name) => techStack.find((tech) => tech.name === name))
    .filter(Boolean);

  return (
    <article className="skill-card">
      <span className="skill-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="skill-icon">{Icon ? <Icon size={22} /> : null}</span>
      <h3>{service.title}</h3>
      <p>{service.text}</p>
      <div className="skill-stack">
        {tools.map((tech) => (
          <span className="tech-chip" key={tech.name} title={tech.name}>
            <img src={tech.logo} alt={tech.name} loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </article>
  );
}

function SkillsRail({ services, techStack }) {
  return (
    <HorizontalRail id="skills" deps={services} reverse {...skillsCopy}>
      {services.map((service, index) => (
        <SkillCard
          key={service.title}
          service={service}
          techStack={techStack}
          index={index}
        />
      ))}
    </HorizontalRail>
  );
}

/* Same reasoning as the Experience fallback: a pinned sideways rail on a phone
 * takes the user's scroll direction away from them. */
function SkillsList({ services, techStack }) {
  return (
    <section className="section section-alt" id="skills">
      <div className="shell">
        <SectionHead eyebrow={skillsCopy.eyebrow} title={skillsCopy.title}>
          {skillsCopy.blurb}
        </SectionHead>

        <div className="skill-list">
          {services.map((service, index) => (
            <motion.div key={service.title} {...stagger(index, 0.08)}>
              <SkillCard service={service} techStack={techStack} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills({ services, techStack }) {
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 900px)");

  return wide && !reduce ? (
    <SkillsRail services={services} techStack={techStack} />
  ) : (
    <SkillsList services={services} techStack={techStack} />
  );
}

/* ── Contact ────────────────────────────────────────────────────────────── */

export function Contact() {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  // Swells as the section centres and settles again on the way out, so the page
  // ends on a beat rather than just stopping.
  const glowScale = useTransform(p, [0, 0.5, 1], [0.68, 1.16, 0.82]);
  const glowOpacity = useTransform(p, [0, 0.5, 1], [0.25, 1, 0.4]);

  const headRef = useRef(null);
  const { scrollYProgress: headProgress } = useScroll({
    target: headRef,
    offset: ["start 88%", "start 40%"],
  });

  return (
    <section className="contact" id="contact" ref={ref}>
      <motion.span
        className="contact-glow"
        aria-hidden="true"
        style={reduce ? undefined : { scale: glowScale, opacity: glowOpacity }}
      />
      <div className="shell">
        <div ref={headRef}>
          <motion.span className="eyebrow" {...rise}>Contact</motion.span>
          <RevealText text="Let’s build something meaningful." progress={headProgress} />
        </div>
        <motion.p {...rise}>
          Open to collaboration, internship conversations, and practical product work.
        </motion.p>
        <motion.div className="contact-actions" {...rise}>
          <a className="btn btn-solid" href="mailto:mrakhaptatama135@gmail.com">
            <Mail size={16} /> Email me
          </a>
          <a
            className="btn btn-ghost"
            href="https://www.linkedin.com/in/rkhap/"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */

const footerLinks = [
  {
    heading: "Explore",
    items: [
      ["About", "#about"],
      ["Experience", "#experience"],
      ["Projects", "#projects"],
      ["Skills", "#skills"],
    ],
  },
  {
    heading: "Elsewhere",
    items: [
      ["GitHub", "https://github.com/rkhplace"],
      ["LinkedIn", "https://www.linkedin.com/in/rkhap/"],
      ["Instagram", "https://www.instagram.com/rkhap_/"],
    ],
  },
  {
    heading: "Contact",
    items: [
      ["Email", "mailto:mrakhaptatama135@gmail.com"],
      ["Bandung, ID", "#contact"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <h4>Muhammad Rakha Pratama</h4>
            <p className="footer-blurb">
              Informatics student building and shipping full-stack products — cloud
              deployment, security, mapping, and mobile.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h4>{group.heading}</h4>
              <ul>
                {group.items.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© 2026 Muhammad Rakha Pratama</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={13} /> Bandung, Indonesia
          </span>
          <div className="footer-social">
            <a href="https://github.com/rkhplace" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={16} />
            </a>
            <a href="https://www.linkedin.com/in/rkhap/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href="https://www.instagram.com/rkhap_/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
