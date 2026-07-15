import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Code2,
  Github,
  Globe2,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  TerminalSquare,
} from "lucide-react";

const statIcons = [Code2, TerminalSquare, BookOpen];

function JourneyMarker({ index, label }) {
  return (
    <div className="journey-marker" aria-hidden="true">
      <span>{index}</span>
      <i />
      <em>{label}</em>
    </div>
  );
}

function HeroSection({ profileImage }) {
  return (
    <section id="home" className="journey-section journey-hero" data-journey-section="home">
      <div className="hero-sticky journey-sticky">
        <JourneyMarker index="00" label="Origin" />
        <div className="hero-depth-grid" aria-hidden="true" />
        <div className="hero-editorial-copy">
          <p className="journey-kicker hero-kicker">Rakha's Digital Journey / 2026</p>
          <h1 className="journey-hero-title">
            <span>Building</span>
            <span>thoughtful digital</span>
            <span>experiences.</span>
          </h1>
          <p className="hero-intro">
            Muhammad Rakha Pratama, a Frontend Developer exploring interactive web,
            information systems, and geospatial experiences.
          </p>
          <div className="hero-commands">
            <a className="button primary magnetic" href="#about">
              Enter my world <ArrowUpRight size={17} />
            </a>
            <a className="text-link magnetic" href="#projects">
              Selected work <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <div className="hero-visual-wrap" data-tilt>
          <div className="hero-photo-frame">
            <img src={profileImage} alt="Muhammad Rakha Pratama at Apple Park" />
            <span className="photo-reflection" aria-hidden="true" />
          </div>
          <div className="hero-visual-meta">
            <span>Bandung, ID</span>
            <span>06.9175 S / 107.6191 E</span>
          </div>
        </div>

        <div className="hero-proof-line" aria-label="Primary disciplines">
          <span><Code2 size={17} /> Frontend</span>
          <span><Globe2 size={17} /> WebGIS</span>
          <span><Layers3 size={17} /> Systems</span>
        </div>

        <div className="hero-scroll-cue" aria-hidden="true">
          <ArrowDown size={15} />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ profileImage, stats, capabilities, chapters }) {
  return (
    <section id="about" className="journey-section journey-about" data-journey-section="about">
      <div className="about-sticky-scene journey-sticky">
        <JourneyMarker index="01" label="Identity" />
        <div className="about-photo-echo" aria-hidden="true">
          <img src={profileImage} alt="" />
        </div>
        <div className="about-editorial">
          <div className="about-statement">
            <p className="journey-kicker">About me</p>
            <h2>I turn complex systems into clear digital experiences.</h2>
            <p>
              I build interfaces with practical structure, expressive interaction,
              and a growing focus on geospatial products.
            </p>
          </div>

          <div className="about-chapter-stack">
            {chapters.map((chapter, index) => (
              <article className="about-chapter" key={chapter.kicker} data-about-chapter>
                <span>{chapter.kicker}</span>
                <div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.text}</p>
                  <em>{capabilities[index]?.tags.join(" / ")}</em>
                </div>
              </article>
            ))}
          </div>

          <div className="about-stats" aria-label="Profile statistics">
            {stats.map(([value, label], index) => {
              const Icon = statIcons[index];
              return (
                <div className="about-stat" key={label} data-about-stat>
                  <Icon size={18} />
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="about-coordinate" aria-hidden="true">
          <span>Current signal</span>
          <strong>Bandung / West Java</strong>
          <i />
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ items }) {
  return (
    <section id="experience" className="journey-section journey-experience" data-journey-section="experience">
      <div className="experience-stage journey-sticky">
        <JourneyMarker index="02" label="Timeline" />
        <header className="experience-heading">
          <p className="journey-kicker">Experience</p>
          <h2>Learning through shipped work.</h2>
          <p>Vertical scroll becomes a horizontal sequence of milestones.</p>
        </header>
        <div className="experience-progress" aria-hidden="true"><i /></div>
        <div className="experience-viewport">
          <div className="experience-track">
            {items.map((item, index) => (
              <article className="experience-card" key={item.title} data-experience-card>
                <div className="experience-index">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.year}</strong>
                </div>
                <div className="experience-card-copy">
                  <p>Chapter {String(index + 1).padStart(2, "0")}</p>
                  <h3>{item.title}</h3>
                  <div className="experience-rule" />
                  <p>{item.text}</p>
                  <div className="journey-tags">
                    {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
            <div className="experience-end" aria-hidden="true">
              <span>Next chapter</span>
              <strong>Selected work</strong>
              <ArrowUpRight size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectMockup({ project, index }) {
  const Icon = project.icon || Code2;
  return (
    <div className={`project-mockup project-mockup-${index + 1}`} data-project-mockup>
      <div className="mockup-browser-bar">
        <span /><span /><span />
        <em>{project.id}.rakha.dev</em>
      </div>
      <div className="mockup-screen">
        <div className="mockup-sidebar">
          <Icon size={24} />
          <span /><span /><span /><span />
        </div>
        <div className="mockup-content">
          <small>{project.type}</small>
          <h4>{project.title}</h4>
          <div className="mockup-display">
            <Icon size={54} strokeWidth={1.25} />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="mockup-row"><i /><i /><i /></div>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection({ projects, techStack, onSelect }) {
  const featured = projects.slice(0, 3);
  return (
    <section id="projects" className="journey-section journey-projects" data-journey-section="projects">
      <JourneyMarker index="03" label="Selected work" />
      <header className="projects-intro">
        <p className="journey-kicker">Featured projects</p>
        <h2>Work designed to be explored, not filed into a grid.</h2>
        <p>Three projects form the centre of the journey. Each scene shifts focus, scale, and context.</p>
      </header>

      <div className="featured-projects">
        {featured.map((project, index) => (
          <article className="featured-project" key={project.id} data-featured-project>
            <div className="featured-project-sticky journey-sticky">
              <div className="project-ghost-title" aria-hidden="true">{project.title}</div>
              <div className="project-copy" data-project-copy>
                <div className="project-scene-number">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i />
                  <em>{project.year || "2026"}</em>
                </div>
                <p className="journey-kicker">{project.type}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="journey-tags">
                  {project.stack.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="project-links">
                  <a className="magnetic" href={project.href} target="_blank" rel="noreferrer">
                    Repository <Github size={15} />
                  </a>
                  {project.demo ? (
                    <a className="magnetic" href={project.demo} target="_blank" rel="noreferrer">
                      Live project <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <button className="magnetic" type="button" onClick={() => onSelect(project)}>
                      Project details <ArrowUpRight size={15} />
                    </button>
                  )}
                </div>
              </div>
              <ProjectMockup project={project} index={index} />
            </div>
          </article>
        ))}
      </div>

      <div className="all-projects-link">
        <span>More experiments live in public.</span>
        <a className="button ghost dark magnetic" href="https://github.com/rkhplace" target="_blank" rel="noreferrer">
          View all repositories <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="project-skill-bridge" aria-hidden="true">
        <div className="bridge-sticky journey-sticky">
          <p>From product layers to the tools behind them</p>
          <div className="bridge-browser-frame">
            <div className="bridge-browser-bar"><i /><i /><i /></div>
            <Layers3 className="bridge-core-icon" size={34} />
            <strong>PROJECT SYSTEM</strong>
          </div>
          <div className="bridge-tech-nodes">
            {techStack.slice(0, 6).map((tech, index) => (
              <span style={{ "--bridge-index": index }} key={tech.name}>
                <img src={tech.logo} alt="" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ services, techStack }) {
  const [active, setActive] = useState(0);
  const activeService = services[active];
  const ActiveIcon = activeService.icon;
  const orbitTech = techStack.slice(0, 12);

  return (
    <section id="skills" className="journey-section journey-skills" data-journey-section="skills">
      <div className="skills-stage journey-sticky">
        <JourneyMarker index="04" label="Toolkit" />
        <div className="skills-copy">
          <p className="journey-kicker">Skills playground</p>
          <h2>Tools orbit the problem, not the other way around.</h2>
          <div className="skill-selector" role="tablist" aria-label="Skill categories">
            {services.map((service, index) => (
              <button
                key={service.title}
                type="button"
                role="tab"
                aria-selected={active === index}
                className={active === index ? "active" : ""}
                onClick={() => setActive(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>{service.title}
              </button>
            ))}
          </div>
        </div>

        <div className="skills-orbit" aria-label="Technology stack">
          <div className="orbit-ring orbit-ring-outer" />
          <div className="orbit-ring orbit-ring-inner" />
          {orbitTech.map((tech, index) => (
            <div className="orbit-tech" style={{ "--orbit-index": index }} key={tech.name} title={tech.name}>
              <img src={tech.logo} alt={tech.name} />
            </div>
          ))}
          <div className="skill-core" aria-live="polite">
            <ActiveIcon size={28} />
            <small>Current focus</small>
            <strong>{activeService.title}</strong>
            <p>{activeService.text}</p>
            <div className="journey-tags">
              {activeService.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const links = [
    [Mail, "Email", "mailto:mrakhaptatama135@gmail.com"],
    [Linkedin, "LinkedIn", "https://www.linkedin.com/in/rkhap/"],
    [Github, "GitHub", "https://github.com/rkhplace"],
    [Instagram, "Instagram", "https://www.instagram.com/rkhap_/"],
  ];

  return (
    <section id="contact" className="journey-section journey-contact" data-journey-section="contact">
      <div className="contact-stage">
        <JourneyMarker index="05" label="Destination" />
        <div className="contact-endpoint" aria-hidden="true"><i /><span>Journey complete</span></div>
        <p className="journey-kicker">Contact / Bandung</p>
        <h2 className="contact-title">
          <span>Let's build</span>
          <span>something meaningful.</span>
        </h2>
        <p className="contact-intro">
          Open to collaboration, internship conversations, and practical product work.
        </p>
        <div className="contact-links">
          {links.map(([Icon, label, href]) => (
            <a className="contact-link magnetic" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" key={label}>
              <Icon size={18} />
              <span>{label}</span>
              <ArrowUpRight size={17} />
            </a>
          ))}
        </div>
        <footer className="journey-footer">
          <span>© 2026 Muhammad Rakha Pratama</span>
          <span><MapPin size={14} /> Bandung, Indonesia</span>
          <a href="#home">Back to origin</a>
        </footer>
      </div>
    </section>
  );
}

export default function JourneySections({
  profileImage,
  stats,
  capabilities,
  chapters,
  timelineItems,
  projects,
  services,
  techStack,
  onSelectProject,
}) {
  return (
    <main className="digital-journey">
      <div className="journey-line" aria-hidden="true">
        <span className="journey-line-fill" />
        <i className="journey-line-cursor" />
      </div>
      <HeroSection profileImage={profileImage} />
      <AboutSection profileImage={profileImage} stats={stats} capabilities={capabilities} chapters={chapters} />
      <ExperienceSection items={timelineItems} />
      <ProjectsSection projects={projects} techStack={techStack} onSelect={onSelectProject} />
      <SkillsSection services={services} techStack={techStack} />
      <ContactSection />
    </main>
  );
}
