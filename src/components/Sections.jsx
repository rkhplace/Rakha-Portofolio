import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

/* Shared scroll-in used by every block, so the whole page shares one rhythm. */
const rise = {
  initial: { y: 34, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

const SPRING = { stiffness: 110, damping: 28, mass: 0.4, restDelta: 0.001 };

/*
 * Scroll-linked travel for a single element. Unlike the `rise` variant above
 * this never settles — the value tracks the scrollbar the whole way past, which
 * is what keeps the lower half of the page from feeling static.
 */
function useTrack(ref, offset = ["start end", "end start"]) {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useSpring(scrollYProgress, SPRING);
}

function SectionHead({ eyebrow, title, children }) {
  return (
    <motion.div className="section-head" {...rise}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </motion.div>
  );
}

export function About({ profileImage, chapters, stats }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const p = useTrack(ref);
  const portraitY = useTransform(p, [0, 1], [40, -40]);

  return (
    <section className="section" id="about" ref={ref}>
      <div className="shell">
        <SectionHead eyebrow="About" title="I turn complex systems into clear digital experiences.">
          Informatics student in Bandung, building interfaces with practical structure and a
          growing focus on geospatial products.
        </SectionHead>

        <div className="about-grid">
          <motion.div className="about-media" {...rise}>
            <motion.div className="about-portrait" style={reduce ? undefined : { y: portraitY }}>
              <img src={profileImage} alt="Muhammad Rakha Pratama" />
            </motion.div>
            <div className="stat-row">
              {stats.map(([value, label]) => (
                <div className="stat" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="about-cards">
            {chapters.map((chapter, index) => (
              <motion.article
                className="about-card"
                key={chapter.kicker}
                {...rise}
                transition={{ ...rise.transition, delay: index * 0.07 }}
              >
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

function TimelineRow({ item }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const p = useTrack(ref);

  // The year travels further than the row, so it lags behind as you scroll.
  const rowY = useTransform(p, [0, 1], [64, -64]);
  const yearY = useTransform(p, [0, 1], [118, -118]);
  const opacity = useTransform(p, [0, 0.22, 0.78, 1], [0.32, 1, 1, 0.32]);
  const markerScale = useTransform(p, [0.15, 0.5, 0.85], [0.5, 1, 0.5]);

  const style = reduce ? undefined : { y: rowY, opacity };

  return (
    <motion.div className="timeline-row" ref={ref} style={style}>
      <motion.i className="timeline-dot" aria-hidden="true" style={reduce ? undefined : { scale: markerScale }} />
      <motion.div className="timeline-year" style={reduce ? undefined : { y: yearY }}>
        {item.year}
      </motion.div>
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
  );
}

export function Experience({ items }) {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  const rail = useTrack(listRef, ["start 85%", "end 55%"]);

  return (
    <section className="section section-alt" id="experience">
      <div className="shell">
        <SectionHead eyebrow="Experience" title="Learning through shipped work.">
          Coursework turned into public repositories, deployable apps, and interface experiments.
        </SectionHead>

        <div className="timeline" ref={listRef}>
          <span className="timeline-rail" aria-hidden="true">
            <motion.i style={reduce ? { scaleY: 1 } : { scaleY: rail }} />
          </span>
          {items.map((item) => (
            <TimelineRow item={item} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Projects ───────────────────────────────────────────────────────────── */

function ProjectCard({ project, index, onSelect }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const p = useTrack(ref);

  // Columns drift by different amounts so the grid flows instead of sliding
  // as one slab. Three columns on desktop, so the offset cycles every three.
  const lane = index % 3;
  const travel = 52 + lane * 30;
  const y = useTransform(p, [0, 1], [travel, -travel]);
  const opacity = useTransform(p, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  const Icon = project.icon;

  return (
    <motion.button
      type="button"
      className="project-card"
      ref={ref}
      onClick={() => onSelect(project)}
      style={reduce ? undefined : { y, opacity }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="project-icon">{Icon ? <Icon size={22} /> : null}</span>
      <small>{project.type}</small>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tags">
        {project.stack.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </motion.button>
  );
}

export function Projects({ projects, loading, onSelect }) {
  return (
    <section className="section" id="projects">
      <div className="shell">
        <SectionHead eyebrow="Projects" title="Things I have designed, built, and shipped.">
          {loading
            ? "Loading the latest repositories…"
            : "A selection of public work, from marketplace flows to cloud deployment practice."}
        </SectionHead>

        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onSelect={onSelect} />
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

/* ── Skills ─────────────────────────────────────────────────────────────── */

function TechChip({ tech, index, progress, reduce }) {
  // Staggered lift: chips further down the grid arrive later.
  const delay = (index % 5) * 0.045;
  const y = useTransform(progress, [0, 1], [34 + index * 1.6, -34 - index * 1.6]);
  return (
    <motion.div
      className="tech-chip"
      title={tech.name}
      style={reduce ? undefined : { y }}
      initial={{ opacity: 0, scale: 0.86 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src={tech.logo} alt={tech.name} />
    </motion.div>
  );
}

export function Skills({ services, techStack }) {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const p = useTrack(ref);

  const panelY = useTransform(p, [0, 1], [56, -56]);
  const copyY = useTransform(p, [0, 1], [-26, 26]);
  const service = services[active];

  return (
    <section className="section section-alt" id="skills" ref={ref}>
      <div className="shell">
        <SectionHead eyebrow="Skills" title="Tools I reach for.">
          Chosen to fit the problem — frontend, mobile, AI features, and cloud deployment.
        </SectionHead>

        <motion.div {...rise}>
          <div className="skill-tabs" role="tablist" aria-label="Skill areas">
            {services.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={active === index}
                className={active === index ? "active" : ""}
                onClick={() => setActive(index)}
              >
                {item.title}
              </button>
            ))}
          </div>

          <motion.div className="skill-panel" style={reduce ? undefined : { y: panelY }}>
            <motion.div style={reduce ? undefined : { y: copyY }}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className="tags">
                {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </motion.div>
            <div className="tech-cloud">
              {techStack.map((tech, index) => (
                <TechChip
                  key={tech.name}
                  tech={tech}
                  index={index}
                  progress={p}
                  reduce={reduce}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Contact ────────────────────────────────────────────────────────────── */

export function Contact() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const p = useTrack(ref);

  const headingY = useTransform(p, [0, 1], [70, -70]);
  const introY = useTransform(p, [0, 1], [40, -40]);
  const actionsY = useTransform(p, [0, 1], [22, -22]);
  const glow = useTransform(p, [0, 0.5, 1], [0.5, 1, 0.5]);

  return (
    <section className="contact" id="contact" ref={ref}>
      <motion.span className="contact-glow" aria-hidden="true" style={reduce ? undefined : { opacity: glow }} />
      <div className="shell">
        <motion.div {...rise}>
          <span className="eyebrow">Contact</span>
          <motion.h2 style={reduce ? undefined : { y: headingY }}>
            Let&apos;s build something meaningful.
          </motion.h2>
          <motion.p style={reduce ? undefined : { y: introY }}>
            Open to collaboration, internship conversations, and practical product work.
          </motion.p>
          <motion.div className="contact-actions" style={reduce ? undefined : { y: actionsY }}>
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
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const p = useTrack(ref);
  const y = useTransform(p, [0, 1], [50, 0]);

  return (
    <footer className="site-footer" ref={ref}>
      <motion.div className="shell" style={reduce ? undefined : { y }}>
        <div className="footer-grid">
          <div>
            <h4>Muhammad Rakha Pratama</h4>
            <p className="footer-blurb">
              Frontend developer exploring interactive web, information systems, and
              geospatial experiences.
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
      </motion.div>
    </footer>
  );
}
