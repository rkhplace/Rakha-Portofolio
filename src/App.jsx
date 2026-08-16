import { useEffect, useMemo, useRef, useState } from "react";
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
import workDigitalTwin from "../images/work/work-digital-twin.webp";
import workJualinProduct from "../images/work/work-jualin-product.webp";
import workJualinMobile from "../images/work/work-jualin-mobile.webp";
import workDprRi from "../images/work/work-dpr-ri.webp";
import workTripPlanner from "../images/work/work-trip-planner.webp";
import workJualinLogin from "../images/work/work-jualin-login.webp";
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
import { About, Contact, Experience, Footer, Projects, Skills, Work } from "./components/Sections";
import useSmoothScroll from "./hooks/useSmoothScroll";
import "./styles/theme.css";

const navItems = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

/* "2+ Years learning" was here and had to go: every candidate is learning, so
 * the line spent a stat slot saying nothing. These three all point at finished
 * things instead. */
const stats = [
  ["16+", "Public projects"],
  ["7", "Languages used"],
  ["5+", "Live deployments"],
];

/*
 * Reordered so the rarest work leads. Frontend used to sit at 02 as a headline
 * competency, which both undersold the range below it and repeated what this
 * page already demonstrates on its own. Geospatial lost its chapter entirely —
 * it was claimed in four places across the site with no project to point at.
 */
