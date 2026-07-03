import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  Cloud,
  Code2,
  Database,
  Github,
  Globe2,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MonitorSmartphone,
  Route,
  Server,
  ShieldCheck,
  Store,
  TerminalSquare,
  Trophy,
  X,
} from "lucide-react";

import profileImage from "../images/RakhaApplePark.jpeg";
import logoImage from "../images/Logo.png";
import azureLogo from "../images/tech/azure.svg";
import cppLogo from "../images/tech/cplusplus.svg";
import cssLogo from "../images/tech/css3.svg";
import dartLogo from "../images/tech/dart.svg";
import figmaLogo from "../images/tech/figma.svg";
import flutterLogo from "../images/tech/flutter.svg";
import githubLogo from "../images/tech/github.svg";
import goLogo from "../images/tech/go.svg";
import htmlLogo from "../images/tech/html5.svg";
import javascriptLogo from "../images/tech/javascript.svg";
import netlifyLogo from "../images/tech/netlify.svg";
import nextLogo from "../images/tech/nextjs.svg";
import phpLogo from "../images/tech/php.svg";
import postgresLogo from "../images/tech/postgresql.svg";
import pythonLogo from "../images/tech/python.svg";
import reactLogo from "../images/tech/react.svg";
import typescriptLogo from "../images/tech/typescript.svg";
import vercelLogo from "../images/tech/vercel.svg";
import viteLogo from "../images/tech/vite.svg";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Projects", "#portfolio"],
  ["Contact", "#contact"],
];

const stats = [
  ["16+", "Public projects"],
  ["5+", "Languages"],
  ["2+", "Years learning"],
];

const focusItems = [
  {
    title: "Software development",
    text: "Building web apps, CRUD systems, utilities, and portfolio interfaces with readable structure.",
  },
  {
    title: "Mobile app development",
    text: "Designing mobile-first flows and Flutter-based interfaces for product prototypes.",
  },
  {
    title: "Web technologies",
    text: "Working with React, Next.js, JavaScript, TypeScript, APIs, and deployment workflows.",
  },
  {
    title: "Database management",
    text: "Practicing database-driven features, CRUD operations, access control, and data organization.",
  },
  {
    title: "Artificial intelligence",
    text: "Integrating AI into practical tools such as planners, assistants, and workflow helpers.",
  },
];

const techStack = [
  { name: "React", logo: reactLogo },
  { name: "Next.js", logo: nextLogo },
  { name: "Flutter", logo: flutterLogo },
  { name: "JavaScript", logo: javascriptLogo },
  { name: "TypeScript", logo: typescriptLogo },
  { name: "Dart", logo: dartLogo },
  { name: "Python", logo: pythonLogo },
  { name: "PHP", logo: phpLogo },
  { name: "Go", logo: goLogo },
  { name: "C++", logo: cppLogo },
  { name: "HTML5", logo: htmlLogo },
  { name: "CSS3", logo: cssLogo },
  { name: "Microsoft Azure", logo: azureLogo },
  { name: "PostgreSQL", logo: postgresLogo },
  { name: "Vite", logo: viteLogo },
  { name: "Vercel", logo: vercelLogo },
  { name: "Netlify", logo: netlifyLogo },
  { name: "Figma", logo: figmaLogo },
  { name: "GitHub", logo: githubLogo },
];

const services = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    text: "Responsive interfaces, reusable components, and clean interaction details for web projects.",
    tags: ["React", "JavaScript", "UI Systems"],
  },
  {
    icon: MonitorSmartphone,
    title: "Mobile Product",
    text: "Mobile-first product flows using Dart and Flutter, from layout planning to deployment preview.",
    tags: ["Flutter", "Dart", "Mobile UX"],
  },
  {
    icon: Brain,
    title: "AI Integration",
    text: "Practical AI features for assistants, planning tools, and workflow automation.",
    tags: ["AI", "Groq API", "Next.js"],
  },
  {
    icon: Cloud,
    title: "Cloud Deployment",
    text: "Deployment practice using PaaS, Azure, CI/CD, and monitoring tools.",
    tags: ["Azure", "Vercel", "CI/CD"],
  },
];

