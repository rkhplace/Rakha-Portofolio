import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

/*
 * One reveal pattern for every piece of content on the page: fade up once,
 * on the way into view, never reversed. Continuous scroll-linked motion is
 * reserved below for the few places it actually communicates something
 * (reading progress, a timeline filling in) — tying every block of text to
 * scroll position independently reads as noise, not depth.
 */
const rise = {
  initial: { y: 28, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = (index, step = 0.07) => ({
  ...rise,
  transition: { ...rise.transition, delay: index * step },
});

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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });
  // A single restrained accent: the portrait drifts slightly slower than the
  // page, which reads as depth without touching anything readable.
  const portraitY = useTransform(p, [0, 1], [-18, 18]);

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
              <motion.article className="about-card" key={chapter.kicker} {...stagger(index)}>
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

function TimelineRow({ item, index }) {
  return (
    <motion.div className="timeline-row" {...stagger(index, 0.08)}>
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
  );
}

export function Experience({ items }) {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  // The one continuous effect worth keeping: the rail fills as you read down
  // the list, which is a progress indicator, not decoration.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const rail = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.3 });

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
          {items.map((item, index) => (
            <TimelineRow item={item} index={index} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Projects ───────────────────────────────────────────────────────────── */

function ProjectCard({ project, index, onSelect }) {
  const Icon = project.icon;
  return (
    <motion.button
      type="button"
      className="project-card"
      onClick={() => onSelect(project)}
      {...stagger(index % 3, 0.08)}
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

export function Skills({ services, techStack }) {
  const [active, setActive] = useState(0);
  const service = services[active];

  return (
    <section className="section section-alt" id="skills">
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

          <div className="skill-panel">
            <div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className="tags">
                {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
            <div className="tech-cloud">
              {techStack.map((tech, index) => (
                <motion.div
                  className="tech-chip"
                  key={tech.name}
                  title={tech.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-6% 0px" }}
                  transition={{ duration: 0.4, delay: (index % 10) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img src={tech.logo} alt={tech.name} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Contact ────────────────────────────────────────────────────────────── */

export function Contact() {
  return (
    <section className="contact" id="contact">
      <span className="contact-glow" aria-hidden="true" />
      <div className="shell">
        <motion.div {...rise}>
          <span className="eyebrow">Contact</span>
          <h2>Let&apos;s build something meaningful.</h2>
          <p>Open to collaboration, internship conversations, and practical product work.</p>
          <div className="contact-actions">
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
          </div>
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
      </div>
    </footer>
  );
}