const aboutChapters = [
  {
    kicker: "01",
    title: "Computer Science Student",
    text: "S1 Informatics student from Bandung who keeps turning coursework into public repositories and deployable apps. Currently curious about map-based interfaces.",
  },
  {
    kicker: "02",
    title: "Cloud Deployment and Delivery",
    text: "Comfortable taking a project past “runs on my machine” — Azure App Service, GitHub Actions pipelines, and monitoring once it is actually live.",
  },
  {
    kicker: "03",
    title: "Security and Data",
    text: "Coursework and mini projects in web security, database access control, and CRUD systems built on real schemas rather than mock data.",
  },
  {
    kicker: "04",
    title: "Full-stack Product Building",
    text: "Connecting interfaces to APIs, databases, mobile flows, and small AI-powered features — end to end, rather than one layer of it.",
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

/*
 * Order inverted: the first card is what you meet first, and it used to be the
 * one skill this page already proves by existing. Frontend now closes the list
 * and says so outright.
 *
 * `stack` names index into techStack above rather than repeating logo imports,
 * so a tool has exactly one definition. Every area carries its own set — the
 * previous build showed all nineteen logos on every tab, which made the choice
 * of area mean nothing.
 */
const services = [
  {
    icon: Server,
    title: "Cloud Deployment",
    text: "Getting work into production and keeping it observable there — App Service, pipelines that deploy on push, and monitoring after release.",
    stack: ["Microsoft Azure", "GitHub", "Vercel", "Netlify"],
  },
  {
    icon: ShieldCheck,
    title: "Security and Data",
    text: "Web security practice, database access control, and data-driven systems built on real schemas and real algorithms.",
    stack: ["PostgreSQL", "PHP", "Go", "C++", "Python"],
  },
  {
    icon: Brain,
    title: "AI Integration",
    text: "Practical AI features for assistants, planning tools, and workflow automation, wired to real model APIs.",
    stack: ["Next.js", "TypeScript", "JavaScript", "Python"],
  },
  {
    icon: MonitorSmartphone,
    title: "Mobile Product",
    text: "Mobile-first product flows using Dart and Flutter, from layout and prototype through to a deployed web preview.",
    stack: ["Flutter", "Dart", "Figma", "Vercel"],
  },
  {
    icon: Code2,
    title: "Frontend Engineering",
    text: "Responsive interfaces, reusable components, and interaction detail that holds up under scrolling — this page being the working example.",
    stack: ["React", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Vite", "Figma"],
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

/*
 * Mirrors FEATURED_REPOS in netlify/functions/github-repos.js. Without it the
 * offline fallback was a plain slice(0, 6) — and the Azure project sits seventh
 * in the list above, so whenever the GitHub call failed the single most
 * differentiating piece of work silently vanished from the page.
 */
const FEATURED_IDS = ["azure", "cyber-security", "jualin-abp"];

const curatedProjects = [
  ...FEATURED_IDS.map((id) => projects.find((project) => project.id === id)).filter(Boolean),
  ...projects.filter((project) => !FEATURED_IDS.includes(project.id)),
].slice(0, 6);

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

/*
 * The gallery set. `shape` drives the grid span, not the image's own aspect:
 * `wide` is a half-row cell, `tall` is the phone shot standing through two rows
 * beside them, `full` closes the grid across its whole width so the last row
 * has no hole in it.
 */
const workShots = [
  {
    src: workDigitalTwin,
    shape: "wide",
    title: "3D Digital Twin — Bandung",
    note: "Cesium and OpenStreetMap, 2,500 building footprints extruded, sensor and citizen-report layers.",
    alt: "3D digital twin of Bandung with extruded OpenStreetMap buildings and layer filters",
  },
  {
    src: workJualinProduct,
    shape: "wide",
    title: "JUALIN — product detail",
    note: "Leaflet radius search: buyers see a 10 km area, never the seller's exact address.",
    alt: "JUALIN product page showing a listing beside a map with a 10 km offer radius",
  },
  {
    src: workJualinMobile,
    shape: "tall",
    title: "JUALIN — Flutter app",
    note: "The same marketplace built for mobile.",
    alt: "JUALIN marketplace running on a phone, showing the product feed",
  },
  {
    src: workDprRi,
    shape: "wide",
    title: "Komisi VIII DPR RI",
    note: "Public profile and agenda site for a sitting member of parliament.",
    alt: "Landing page of the DPR RI member profile website",
  },
  {
    src: workTripPlanner,
    shape: "wide",
    title: "Trip Planner",
    note: "Groq-generated itinerary with a mapped route per day, exportable to PDF, Excel and Word.",
    alt: "Trip Planner itinerary form beside a map of Bali with a daily route",
  },
  {
    src: workJualinLogin,
    shape: "full",
    title: "JUALIN — seller entry",
    note: "Sign-in and onboarding for the seller side of the marketplace.",
    alt: "JUALIN sign-in page with the seller value proposition alongside",
  },
];

const projectDescriptionFallback =
  "Public GitHub repository by Rakha, kept available for code review and project reference.";

/* Repo name out of a GitHub URL, lowercased so the two sides can be matched. */
const repoKeyFromHref = (value) => {
  const match = String(value || "").match(/github\.com\/[^/]+\/([^/?#]+)/i);
  return match ? match[1].toLowerCase() : "";
};

const curatedByRepo = new Map(
  projects
    .filter((project) => repoKeyFromHref(project.href))
    .map((project) => [repoKeyFromHref(project.href), project]),
);

/* `scalable-web-app-azure` -> `Scalable Web App Azure`, for repos with no
 * curated entry yet. Words already in caps are left alone so an acronym does
 * not come back as `Jualin Abp`. */
const prettifyRepoName = (name) =>
  String(name || "GitHub Repository")
    .replace(/[-_]+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (word === word.toUpperCase() ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");

/*
 * Curated copy wins; GitHub fills the gaps.
 *
 * The live feed used to replace the curated list wholesale, so the moment the
 * API succeeded every hand-written title and description was thrown away — the
 * grid came back with raw slugs for titles, "JAVASCRIPT" where the curated type
 * said "Cloud Architecture", a paragraph-long README blurb on one card and the
 * placeholder string on repos that carry no GitHub description at all. GitHub
 * is still what decides *which* repos appear and when they were last touched,
 * and it remains the only source for anything not curated yet.
 */
const normalizeClientRepo = (repo) => {
  const curated = curatedByRepo.get(repoKeyFromHref(repo.href || repo.html_url));

  if (curated) {
    return {
      ...curated,
      demo: curated.demo || repo.demo || repo.homepage || "",
      updatedAt: repo.updatedAt || repo.updated_at,
    };
  }

  const language = repo.type || repo.language || "GitHub Repository";

  return {
    id: repo.id,
    title: prettifyRepoName(repo.title || repo.name),
    type: language,
    description: repo.description || projectDescriptionFallback,
    stack: Array.isArray(repo.stack) && repo.stack.length > 0 ? repo.stack : [language],
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
  const [overHero, setOverHero] = useState(true);
  const [githubProjects, setGithubProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const shownProjects = useMemo(
    () => (githubProjects.length > 0 ? githubProjects : curatedProjects),
    [githubProjects],
  );

  const lenis = useSmoothScroll();

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
    const onScroll = () => {
      // The glass island widens once you leave the top of the hero.
      setExpanded(window.scrollY > 40);
      /*
       * The hero is 220vh of near-black sky, so the header floats over dark for
       * the first two screens and its navy-on-frosted-white treatment goes
       * unreadable there. Tracking the hero's own bottom edge rather than a
       * scroll threshold keeps the swap tied to what is actually behind it.
       */
      const hero = document.getElementById("home");
      setOverHero(hero ? hero.getBoundingClientRect().bottom > 96 : false);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
      lenis.current?.start();
      return undefined;
    }
    // `overflow: hidden` alone no longer holds the page: Lenis drives the real
    // window scroll from its own loop and has to be paused as well.
    document.body.style.overflow = "hidden";
    lenis.current?.stop();

    const onKey = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      lenis.current?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, lenis]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="scroll-progress" style={{ scaleX: readProgress }} aria-hidden="true" />

      <header
        className={["site-header", expanded && "expanded", overHero && "on-dark"]
          .filter(Boolean)
          .join(" ")}
      >
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
        tagline="Informatics student building and shipping full-stack products — cloud deployment, security, mobile, and the web."
      />

      <About profileImage={profileImage} chapters={aboutChapters} stats={stats} />
      <Experience items={timelineItems} />
      <Projects projects={shownProjects} loading={loading} onSelect={setSelected} />
      {/* Straight after the list: named, then shown. */}
      <Work items={workShots} />
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
  const modalRef = useRef(null);
  const Icon = project.icon;
  const updated = project.updatedAt
    ? formatProjectDate(project.updatedAt)
    : project.year || "Not available";

  /*
   * Focus management for the dialog. Without it, opening the modal leaves focus
   * on the card behind the backdrop: Tab walks straight into the page
   * underneath while the dialog is still up, and closing drops the user at the
   * top of the document rather than the card they opened.
   */
  useEffect(() => {
    const returnTo = document.activeElement;
    const modal = modalRef.current;
    modal?.querySelector(".modal-close")?.focus();

    const onKeyDown = (event) => {
      if (event.key !== "Tab" || !modal) return;

      const focusable = [...modal.querySelectorAll("a[href], button:not([disabled])")];
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!modal.contains(document.activeElement)) {
        // Focus was outside the dialog to begin with — pull it back in rather
        // than let Tab continue through the page behind the backdrop.
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Runs once AnimatePresence has finished the exit animation, which is the
      // point the dialog is actually gone from the page.
      if (returnTo instanceof HTMLElement) returnTo.focus();
    };
  }, []);

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
        ref={modalRef}
        /* Lenis calls preventDefault on wheel events even while stopped, which
         * would freeze this panel's own overflow scrolling. This attribute is
         * the documented opt-out and is checked before that. */
        data-lenis-prevent=""
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
