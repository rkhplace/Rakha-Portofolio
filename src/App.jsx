import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  Cloud,
  Code2,
  Database,
  Github,
  Globe2,
  Layers3,
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

import ParallaxHero from "./components/ParallaxHero";
import { About, Contact, Experience, Footer, Projects, Skills } from "./components/Sections";
import "./styles/theme.css";

const navItems = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

const stats = [
  ["16+", "Public projects"],
  ["5+", "Languages"],
  ["2+", "Years learning"],
];

const aboutChapters = [
  {
    kicker: "01",
    title: "Computer Science Student",
    text: "S1 Informatics student from Bandung who keeps turning coursework into public repositories, deployable apps, and interface experiments.",
  },
  {
    kicker: "02",
    title: "Frontend Development",
    text: "Focused on building responsive interfaces with readable structure, polished interaction details, and practical component thinking.",
  },
  {
    kicker: "03",
    title: "Full-stack Product Building",
    text: "Comfortable connecting UI work with APIs, CRUD logic, databases, deployment workflows, and small AI-powered product features.",
  },
  {
    kicker: "04",
    title: "WebGIS and Geospatial Exploration",
    text: "Currently interested in map-based interfaces, dashboards, location-aware products, and data visualization for real-world context.",
  },
];

const timelineItems = [
  {
    year: "2026",
    title: "Portfolio and public project system",
    text: "Rebuilt this portfolio around React, Netlify deployment, and dynamic GitHub repository data.",
    tags: ["React", "Netlify", "GitHub API"],
  },
  {
    year: "2026",
    title: "Mobile-first marketplace project",
    text: "Created JUALIN ABP as a marketplace-style product flow with Flutter/Dart foundations and web preview.",
    tags: ["Flutter", "Dart", "Product"],
  },
  {
    year: "2025",
    title: "Cloud and security coursework",
    text: "Built projects around Azure deployment, PaaS workflows, cyber security, and database security practice.",
    tags: ["Azure", "Security", "Database"],
  },
  {
    year: "2025",
    title: "Algorithms and data structures practice",
    text: "Explored C++, Go, CRUD systems, search, sorting, and structured problem solving through public repositories.",
    tags: ["C++", "Go", "Algorithms"],
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
    description: "Dart-based marketplace project with web preview and mobile-first product flow.",
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
    description: "Next.js travel planner that creates itineraries from destination, duration, and preferences.",
    stack: ["Next.js", "JavaScript", "Groq API"],
    href: "https://github.com/rkhplace/Trip-Planner",
    icon: Route,
    year: "2026",
  },
  {
    id: "cek-cuaca-py",
    title: "Cek Cuaca Py",
    type: "Python Utility",
    description: "Python weather utility for practicing API requests and data handling.",
    stack: ["Python", "API", "CLI"],
    href: "https://github.com/rkhplace/Cek-Cuaca-Py",
    icon: Cloud,
    year: "2026",
  },
  {
    id: "dpr-ri",
    title: "Website Anggota Komisi VIII DPR RI",
    type: "Public Profile Site",
    description: "TypeScript website for public profile and information presentation.",
    stack: ["TypeScript", "Frontend", "Content"],
    href: "https://github.com/rkhplace/Website-Anggota-Komisi-VIII-DPR-RI",
    icon: Globe2,
    year: "2026",
  },
  {
    id: "cyber-security",
    title: "Tugas Besar Cyber Security",
    type: "Security Coursework",
    description: "PHP coursework project focused on applying web security concepts.",
    stack: ["PHP", "Security", "Web"],
    href: "https://github.com/rkhplace/Tugas-Besar-Cyber-Security",
    icon: ShieldCheck,
    year: "2025",
  },
  {
    id: "paas",
    title: "Tugas PaaS",
    type: "Cloud App",
    description: "JavaScript application deployed on PaaS for hosting workflow practice.",
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
    description: "Azure App Service project with GitHub Actions CI/CD and Application Insights monitoring.",
    stack: ["Azure", "CI/CD", "Monitoring"],
    href: "https://github.com/rkhplace/scalable-web-app-azure",
    icon: Server,
    year: "2025",
  },
  {
    id: "ai-health",
    title: "AI Health Assistant",
    type: "AI Assistant",
    description: "TypeScript assistant project for health-related Q&A and conversational interface practice.",
    stack: ["TypeScript", "AI", "UX"],
    href: "https://github.com/rkhplace/AI-Health-Asisstant",
    icon: Brain,
    year: "2025",
  },
  {
    id: "library-crud",
    title: "CRUD Sistem Peminjaman Buku",
    type: "Data App",
    description: "Library loan management website centered on CRUD operations and database-driven workflows.",
    stack: ["CRUD", "Database", "Web"],
    href: "https://github.com/rkhplace/rkhplace-CRUD-Website-Sistem-Peminjaman-Buku-Perpustakaan",
    icon: BookOpen,
    year: "2025",
  },
  {
    id: "telyubooking",
    title: "UI/UX Design TelyuBooking",
    type: "Product Design",
    description: "Facility booking app design for Telkom University with mobile-first booking flow and prototype concept.",
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
    description: "Go-based workshop system for service data, spare-part inventory, transactions, search, and sorting.",
    stack: ["Go", "Algorithms", "Struct"],
    href: "https://github.com/rkhplace/Service-Motor-Management-System",
    icon: TerminalSquare,
    year: "2025",
  },
  {
    id: "athlete-data",
    title: "Pengolahan Data Atlet",
    type: "Data Structures",
    description: "C++ project for processing athlete and competition data with Delete First operation implementation.",
    stack: ["C++", "Data Structure", "Algorithm"],
    href: "https://github.com/rkhplace/Pengolahan-Data-Atlet-Dan-Data-Pertandingan",
    icon: Trophy,
    year: "2025",
  },
  {
    id: "database-security",
    title: "Database Security Mini Project",
    type: "Database Security",
    description: "Mini project exploring database protection techniques, access control, and security documentation.",
    stack: ["Database", "Security", "Access Control"],
    href: "https://github.com/rkhplace/Database-Security-Mini-Project",
    icon: Database,
    year: "2025",
  },
  {
    id: "oddeven",
    title: "OddEven Web Calculator",
    type: "Web Algorithm",
    description: "A web calculator separating odd and even numbers with iteration and recursion approaches.",
    stack: ["HTML", "CSS", "JavaScript"],
    href: "https://github.com/rkhplace/OddEvenWeb",
    demo: "https://rkhplace.github.io/OddEvenWeb/",
    icon: Code2,
    year: "2025",
  },
];

