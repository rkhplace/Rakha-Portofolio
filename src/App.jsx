import { useEffect, useMemo, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
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
import landscapeImage from "../images/background_1.jpg";
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
import { useCinematicScroll } from "./hooks/useCinematicScroll";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Skills", "#services"],
  ["Projects", "#portfolio"],
  ["Experience", "#experience"],
  ["Contact", "#contact"],
];

const stats = [
  ["16+", "Public projects"],
  ["5+", "Languages"],
  ["2+", "Years learning"],
];

const cursorTrailDots = Array.from({ length: 8 }, (_, index) => index);

const capabilities = [
  {
    id: "frontend",
    icon: Code2,
    title: "Frontend Development",
    text: "Building responsive, accessible, and performant interfaces with modern web technologies.",
    tags: ["React", "TypeScript", "UI Systems"],
  },
  {
    id: "webgis",
    icon: Globe2,
    title: "WebGIS",
    text: "Visualizing spatial data and building interactive maps for real-world decision making.",
    tags: ["Maps", "Spatial Data", "Leaflet"],
  },
  {
    id: "systems",
    icon: Layers3,
    title: "Information Systems",
    text: "Designing and developing systems that streamline processes and improve clarity.",
    tags: ["Database", "CRUD", "Architecture"],
  },
  {
    id: "product",
    icon: Brain,
    title: "Product Building",
    text: "From idea to MVP \u2014 turning complex problems into simple, impactful digital products.",
    tags: ["AI", "Full-stack", "Deployment"],
  },
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

const fallbackProjects = projects.slice(0, 6);

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

const projectSkeletons = Array.from({ length: 6 }, (_, index) => index);

const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.86, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.1,
    },
  },
};

const viewportOnce = { once: true, amount: 0.12, margin: "0px 0px -110px 0px" };

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
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