const projects = [
  {
    id: "jualin-abp",
    title: "JUALIN ABP",
    type: "Marketplace App",
    description:
      "Dart-based marketplace project with web preview and mobile-first product flow.",
    stack: ["Dart", "Flutter", "Vercel"],
    href: "https://github.com/rkhplace/JUALIN-ABP",
    demo: "https://jualin-4g7j.vercel.app",
    icon: Store,
    year: "2026",
  },
  {
    id: "trip-planner",
    title: "Trip Planner",
    type: "AI Travel App",
    description:
      "Next.js travel planner that creates itineraries from destination, duration, and preferences.",
    stack: ["Next.js", "JavaScript", "Groq API"],
    href: "https://github.com/rkhplace/Trip-Planner",
    icon: Route,
    year: "2026",
  },
  {
    id: "cek-cuaca-py",
    title: "Cek Cuaca Py",
    type: "Python Utility",
    description:
      "Python weather utility for practicing API requests and data handling.",
    stack: ["Python", "API", "CLI"],
    href: "https://github.com/rkhplace/Cek-Cuaca-Py",
    icon: Cloud,
    year: "2026",
  },
  {
    id: "dpr-ri",
    title: "Website Anggota Komisi VIII DPR RI",
    type: "Public Profile Site",
    description:
      "TypeScript website for public profile and information presentation.",
    stack: ["TypeScript", "Frontend", "Content"],
    href: "https://github.com/rkhplace/Website-Anggota-Komisi-VIII-DPR-RI",
    icon: Globe2,
    year: "2026",
  },
  {
    id: "cyber-security",
    title: "Tugas Besar Cyber Security",
    type: "Security Coursework",
    description:
      "PHP coursework project focused on applying web security concepts.",
    stack: ["PHP", "Security", "Web"],
    href: "https://github.com/rkhplace/Tugas-Besar-Cyber-Security",
    icon: ShieldCheck,
    year: "2025",
  },
  {
    id: "paas",
    title: "Tugas PaaS",
    type: "Cloud App",
    description:
      "JavaScript application deployed on PaaS for hosting workflow practice.",
    stack: ["JavaScript", "PaaS", "Vercel"],
    href: "https://github.com/rkhplace/Tugas-PaaS",
    demo: "https://tugas-paa-s-ashy.vercel.app",
    icon: Cloud,
    year: "2025",
  },
  {
    id: "azure",
    title: "Scalable Web App Azure",
    type: "Cloud Architecture",
    description:
      "Azure App Service project with GitHub Actions CI/CD and Application Insights monitoring.",
    stack: ["Azure", "CI/CD", "Monitoring"],
    href: "https://github.com/rkhplace/scalable-web-app-azure",
    icon: Server,
    year: "2025",
  },
  {
    id: "ai-health",
    title: "AI Health Assistant",
    type: "AI Assistant",
    description:
      "TypeScript assistant project for health-related Q&A and conversational interface practice.",
    stack: ["TypeScript", "AI", "UX"],
    href: "https://github.com/rkhplace/AI-Health-Asisstant",
    icon: Brain,
    year: "2025",
  },
  {
    id: "library-crud",
    title: "CRUD Sistem Peminjaman Buku",
    type: "Data App",
    description:
      "Library loan management website centered on CRUD operations and database-driven workflows.",
    stack: ["CRUD", "Database", "Web"],
    href: "https://github.com/rkhplace/rkhplace-CRUD-Website-Sistem-Peminjaman-Buku-Perpustakaan",
    icon: BookOpen,
    year: "2025",
  },
  {
    id: "website-portofolio",
    title: "Website Portofolio",
    type: "Personal Site",
    description:
      "A personal website project for profile, work showcase, and contact presentation.",
    stack: ["Portfolio", "Frontend", "Personal Brand"],
    href: "https://github.com/rkhplace/Website-Portofolio",
    icon: Globe2,
    year: "2025",
  },
  {
    id: "rakha-portofolio",
    title: "Rakha Portofolio",
    type: "Current Portfolio",
    description:
      "Current portfolio codebase rebuilt with React, Vite, and Netlify deployment.",
    stack: ["React", "Vite", "Netlify"],
    href: "https://github.com/rkhplace/Rakha-Portofolio",
    demo: "https://rakhaportofolio.netlify.app/",
    icon: Code2,
    year: "2025",
  },
  {
    id: "telyubooking",
    title: "UI/UX Design TelyuBooking",
    type: "Product Design",
    description:
      "Facility booking app design for Telkom University with mobile-first booking flow and prototype concept.",
    stack: ["Figma", "UI/UX", "Prototype"],
    href: "https://github.com/rkhplace/UI-UX-design-TelyuBooking",
    demo: "https://www.figma.com/design/CrRirAsUVin8MYyeEnndIJ/UI%2FUX-design-TelyuBooking?node-id=1-139&t=ZqQghHNL7oKAcNHc-0",
    icon: Layers3,
    year: "2025",
  },
  {
    id: "service-motor",
    title: "Service Motor Management System",
    type: "Backend Logic",
    description:
      "Go-based workshop system for service data, spare-part inventory, transactions, search, and sorting.",
    stack: ["Go", "Algorithms", "Struct"],
    href: "https://github.com/rkhplace/Service-Motor-Management-System",
    icon: TerminalSquare,
    year: "2025",
  },
  {
    id: "athlete-data",
    title: "Pengolahan Data Atlet",
    type: "Data Structures",
    description:
      "C++ project for processing athlete and competition data with Delete First operation implementation.",
    stack: ["C++", "Data Structure", "Algorithm"],
    href: "https://github.com/rkhplace/Pengolahan-Data-Atlet-Dan-Data-Pertandingan",
    icon: Trophy,
    year: "2025",
  },
  {
    id: "database-security",
    title: "Database Security Mini Project",
    type: "Database Security",
    description:
      "Mini project exploring database protection techniques, access control, and security documentation.",
    stack: ["Database", "Security", "Access Control"],
    href: "https://github.com/rkhplace/Database-Security-Mini-Project",
    icon: Database,
    year: "2025",
  },
  {
    id: "oddeven",
    title: "OddEven Web Calculator",
    type: "Web Algorithm",
    description:
      "A web calculator separating odd and even numbers with iteration and recursion approaches.",
    stack: ["HTML", "CSS", "JavaScript"],
    href: "https://github.com/rkhplace/OddEvenWeb",
    demo: "https://rkhplace.github.io/OddEvenWeb/",
    icon: Code2,
    year: "2025",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("Home");
  const [openFocus, setOpenFocus] = useState(focusItems[0].title);
  const featuredProjects = useMemo(() => projects.slice(0, 6), []);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    let frameId;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight * 0.2;
    let targetX = currentX;
    let targetY = currentY;

    const setMouseTarget = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const animateSpotlight = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      document.documentElement.style.setProperty("--mouse-x", `${currentX.toFixed(1)}px`);
      document.documentElement.style.setProperty("--mouse-y", `${currentY.toFixed(1)}px`);
      frameId = requestAnimationFrame(animateSpotlight);
    };

    window.addEventListener("mousemove", setMouseTarget, { passive: true });
    frameId = requestAnimationFrame(animateSpotlight);

    return () => {
      window.removeEventListener("mousemove", setMouseTarget);
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }

    let frameId;
    let currentX = 0;
    let currentY = 8;
    let targetX = 0;
    let targetY = 8;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const setShadowTarget = (event) => {
      const logo = document.querySelector(".brand-logo");
      if (!logo) {
        return;
      }

      const rect = logo.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = clamp((event.clientX - centerX) / 130, -4, 4);
      targetY = clamp((event.clientY - centerY) / 130, -3, 6);
    };

    const animateShadow = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      document.documentElement.style.setProperty("--logo-shadow-x", currentX.toFixed(2));
      document.documentElement.style.setProperty("--logo-shadow-y", currentY.toFixed(2));
      frameId = requestAnimationFrame(animateShadow);
    };

    window.addEventListener("pointermove", setShadowTarget, { passive: true });
    frameId = requestAnimationFrame(animateShadow);

    return () => {
      window.removeEventListener("pointermove", setShadowTarget);
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let current = navItems[0];

      navItems.forEach((item) => {
        const [, href] = item;
        const section = document.querySelector(href);
        if (section && window.scrollY >= section.offsetTop - 180) {
          current = item;
        }
      });

      setActiveSection(current[0]);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProject]);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu}>
          <img className="brand-logo" src={logoImage} alt="Rakha logo" />
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={activeSection === label ? "active" : undefined}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main>
        <section id="home" className="hero section-shell">
          <div className="hero-copy">
            <span className="eyebrow">
              Informatics Student
            </span>
            <h1>Muhammad Rakha Pratama</h1>
            <p>
              Informatics student from Bandung focused on web development,
              mobile products, AI integration, and cloud deployment.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#portfolio">
                View projects <ArrowUpRight size={17} />
              </a>
              <a className="button ghost" href="https://github.com/rkhplace" target="_blank" rel="noreferrer">
                GitHub <Github size={17} />
              </a>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="portrait-wrap">
              <img src={profileImage} alt="Muhammad Rakha Pratama" />
            </div>
          </aside>
        </section>

        <section className="ticker" aria-label="Core skills">
          <div className="ticker-track">
            {[0, 1, 2].map((group) => (
              <div className="ticker-group" key={group} aria-hidden={group > 0 ? "true" : undefined}>
                {techStack.map((tech) => (
                  <span className="tech-logo" key={`${tech.name}-${group}`} aria-label={tech.name}>
                    <img src={tech.logo} alt="" aria-hidden="true" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="section-shell about">
          <div className="section-heading">
            <span className="eyebrow">About</span>
            <h2>I build practical software projects and keep improving the details.</h2>
          </div>
          <div className="about-grid">
            <div className="about-copy">
              <p>
                My projects cover marketplaces, itinerary planning, cyber
                security coursework, cloud deployment, data structures, database
                security, and product design. I focus on work that can be tested,
                reviewed, and improved.
              </p>
              <div className="stats-grid">
                {stats.map(([value, label]) => (
                  <div className="stat-card" key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="focus-list">
              {focusItems.map((item) => (
                <button
                  className={openFocus === item.title ? "focus-item open" : "focus-item"}
                  key={item.title}
                  type="button"
                  aria-expanded={openFocus === item.title}
                  onClick={() => setOpenFocus((current) => (current === item.title ? "" : item.title))}
                >
                  <span className="focus-dot" />
                  <span className="focus-content">
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </span>
                  <span className="focus-chevron" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="section-shell services">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Capabilities</span>
              <h2>Skills I use across my projects.</h2>
            </div>
            <p>
              A compact set of skills developed through coursework, public
              repositories, and deployment practice.
            </p>
          </div>
          <div className="service-grid">
            {services.map(({ icon: Icon, title, text, tags }) => (
              <article className="service-card" key={title}>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="tag-row">
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="portfolio" className="section-shell portfolio">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2>Selected public projects from my GitHub.</h2>
            </div>
            <a className="button ghost dark" href="https://github.com/rkhplace" target="_blank" rel="noreferrer">
              See all repositories <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="featured-grid">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </section>

        <section id="contact" className="section-shell contact">
          <div>
            <span className="eyebrow">Contact</span>
            <h2>Open to project discussions and collaboration.</h2>
          </div>
          <div className="contact-card">
            <a href="mailto:mrakhaptatama135@gmail.com">
              <Mail size={18} /> mrakhaptatama135@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/rkhap/" target="_blank" rel="noreferrer">
              <Linkedin size={18} /> LinkedIn
            </a>
            <a href="https://www.instagram.com/rkhap_/" target="_blank" rel="noreferrer">
              <Instagram size={18} /> Instagram
            </a>
            <span>
              <MapPin size={18} /> Bandung, Indonesia
            </span>
          </div>
        </section>
      </main>

      <footer>
        <span>{"\u00a9"} 2026 Muhammad Rakha Pratama</span>
        <a href="#home">Back to top</a>
      </footer>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  );
}

function ProjectCard({ project, index, onSelect }) {
  const Icon = project.icon;
  return (
    <article className={`project-card card-${index + 1}`}>
      <div className="project-icon">
        <Icon size={24} />
      </div>
      <div>
        <span className="project-type">{project.type}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
      <div className="tag-row">
        {project.stack.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="project-actions">
        <button type="button" onClick={onSelect}>
          Details
        </button>
        <a href={project.href} target="_blank" rel="noreferrer">
          Code <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }) {
  const Icon = project.icon;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      onMouseDown={onClose}
    >
      <div className="modal-card" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close project details">
          <X size={20} />
        </button>
        <div className="project-icon large">
          <Icon size={30} />
        </div>
        <span className="project-type">{project.type}</span>
        <h2 id="project-title">{project.title}</h2>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.stack.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="modal-actions">
          <a className="button primary" href={project.href} target="_blank" rel="noreferrer">
            View code <Github size={17} />
          </a>
          {project.demo && (
            <a className="button ghost dark" href={project.demo} target="_blank" rel="noreferrer">
              Live demo <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

