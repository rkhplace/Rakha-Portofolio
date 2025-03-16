// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Mobile Menu Functions
function closeMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.add('closing');
    setTimeout(() => {
        navLinks.classList.remove('active');
        navLinks.classList.remove('closing');
    }, 300);
}

// Mobile Menu Toggle with Animation
document.getElementById('mobile-menu').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks.classList.contains('active')) {
        navLinks.classList.remove('closing');
        navLinks.classList.add('active');
    } else {
        closeMenu();
    }
});

// Close menu when clicking navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            closeMenu();
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!navLinks.contains(e.target) && 
        !mobileMenu.contains(e.target) && 
        navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', function() {
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(section => {
        let top = window.scrollY;
        let offset = section.offsetTop - 150;
        let height = section.offsetHeight;
        let id = section.getAttribute('id');
        
        if(top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector('.nav-links a[href*=' + id + ']').classList.add('active');
            });
        }
    });
});

// Initialize EmailJS
(function() {
    emailjs.init("C5UgQpej19VOUFKKJ");
    console.log("EmailJS Initialized");
})();

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Pastikan form ditemukan
    const form = document.getElementById('contactForm');
    console.log("Form found:", form);

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form submitted");

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            console.log("Form data:", { name, email, subject, message });

            // Prepare template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_name: "Raka"
            };

            console.log("Sending with params:", templateParams);

            // Send email
            emailjs.send('service_fxv3fkg', 'template_c9ujtne', templateParams)
                .then(function(response) {
                    console.log("SUCCESS!", response.status, response.text);
                    alert('Message sent successfully!');
                    form.reset();
                }, function(error) {
                    console.log("FAILED...", error);
                    alert('Failed to send message. Please try again.');
                });
        });
    }
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Project data
const projectsData = {
    // Web Projects
    oddeven: {
        title: "OddEven Web Calculator",
        description: "A web application that divides numbers into odd and even using iteration and recursion methods. This project demonstrates the implementation of basic algorithmic concepts in JavaScript.",
        techStack: ["HTML (50%)", "CSS (44.4%)", "JavaScript (5.6%)"],
        features: [
            "Input validation",
            "Iteration method implementation",
            "Recursion method implementation",
            "Responsive design",
            "User-friendly interface"
        ],
        githubLink: "https://github.com/rkhplace/OddEvenWeb",
        demoLink: "https://rkhplace.github.io/OddEvenWeb/"
    },
    
    // Mobile Projects
    fitnessapp: {
        title: "Fitness Tracker App",
        description: "A mobile application for tracking daily fitness activities, workouts, and health metrics.",
        techStack: ["Flutter", "Firebase", "Dart"],
        features: [
            "User authentication",
            "Activity tracking",
            "Progress visualization",
            "Workout plans",
            "Health metrics monitoring"
        ],
        githubLink: "#",
        demoLink: "#"
    },
    
    // Design Projects
    ecommerceui: {
        title: "TelyuBooking UI/UX Design",
        description: "A modern and user-friendly booking platform designed specifically for Telkom University facilities. The design focuses on simplifying the booking process while maintaining the university's brand identity.",
        techStack: ["Figma", "UI/UX", "Wireframing", "Prototyping"],
        features: [
            "User-friendly booking interface",
            "Telkom University brand integration",
            "Responsive mobile-first design",
            "Intuitive navigation system",
            "Streamlined booking process",
            "Interactive prototype",
            "Consistent design system"
        ],
        githubLink: "https://github.com/rkhplace/UI-UX-design-TelyuBooking",
        demoLink: "https://www.figma.com/design/CrRirAsUVin8MYyeEnndIJ/UI%2FUX-design-TelyuBooking?node-id=1-139&t=ZqQghHNL7oKAcNHc-0"
    },

    // Database Projects
    databasesystem: {
        title: "Database Security System Mini Project",
        description: "A focused project on implementing security measures in database systems, including access control, data encryption, and audit logging to protect sensitive information.",
        techStack: ["MySQL"],
        features: [
            "Implementation of role-based access control (RBAC)",
            "Data encryption for sensitive information",
            "Comprehensive audit logging system",
            "Vulnerability assessment and mitigation",
            "Detailed documentation of security implementation"
        ],
        githubLink: "https://github.com/rkhplace/Database-Security-Mini-Project",
        demoLink: "https://your-demo-link.com"
    },

    // Backend Projects
    goproject: {
        title: "Service Motor Management System",
        description: "Sistem manajemen bengkel motor yang menangani data pelanggan, inventaris spare part, dan transaksi service. Mengimplementasikan berbagai struktur data dan algoritma untuk pengelolaan data yang efisien.",
        techStack: [
            "Go",
            "Binary Search Algorithm",
            "Insertion Sort",
            "Selection Sort",
            "Array & Struct"
        ],
        features: [
            "Manajemen data service pelanggan (CRUD)",
            "Sistem inventaris gudang spare part",
            "Pencatatan dan tracking transaksi service",
            "Pencarian data berdasarkan tanggal/bulan/tahun",
            "Perhitungan biaya service berdasarkan tipe motor",
            "Tracking penjualan spare part",
            "Multi-level menu system"
        ],
        githubLink: "https://github.com/rkhplace/Service-Motor-Management-System",
        demoLink: "#"
    },

    // New Backend Project
    athletedata: {
        title: "Athlete Data Management System",
        description: "A C++ application for managing athlete and competition data. Implements data structures and algorithms for efficient data processing with Delete First operation.",
        techStack: ["C++", "Data Structures", "Algorithms"],
        features: [
            "CRUD operations for athlete data",
            "Competition data management",
            "Delete First implementation",
            "Data processing algorithms",
            "Efficient data structure usage"
        ],
        githubLink: "https://github.com/rkhplace/Pengolahan-Data-Atlet-Dan-Data-Pertandingan",
        demoLink: "#"
    }
};

// Function to open specific project modal
function openProjectModal(event, category) {
    event.preventDefault();
    document.getElementById(`${category}ProjectModal`).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Add event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all project items
    document.querySelectorAll('.project-item[data-project]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            showProjectDetails(projectId);
        });
    });

    // Close buttons for all modals
    document.querySelectorAll('.close-modal, .close-details').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Show project details
function showProjectDetails(projectId) {
    const project = projectsData[projectId];
    const detailsModal = document.getElementById('projectDetailsModal');
    const detailsContent = document.getElementById('projectDetails');
    
    detailsContent.innerHTML = `
        <div class="project-details-header">
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
            ${project.demoLink && project.demoLink !== '#' ? `
                <a href="${project.demoLink}" target="_blank" rel="noopener noreferrer" 
                   class="project-link-btn demo-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
            ` : ''}
        </div>
    `;
    
    document.getElementById('detailsTitle').textContent = project.title;
    detailsModal.style.display = 'block';
}