const curatedProjects = projects.slice(0, 6);

const languageIcons = {
  CSS: Globe2,
  Dart: MonitorSmartphone,
  Go: TerminalSquare,
  HTML: Globe2,
  JavaScript: Code2,
  PHP: ShieldCheck,
  Python: Cloud,
  TypeScript: Code2,
};

const projectDescriptionFallback =
  "Public GitHub repository by Rakha, kept available for code review and project reference.";

const normalizeClientRepo = (repo) => {
  const language = repo.type || repo.language || "GitHub Repository";
  const stack = Array.isArray(repo.stack) && repo.stack.length > 0 ? repo.stack : [language];

  return {
    id: repo.id,
    title: repo.title || repo.name || "GitHub Repository",
    type: language,
    description: repo.description || projectDescriptionFallback,
    stack,
    href: repo.href || repo.html_url,
    demo: repo.demo || repo.homepage || "",
    icon: languageIcons[language] || Github,
    updatedAt: repo.updatedAt || repo.updated_at,
  };
};

const formatProjectDate = (dateValue) => {
  if (!dateValue) return "Not available";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [expanded, setExpanded] = useState(false);
  const [githubProjects, setGithubProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const shownProjects = useMemo(
    () => (githubProjects.length > 0 ? githubProjects : curatedProjects),
    [githubProjects],
  );

  const { scrollYProgress } = useScroll();
  const readProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    mass: 0.25,
    restDelta: 0.0005,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const response = await fetch("/api/github-repos");
        if (!response.ok) throw new Error("GitHub repository API request failed");
        const data = await response.json();
        const repos = Array.isArray(data.repos)
          ? data.repos.map(normalizeClientRepo).slice(0, 6)
          : [];
        if (mounted && repos.length > 0) setGithubProjects(repos);
      } catch {
        if (mounted) setGithubProjects([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // The glass island widens once you leave the top of the hero.
    const onScroll = () => setExpanded(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => setActiveSection(entry.target.id));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    if (!selected) {
      document.body.style.overflow = "";
      return undefined;
    }
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="scroll-progress" style={{ scaleX: readProgress }} aria-hidden="true" />

      <header className={expanded ? "site-header expanded" : "site-header"}>
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
          <img src={logoImage} alt="" />
          Rakha
        </a>

        <nav className={menuOpen ? "site-nav open" : "site-nav"} aria-label="Main">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={activeSection === href.slice(1) ? "active" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <ParallaxHero
        name="Rakha Pratama"
        tagline="Frontend developer exploring interactive web, information systems, and geospatial experiences."
      />

      <About profileImage={profileImage} chapters={aboutChapters} stats={stats} />
      <Experience items={timelineItems} />
      <Projects projects={shownProjects} loading={loading} onSelect={setSelected} />
      <Skills services={services} techStack={techStack} />
      <Contact />
      <Footer />

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </MotionConfig>
  );
}

function ProjectModal({ project, onClose }) {
  const Icon = project.icon;
  const updated = project.updatedAt
    ? formatProjectDate(project.updatedAt)
    : project.year || "Not available";

  return (
    <motion.div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal"
        onMouseDown={(event) => event.stopPropagation()}
        initial={{ y: 24, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 16, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <span className="project-icon">{Icon ? <Icon size={22} /> : null}</span>
        <span className="eyebrow" style={{ marginTop: 16 }}>{project.type}</span>
        <h2 id="modal-title">{project.title}</h2>
        <p>{project.description}</p>

        <div className="modal-meta">
          <div>
            <span>Primary tech</span>
            <strong>{project.stack?.[0] || project.type}</strong>
          </div>
          <div>
            <span>Last updated</span>
            <strong>{updated}</strong>
          </div>
          <div>
            <span>Preview</span>
            <strong>{project.demo ? "Live demo" : "Code only"}</strong>
          </div>
        </div>

        <div className="tags" style={{ marginTop: 18 }}>
          {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
        </div>

        <div className="modal-actions">
          <a className="btn btn-solid" href={project.href} target="_blank" rel="noreferrer">
            View code <Github size={16} />
          </a>
          {project.demo && (
            <a className="btn btn-ghost" href={project.demo} target="_blank" rel="noreferrer">
              Live demo <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
