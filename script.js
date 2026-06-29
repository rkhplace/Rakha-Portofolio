// Initialize AOS
AOS.init({
    duration: 900,
    once: true
});

function closeMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.add('closing');
    setTimeout(() => {
        navLinks.classList.remove('active');
        navLinks.classList.remove('closing');
    }, 300);
}

document.getElementById('mobile-menu').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks.classList.contains('active')) {
        navLinks.classList.remove('closing');
        navLinks.classList.add('active');
    } else {
        closeMenu();
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            closeMenu();
        }
    });
});

document.addEventListener('click', (event) => {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!navLinks.contains(event.target) &&
        !mobileMenu.contains(event.target) &&
        navLinks.classList.contains('active')) {
        closeMenu();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    sections.forEach(section => {
        const top = window.scrollY;
        const offset = section.offsetTop - 150;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const activeLink = document.querySelector(`.nav-links a[href*="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            });
        }
    });
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

(function() {
    emailjs.init("C5UgQpej19VOUFKKJ");
})();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                to_name: "Rakha"
            };

            emailjs.send('service_fxv3fkg', 'template_c9ujtne', templateParams)
                .then(function() {
                    alert('Message sent successfully!');
                    form.reset();
                }, function() {
                    alert('Failed to send message. Please try again.');
                });
        });
    }

    renderProjects();
    setupProjectModal();
});

const projectsData = [
    {
        id: "jualin-abp",
        title: "JUALIN ABP",
        category: "Mobile / Marketplace",
        description: "A Dart-based marketplace project with a deployed web preview. Built as a practical product-style application around selling and transaction flows.",
        techStack: ["Dart", "Flutter", "Vercel"],
        features: [
            "Marketplace-focused product flow",
            "Public web deployment",
            "Mobile-first app structure"
        ],
        githubLink: "https://github.com/rkhplace/JUALIN-ABP",
        demoLink: "https://jualin-4g7j.vercel.app",
        updated: "2026-06-28",
        icon: "fa-store"
    },
    {
        id: "cek-cuaca-py",
        title: "Cek Cuaca Py",
        category: "Python Utility",
        description: "A Python weather-checking project that shows practical API/data handling and command-focused problem solving.",
        techStack: ["Python", "API", "CLI"],
        features: [
            "Weather data lookup",
            "Python scripting workflow",
            "Simple utility-oriented interface"
        ],
        githubLink: "https://github.com/rkhplace/Cek-Cuaca-Py",
        demoLink: "",
        updated: "2026-06-12",
        icon: "fa-cloud-sun"
    },
    {
        id: "trip-planner",
        title: "Trip Planner",
        category: "AI Web App",
        description: "Travel itinerary generator built with Next.js and Groq API. Users enter destination, duration, and preferences to generate travel plans automatically.",
        techStack: ["Next.js", "JavaScript", "Groq API", "AI"],
        features: [
            "AI-generated itinerary recommendations",
            "Destination, duration, and preference input",
            "Modern web app architecture"
        ],
        githubLink: "https://github.com/rkhplace/Trip-Planner",
        demoLink: "",
        updated: "2026-06-12",
        icon: "fa-route"
    },
    {
        id: "komisi-viii",
        title: "Website Anggota Komisi VIII DPR RI",
        category: "TypeScript Website",
        description: "A TypeScript website project for a public representative profile and information experience.",
        techStack: ["TypeScript", "Web Development", "Frontend"],
        features: [
            "Public-profile website structure",
            "Responsive information layout",
            "TypeScript-based frontend"
        ],
        githubLink: "https://github.com/rkhplace/Website-Anggota-Komisi-VIII-DPR-RI",
        demoLink: "",
        updated: "2026-04-03",
        icon: "fa-landmark"
    },
    {
        id: "cyber-security",
        title: "Tugas Besar Cyber Security",
        category: "Security Project",
        description: "A PHP-based cyber security coursework project focused on applying security concepts in a web environment.",
        techStack: ["PHP", "Cyber Security", "Web"],
        features: [
            "Security-focused implementation",
            "Server-side PHP flow",
            "Course project documentation"
        ],
        githubLink: "https://github.com/rkhplace/Tugas-Besar-Cyber-Security",
        demoLink: "",
        updated: "2025-12-20",
        icon: "fa-shield-halved"
    },
    {
        id: "tugas-paas",
        title: "Tugas PaaS",
        category: "Cloud Deployment",
        description: "A simple JavaScript app deployed on a PaaS platform, demonstrating cloud hosting and deployment basics.",
        techStack: ["JavaScript", "PaaS", "Vercel"],
        features: [
            "PaaS deployment workflow",
            "Live hosted application",
            "Cloud computing practice"
        ],
        githubLink: "https://github.com/rkhplace/Tugas-PaaS",
        demoLink: "https://tugas-paa-s-ashy.vercel.app",
        updated: "2025-12-12",
        icon: "fa-cloud"
    },
    {
        id: "azure-scalable-web",
        title: "Scalable Web App Azure",
        category: "Cloud Architecture",
        description: "A scalable web app designed for traffic spikes using Azure App Service, GitHub Actions CI/CD, and Application Insights monitoring.",
        techStack: ["JavaScript", "Azure", "CI/CD", "Monitoring"],
        features: [
            "Auto-scaling cloud architecture",
            "GitHub Actions deployment pipeline",
            "Application Insights performance monitoring"
        ],
        githubLink: "https://github.com/rkhplace/scalable-web-app-azure",
        demoLink: "",
        updated: "2025-11-30",
        icon: "fa-server"
    },
    {
        id: "ai-health-assistant",
        title: "AI Health Assistant",
        category: "AI Application",
        description: "A TypeScript AI assistant project exploring health-oriented guidance and conversational user experience.",
        techStack: ["TypeScript", "AI", "Frontend"],
        features: [
            "AI assistant interaction pattern",
            "Health-oriented user flow",
            "TypeScript implementation"
        ],
        githubLink: "https://github.com/rkhplace/AI-Health-Asisstant",
        demoLink: "",
        updated: "2025-11-30",
        icon: "fa-notes-medical"
    },
    {
        id: "perpustakaan-crud",
        title: "CRUD Website Sistem Peminjaman Buku",
        category: "CRUD Web App",
        description: "A library book-loan management website project focused on CRUD operations and data management workflows.",
        techStack: ["CRUD", "Web App", "Database"],
        features: [
            "Book borrowing management flow",
            "Create, read, update, and delete operations",
            "Library system use case"
        ],
        githubLink: "https://github.com/rkhplace/rkhplace-CRUD-Website-Sistem-Peminjaman-Buku-Perpustakaan",
        demoLink: "",
        updated: "2025-08-18",
        icon: "fa-book-open"
    },
    {
        id: "website-portofolio",
        title: "Website Portofolio",
        category: "Personal Website",
        description: "A personal portfolio website project that presents profile, work, and contact information.",
        techStack: ["Portfolio", "Frontend", "Personal Site"],
        features: [
            "Personal branding page",
            "Profile and contact sections",
            "Frontend layout practice"
        ],
        githubLink: "https://github.com/rkhplace/Website-Portofolio",
        demoLink: "",
        updated: "2025-08-11",
        icon: "fa-id-card"
    },
    {
        id: "rakha-portofolio",
        title: "Rakha Portofolio",
        category: "Current Portfolio",
        description: "This portfolio website, enhanced to showcase public GitHub projects from the rkhplace account.",
        techStack: ["HTML", "CSS", "JavaScript"],
        features: [
            "Responsive personal website",
            "Project showcase modal",
            "Contact form integration"
        ],
        githubLink: "https://github.com/rkhplace/Rakha-Portofolio",
        demoLink: "https://rakhaportofolio.netlify.app/",
        updated: "2025-03-16",
        icon: "fa-laptop-code"
    },
    {
        id: "athlete-data",
        title: "Pengolahan Data Atlet dan Pertandingan",
        category: "Data Structures",
        description: "A C++ project for processing athlete and competition data, including a Delete First operation implementation.",
        techStack: ["C++", "Data Structures", "Algorithms"],
        features: [
            "Athlete data management",
            "Competition data processing",
            "Delete First operation"
        ],
        githubLink: "https://github.com/rkhplace/Pengolahan-Data-Atlet-Dan-Data-Pertandingan",
        demoLink: "",
        updated: "2025-01-20",
        icon: "fa-medal"
    },
    {
        id: "telyubooking",
        title: "UI/UX Design TelyuBooking",
        category: "UI/UX Design",
        description: "A UI/UX design project for a Telkom University facility booking app, created for software development analysis coursework.",
        techStack: ["Figma", "UI/UX", "Prototyping"],
        features: [
            "Facility booking flow",
            "Mobile-first interface design",
            "Interactive prototype concept"
        ],
        githubLink: "https://github.com/rkhplace/UI-UX-design-TelyuBooking",
        demoLink: "https://www.figma.com/design/CrRirAsUVin8MYyeEnndIJ/UI%2FUX-design-TelyuBooking?node-id=1-139&t=ZqQghHNL7oKAcNHc-0",
        updated: "2025-01-19",
        icon: "fa-pen-ruler"
    },
    {
        id: "service-motor",
        title: "Service Motor Management System",
        category: "Backend / Algorithms",
        description: "A Go-based workshop management system for customer service data, spare-part inventory, and service transactions.",
        techStack: ["Go", "Binary Search", "Sorting", "Struct"],
        features: [
            "Customer service data CRUD",
            "Spare-part inventory management",
            "Search and sorting algorithms"
        ],
        githubLink: "https://github.com/rkhplace/Service-Motor-Management-System",
        demoLink: "",
        updated: "2025-01-19",
        icon: "fa-screwdriver-wrench"
    },
    {
        id: "database-security",
        title: "Database Security Mini Project",
        category: "Database Security",
        description: "A mini project exploring database security techniques for protecting data in database systems.",
        techStack: ["Database", "Security", "Access Control"],
        features: [
            "Database security concepts",
            "Access control exploration",
            "Security documentation"
        ],
        githubLink: "https://github.com/rkhplace/Database-Security-Mini-Project",
        demoLink: "",
        updated: "2025-01-19",
        icon: "fa-database"
    },
    {
        id: "oddeven",
        title: "OddEven Web Calculator",
        category: "Web Algorithm",
        description: "A web app that divides numbers into odd and even groups using iteration and recursion.",
        techStack: ["HTML", "CSS", "JavaScript"],
        features: [
            "Odd and even number separation",
            "Iteration method implementation",
            "Recursion method implementation"
        ],
        githubLink: "https://github.com/rkhplace/OddEvenWeb",
        demoLink: "https://rkhplace.github.io/OddEvenWeb/",
        updated: "2025-01-19",
        icon: "fa-code"
    }
];

function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) {
        return;
    }

    projectsGrid.innerHTML = projectsData.map((project, index) => `
        <article class="portfolio-item project-card" data-aos="fade-up" data-aos-delay="${Math.min(index * 40, 240)}">
            <div class="project-card-top">
                <div class="portfolio-icon">
                    <i class="fas ${project.icon}"></i>
                </div>
                <span class="project-category-label">${project.category}</span>
            </div>
            <div class="portfolio-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="portfolio-tags">
                    ${project.techStack.slice(0, 4).map(tech => `<span>${tech}</span>`).join('')}
                </div>
            </div>
            <div class="project-card-meta">
                <span><i class="fas fa-clock"></i> Updated ${formatProjectDate(project.updated)}</span>
            </div>
            <div class="portfolio-links">
                <button class="portfolio-link project-detail-btn" type="button" data-project="${project.id}">
                    <i class="fas fa-circle-info"></i> Details
                </button>
                <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="portfolio-demo">
                    <i class="fab fa-github"></i> Code
                </a>
                ${project.demoLink ? `
                    <a href="${project.demoLink}" target="_blank" rel="noopener noreferrer" class="portfolio-demo">
                        <i class="fas fa-arrow-up-right-from-square"></i> Demo
                    </a>
                ` : ''}
            </div>
        </article>
    `).join('');

    document.querySelectorAll('.project-detail-btn').forEach(button => {
        button.addEventListener('click', function() {
            showProjectDetails(this.getAttribute('data-project'));
        });
    });
}

function setupProjectModal() {
    document.querySelectorAll('.close-details').forEach(button => {
        button.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(closeModal);
        }
    });
}

function showProjectDetails(projectId) {
    const project = projectsData.find(item => item.id === projectId);
    const detailsModal = document.getElementById('projectDetailsModal');
    const detailsContent = document.getElementById('projectDetails');

    if (!project || !detailsModal || !detailsContent) {
        return;
    }

    detailsContent.innerHTML = `
        <div class="project-details-header">
            <span class="project-category-label">${project.category}</span>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        </div>

        <div class="project-tech-stack">
            ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>

        <div class="project-features">
            <h4>Key Features:</h4>
            <ul>
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>

        <div class="project-links">
            <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer"
               class="project-link-btn github-link">
                <i class="fab fa-github"></i> View on GitHub
            </a>
            ${project.demoLink ? `
                <a href="${project.demoLink}" target="_blank" rel="noopener noreferrer"
                   class="project-link-btn demo-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
            ` : ''}
        </div>
    `;

    document.getElementById('detailsTitle').textContent = project.title;
    detailsModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) {
        return;
    }

    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function formatProjectDate(value) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric'
    }).format(new Date(`${value}T00:00:00`));
}