function App() {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [githubProjects, setGithubProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const featuredProjects = useMemo(
    () => (githubProjects.length > 0 ? githubProjects : fallbackProjects),
    [githubProjects],
  );
  useCinematicScroll({
    enabled: !reduceMotion,
    refreshKey: `${projectsLoading}-${featuredProjects.length}`,
  });

  const closeMenu = () => setMenuOpen(false);
  const enterWorld = (event) => {
    event.preventDefault();
    closeMenu();
    if (window.innerWidth >= 981) {
      const stage = document.querySelector(".hero-stage");
      const offset = stage ? stage.offsetTop : 0;
      window.scrollTo({
        top: offset + window.innerHeight * 2.5,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: Math.max(window.innerHeight * 0.9, 680),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadGithubProjects = async () => {
      try {
        const response = await fetch("/api/github-repos");

        if (!response.ok) {
          throw new Error("GitHub repository API request failed");
        }

        const data = await response.json();
        const repos = Array.isArray(data.repos) ? data.repos.map(normalizeClientRepo).slice(0, 6) : [];

        if (isMounted && repos.length > 0) {
          setGithubProjects(repos);
        }
      } catch {
        if (isMounted) {
          setGithubProjects([]);
        }
      } finally {
        if (isMounted) {
          setProjectsLoading(false);
        }
      }
    };

    loadGithubProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let frameId;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.2;
    const trail = cursorTrailDots.map(() => ({ x: targetX, y: targetY }));

    document.documentElement.style.setProperty("--cursor-x", `${targetX.toFixed(1)}px`);
    document.documentElement.style.setProperty("--cursor-y", `${targetY.toFixed(1)}px`);

    const setMouseTarget = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      document.documentElement.style.setProperty("--cursor-x", `${targetX.toFixed(1)}px`);
      document.documentElement.style.setProperty("--cursor-y", `${targetY.toFixed(1)}px`);
    };

    const animateSpotlight = () => {
      trail.forEach((dot, index) => {
        const leader = index === 0 ? { x: targetX, y: targetY } : trail[index - 1];
        const friction = index === 0 ? 0.68 : 0.46;
        dot.x += (leader.x - dot.x) * friction;
        dot.y += (leader.y - dot.y) * friction;
        document.documentElement.style.setProperty(`--trail-${index}-x`, `${dot.x.toFixed(1)}px`);
        document.documentElement.style.setProperty(`--trail-${index}-y`, `${dot.y.toFixed(1)}px`);
      });

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
      const logo = document.querySelector(".brand-mark");
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
      const nextScrolled = window.scrollY > 8;
      const activationLine = Math.min(window.innerHeight * 0.42, 340);

      setIsScrolled((previous) => (previous === nextScrolled ? previous : nextScrolled));

      const heroStage = document.querySelector(".hero-stage");
      const isDesktopWorld = window.innerWidth > 980 && heroStage;

      if (isDesktopWorld) {
        const heroStart = heroStage.offsetTop;
        const heroEnd = heroStart + window.innerHeight * 4.5;
        const worldProgress = (window.scrollY - heroStart) / Math.max(heroEnd - heroStart, 1);

        if (worldProgress >= 0 && worldProgress < 1) {
          current = navItems[0];
          setActiveSection((previous) => (previous === current[0] ? previous : current[0]));
          return;
        }
      }

      navItems.forEach((item) => {
        const [, href] = item;
        const section = document.querySelector(href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= activationLine && rect.bottom > activationLine) {
            current = item;
          }
        }
      });

      if (current === navItems[0]) {
        navItems.forEach((item) => {
          const [, href] = item;
          const section = document.querySelector(href);
          if (section && section.getBoundingClientRect().top <= activationLine) {
            current = item;
          }
        });
      }

      setActiveSection((previous) => (previous === current[0] ? previous : current[0]));
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
    <MotionConfig reducedMotion="user">
      <header className={isScrolled ? "site-header scrolled" : "site-header"}>
        <a className="brand" href="#home" onClick={closeMenu}>
          <img className="brand-mark" src={logoImage} alt="Rakha logo" />
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

      <div className="cursor-effect" aria-hidden="true">
        <div className="cursor-glow" />
        <div className="cursor-shadow-trail">
          {cursorTrailDots.map((dot) => (
            <span key={dot} />
          ))}
        </div>
      </div>

      <main>
        <section id="home" className="hero-stage">
          {/* ── Persistent World Canvas ── */}
          <div className="world-canvas" aria-hidden="true">
            <div className="wc-far" />
            <div className="wc-mid">
              <span className="mid-panel" />
              <span className="mid-panel" />
              <span className="mid-panel" />
              <span className="mid-panel" />
            </div>
            <div className="wc-road">
              <div className="road-horizon" />
              <div className="road-surface" />
              <div className="road-edges" />
              <div className="road-centerline" />
              <div className="road-contours" />
            </div>
            <div className="wc-grid" />
            <div className="wc-fog" />
          </div>

          {/* ── Hero Content Layer ── */}
          <div className="hero-content-layer">
            <div className="hcl-inner">
              <motion.div
                className="hero-copy"
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                variants={staggerVariants}
              >
                <motion.span className="eyebrow" variants={fadeUpVariants}>
                  Portfolio / 2026
                </motion.span>
                <motion.h1 className="masked-title" variants={fadeUpVariants}>
                  <span>Building thoughtful</span>
                  <span>digital experiences.</span>
                </motion.h1>
                <motion.p variants={fadeUpVariants}>
                  Muhammad Rakha Pratama \u2014 a Frontend Developer exploring
                  interactive web, information systems, and geospatial experiences.
                </motion.p>
                <motion.div className="hero-actions" variants={fadeUpVariants}>
                  <a className="button primary magnetic-target" href="#home" onClick={enterWorld}>
                    Enter my world <ArrowUpRight size={17} />
                  </a>
                  <a className="button ghost magnetic-target" href="#portfolio">
                    View projects <ArrowUpRight size={17} />
                  </a>
                </motion.div>
              </motion.div>
              <motion.div
                className="hero-proof"
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                variants={fadeUpVariants}
                aria-label="Core focus"
              >
                <span>
                  <Code2 size={19} />
                  <strong>Frontend</strong>
                  <em>React \u00b7 TypeScript</em>
                </span>
                <span>
                  <Globe2 size={19} />
                  <strong>WebGIS</strong>
                  <em>Maps \u00b7 Spatial Data</em>
                </span>
                <span>
                  <Layers3 size={19} />
                  <strong>Cloud</strong>
                  <em>Deploy \u00b7 Scalable</em>
                </span>
              </motion.div>
            </div>
          </div>

          {/* ── Floating Labels ── */}
          <span className="floating-label fl-frontend">Frontend</span>
          <span className="floating-label fl-webgis">WebGIS</span>
          <span className="floating-label fl-systems">Information Systems</span>

          {/* ── About Content Layer (revealed by GSAP) ── */}
          <div className="about-content-layer">
            <div className="acl-inner">
              <div className="acl-text">
                <span className="eyebrow">About Me</span>
                <h2>
                  I build interfaces that turn complex systems into clear digital
                  experiences<span style={{ color: "#6e8aa4" }}>.</span>
                </h2>
                <p>
                  I\u2019m Muhammad Rakha Pratama, a Frontend Developer who loves
                  crafting elegant interfaces and building geospatial solutions
                  that make data easier to understand and act on.
                </p>
                <a className="button ghost" href="#experience">
                  View my experience <ArrowUpRight size={17} />
                </a>
              </div>
              <div className="capability-grid">
                {capabilities.map((cap) => {
                  const Icon = cap.icon;
                  return (
                    <div className="cap-card" key={cap.id}>
                      <div className="cap-card-head">
                        <Icon size={22} />
                        <ArrowUpRight size={15} />
                      </div>
                      <h4>{cap.title}</h4>
                      <p>{cap.text}</p>
                      <div className="cap-tags">
                        {cap.tags.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Selected Project Layer (revealed last by GSAP) ── */}
          <div className="project-hint-layer">
            <div className="phl-inner">
              <span className="eyebrow">Selected Project</span>
              <article className="selected-project-card">
                <img src={landscapeImage} alt="GeoVista Dashboard preview" />
                <div>
                  <strong>
                    GeoVista Dashboard <ArrowUpRight size={16} />
                  </strong>
                  <p>
                    An interactive geospatial dashboard for monitoring
                    environmental data and spatial analytics.
                  </p>
                  <div className="sp-tags">
                    <span>WebGIS</span>
                    <span>Analytics</span>
                    <span>Maps</span>
                    <span>Data Visualization</span>
                  </div>
                  <a href="#portfolio">
                    View case study <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            </div>
          </div>

          {/* ── Scroll Hint ── */}
          <div className="scroll-to-enter" aria-hidden="true">
            <div className="ste-mouse">
              <div className="ste-wheel" />
            </div>
            <span>SCROLL TO ENTER</span>
          </div>
        </section>

        <div className="section-bridge" aria-hidden="true"><div className="bridge-line" /></div>

        <div className="digital-world">
          <motion.section
            className="ticker"
            aria-label="Core skills"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
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
          </motion.section>

          <section id="about" className="section-shell about about-story">
          <div className="about-sticky">
            <span className="eyebrow">About</span>
            <h2>I turn complex ideas into interfaces that feel clear, responsive, and alive.</h2>
            <div className="about-progress" aria-hidden="true">
              <span className="about-progress-bar" />
            </div>
          </div>
          <motion.div
            className="about-grid story-grid"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerVariants}
          >
            <motion.div className="about-copy" variants={fadeUpVariants}>
              <p>
                My projects cover marketplaces, itinerary planning, cyber
                security coursework, cloud deployment, data structures, database
                security, and product design. I focus on work that can be tested,
                reviewed, and improved.
              </p>
              <motion.div className="stats-grid" variants={staggerVariants}>
                {stats.map(([value, label]) => (
                  <motion.div className="stat-card" key={label} variants={fadeUpVariants}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div className="story-chapters" variants={staggerVariants}>
              {aboutChapters.map((chapter) => (
                <article className="story-chapter" key={chapter.title}>
                  <span>{chapter.kicker}</span>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.text}</p>
                </article>
              ))}
            </motion.div>
          </motion.div>
          </section>

          <div className="section-bridge" aria-hidden="true"><div className="bridge-line" /></div>

          <AnimatedSection id="services" className="section-shell services">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Skills</span>
              <h2>Skills I use across my projects.</h2>
            </div>
            <p>
              A compact set of skills developed through coursework, public
              repositories, and deployment practice.
            </p>
          </div>
          <motion.div
            className="service-grid"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerVariants}
          >
            {services.map(({ icon: Icon, title, text, tags }) => (
              <motion.article
                className="service-card"
                key={title}
                variants={fadeUpVariants}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              >
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="tag-row">
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
          </AnimatedSection>

          <div className="section-bridge" aria-hidden="true"><div className="bridge-line" /></div>

          <section id="portfolio" className="portfolio">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2>Public projects, presented with more depth.</h2>
            </div>
            <a className="button ghost dark" href="https://github.com/rkhplace" target="_blank" rel="noreferrer">
              See all repositories <ArrowUpRight size={17} />
            </a>
          </div>

          {projectsLoading ? (
            <motion.div
              className="featured-grid section-shell"
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerVariants}
            >
              {projectSkeletons.map((item) => <ProjectSkeletonCard key={item} />)}
            </motion.div>
          ) : (
            <motion.div
              className="featured-grid section-shell"
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerVariants}
            >
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onSelect={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
          )}
          </section>
        </div>

        <div className="section-bridge" aria-hidden="true"><div className="bridge-line" /></div>

        <AnimatedSection id="experience" className="section-shell timeline-section">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">Experience</span>
              <h2>Learning timeline through shipped work.</h2>
            </div>
            <p>
              A compact view of milestones from coursework, deployment practice,
              product experiments, and portfolio improvements.
            </p>
          </div>
          <div className="timeline-list">
            {timelineItems.map((item) => (
              <article className="timeline-item" key={item.title}>
                <span className="timeline-year">{item.year}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="tag-row">
                    {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </AnimatedSection>

        <div className="section-bridge" aria-hidden="true"><div className="bridge-line" /></div>

        <AnimatedSection id="contact" className="section-shell contact">
          <BackgroundStreaks className="contact-streaks" />
          <div>
            <span className="eyebrow">Contact</span>
            <h2>Let's build something meaningful.</h2>
            <p className="contact-lede">
              Have a project, an opportunity, or an idea worth exploring?
              I am open to collaboration, internship conversations, and practical product work.
            </p>
          </div>
          <div className="contact-card">
            <a href="mailto:mrakhaptatama135@gmail.com">
              <Mail size={18} /> mrakhaptatama135@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/rkhap/" target="_blank" rel="noreferrer">
              <Linkedin size={18} /> LinkedIn
            </a>
            <a href="https://github.com/rkhplace" target="_blank" rel="noreferrer">
              <Github size={18} /> GitHub
            </a>
            <a href="https://www.instagram.com/rkhap_/" target="_blank" rel="noreferrer">
              <Instagram size={18} /> Instagram
            </a>
            <span>
              <MapPin size={18} /> Bandung, Indonesia
            </span>
          </div>
        </AnimatedSection>
      </main>

      <footer>
        <span>{"\u00a9"} 2026 Muhammad Rakha Pratama</span>
        <a href="#home">Back to top</a>
      </footer>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </MotionConfig>
  );
}

function ProjectCard({ project, index, onSelect }) {
  const reduceMotion = useReducedMotion();
  const Icon = project.icon;
  return (
    <motion.article
      className={`project-card card-${index + 1}`}
      variants={fadeUpVariants}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="project-icon">
        <Icon size={24} />
      </div>
      <div>
        <span className="project-type">{project.type}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
      <dl className="project-meta-grid">
        <div>
          <dt>Problem</dt>
          <dd>Turn an idea into a testable public project.</dd>
        </div>
        <div>
          <dt>Solution</dt>
          <dd>Build a focused app surface with clear repository structure.</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>Interface, logic, deployment, and documentation.</dd>
        </div>
      </dl>
      <div className="tag-row">
        {project.stack.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="project-actions">
        {project.demo ? (
          <a className="project-details-link" href={project.demo} target="_blank" rel="noopener noreferrer">
            Live preview <ArrowUpRight size={15} />
          </a>
        ) : (
          <button type="button" onClick={onSelect}>
            Details
          </button>
        )}
        <a href={project.href} target="_blank" rel="noopener noreferrer">
          Repository <ArrowUpRight size={15} />
        </a>
      </div>
    </motion.article>
  );
}

function ProjectSkeletonCard() {
  return (
    <article className="project-card project-card-skeleton" aria-hidden="true">
      <span className="skeleton-icon" />
      <div className="skeleton-content">
        <span />
        <span />
        <span />
      </div>
      <div className="skeleton-tags">
        <span />
        <span />
        <span />
      </div>
      <div className="skeleton-actions">
        <span />
        <span />
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }) {
  const Icon = project.icon;
  const updatedLabel = project.updatedAt ? formatProjectDate(project.updatedAt) : project.year || "Not available";
  const primaryStack = project.stack?.[0] || project.type || "Repository";

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
        <div className="modal-meta" aria-label="Repository metadata">
          <div>
            <span>Primary tech</span>
            <strong>{primaryStack}</strong>
          </div>
          <div>
            <span>Last updated</span>
            <strong>{updatedLabel}</strong>
          </div>
          <div>
            <span>Preview</span>
            <strong>{project.demo ? "Live demo available" : "Code repository"}</strong>
          </div>
        </div>
        <div className="tag-row">
          {project.stack.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="modal-actions">
          <a className="button primary" href={project.href} target="_blank" rel="noopener noreferrer">
            View code <Github size={17} />
          </a>
          {project.demo && (
            <a className="button ghost dark" href={project.demo} target="_blank" rel="noopener noreferrer">
              Live demo <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function AnimatedSection({ id, className, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpVariants}
    >
      {children}
    </motion.section>
  );
}

function BackgroundStreaks({ className = "", style }) {
  return <motion.div className={`background-streaks ${className}`} style={style} aria-hidden="true" />;
}

export default App;

