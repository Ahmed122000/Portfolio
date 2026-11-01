// ============================
// CUSTOM CURSOR
// ============================
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';

    // Handle hover state
    const hoverTarget = e.target.closest(
        'a, button, .skill-card, .project-card, .course-card, .contact-card, #project-dialog'
    );

    ring.classList.toggle('hovering', Boolean(hoverTarget));
});

// Animate the cursor ring
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(animateCursor);
}

animateCursor();

// ============================
// PARTICLE CANVAS
// ============================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const NUM_PARTICLES = 80;

class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '99,179,237' : '246,173,85';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -10) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99,179,237,${0.06 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================
// 3D TILT EFFECT
// ============================
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease, border-color 0.3s, box-shadow 0.3s';
    });
});

// ============================
// SCROLL REVEAL
// ============================



const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });


const revealEls = document.querySelectorAll(
    '.skill-card, .course-card, .contact-card, .edu-card, .about-grid, .stat-box'
);

revealEls.forEach(el => el.classList.add('reveal'));
revealEls.forEach(el => observer.observe(el));

// ============================
// SKILL BAR ANIMATION TRIGGER
// ============================
const skillBars = document.querySelectorAll('.skill-fill');
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
skillBars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
    barObserver.observe(bar);
});

// ============================
// BACK TO TOP VISIBILITY
// ============================
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
});

// ============================
// MOBILE NAV HAMBURGER
// ============================
const hamburger = document.getElementById('hamburger');
const navBar = document.querySelector('.nav-bar');
hamburger.addEventListener('click', () => {
    navBar.classList.toggle('open');
    hamburger.classList.toggle('open');
});
// Close on link click
navBar.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navBar.classList.remove('open');
    });
});

// ============================
// ACTIVE NAV HIGHLIGHT
// ============================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-bar a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--accent)';
        }
    });
});

// ============================
// TYPING EFFECT for hero subtitle
// ============================
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    const original = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    setTimeout(() => {
        const type = setInterval(() => {
            subtitle.textContent += original[i];
            i++;
            if (i >= original.length) clearInterval(type);
        }, 35);
    }, 700);
}


//=======================
// GENERATE PROJECTS
//=======================

function initializeProjectEffects() {
    const projectCards = document.querySelectorAll(
        '#featured-project-grid .project-card, #other-project-grid .project-card'
    );
    // Tilt effect
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;

            const rotX = ((y - cy) / cy) * -8;
            const rotY = ((x - cx) / cx) * 8;

            card.style.transform =
                `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform =
                'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition =
                'transform 0.1s ease, border-color 0.3s, box-shadow 0.3s';
        });
    });

    // Reveal animation
    projectCards.forEach(card => {
        card.classList.add('reveal');
        observer.observe(card);
    });

    // Custom cursor
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        card.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
}


function initializeProjectFilters(projects) {
    const filterContainer = document.getElementById('project-filters');

    // Get unique categories from projects
    const categories = [
        'All',
        ...new Set(projects.map(project => project.category).filter(Boolean))
    ];

    const projectCards = document.querySelectorAll(
        '#featured-project-grid .project-card, #other-project-grid .project-card'
    );

    categories.forEach(category => {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'project-filter';
        button.textContent = category;

        if (category === 'All') {
            button.classList.add('active');
        }

        button.setAttribute('aria-pressed', category === 'All');

        button.addEventListener('click', () => {

            // Filter projects in BOTH sections
            projectCards.forEach(card => {
                const matches =
                    category === 'All' ||
                    card.dataset.category === category;

                card.hidden = !matches;
            });

            // Update active filter button
            filterContainer.querySelectorAll('button').forEach(btn => {
                const isActive = btn === button;

                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);
            });
        });

        filterContainer.appendChild(button);
    });
}

// ============================
// PROJECT DETAILS DIALOG
// ============================

function setupProjectDialog() {
    const dialog = document.getElementById('project-dialog');
    const closeButton = dialog.querySelector('.dialog-close');

    // Close using the X button
    closeButton.addEventListener('click', () => {
        dialog.close();
    });

    // Close when clicking outside the dialog content
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    // Restore custom cursor when dialog closes
    dialog.addEventListener('close', () => {
        document.body.append(dot, ring);
    });
}


function showProjectDetails(project) {
    const dialog = document.getElementById('project-dialog');

    // Fill project information
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-problem').textContent = project.problem;
    document.getElementById('dialog-solution').textContent = project.solution;

    // Populate technical highlights
    const highlightsList = document.getElementById('dialog-highlights');
    highlightsList.replaceChildren();

    project.technicalHighlights.forEach(highlight => {
        const item = document.createElement('li');
        item.textContent = highlight;
        highlightsList.appendChild(item);
    });

    // Populate technologies
    const technologiesList = document.getElementById('dialog-technologies');
    technologiesList.replaceChildren();

    project.technologies.forEach(technology => {
        const item = document.createElement('li');
        item.textContent = technology;
        technologiesList.appendChild(item);
    });

    // Set GitHub link
    const githubLink = document.getElementById('dialog-github');
    githubLink.href = project.github;

    // Move custom cursor inside the modal
    dialog.append(dot, ring);

    // Open dialog
    dialog.showModal();
}


async function loadProjects() {
    const featuredGrid = document.getElementById("featured-project-grid");
    const otherGrid = document.getElementById("other-project-grid");
    
    try {
        const response = await fetch("data/projects.json");

        if (!response.ok) {
            throw new Error("Failed to load projects");
        }

        const projects = await response.json();

        projects.forEach(project => {
            const card = document.createElement("div");
            card.className = "project-card tilt-card";
            card.dataset.category = project.category;

            // Project image
            const imageWrap = document.createElement("div");
            imageWrap.className = "project-img-wrap";

            const image = document.createElement("img");
            image.src = project.image;
            image.alt = project.title;
            image.loading = "lazy";

            // GitHub overlay
            const overlay = document.createElement("div");
            overlay.className = "project-overlay";

            const githubLink = document.createElement("a");
            githubLink.href = project.github;
            githubLink.target = "_blank";
            githubLink.rel = "noopener noreferrer";
            githubLink.className = "overlay-btn";
            
            const githubIcon = document.createElement("i");
            githubIcon.className = "fab fa-github";
            githubIcon.setAttribute("aria-hidden", "true");
            githubLink.append(githubIcon, document.createTextNode(" GitHub"));

            overlay.appendChild(githubLink);
            imageWrap.append(image, overlay);

            // Project information
            const body = document.createElement("div");
            body.className = "project-body";

            const title = document.createElement("h3");
            title.textContent = project.title;

            const description = document.createElement("p");
            description.textContent = project.description;

            // Technologies
            const techList = document.createElement("ul");
            techList.className = "tech-stack";

            project.technologies.forEach(technology => {
                const item = document.createElement("li");
                item.textContent = technology;
                techList.appendChild(item);
            });

            // View Details button
            const detailsButton = document.createElement('button');
            detailsButton.type = 'button';
            detailsButton.className = 'project-details-btn';
            detailsButton.textContent = 'View Details';

            detailsButton.addEventListener('click', () => {
                showProjectDetails(project);
            });

            body.append(title, description, techList, detailsButton);
            card.append(imageWrap, body);

            const targetGrid = project.featured ? featuredGrid : otherGrid;
            targetGrid.appendChild(card);
        });

        initializeProjectEffects();
        initializeProjectFilters(projects);

    } catch (error) {
        console.error("Error loading projects:", error);
    
        featuredGrid.textContent = "Unable to load projects.";
    }
}



document.addEventListener("DOMContentLoaded", () => {
    setupProjectDialog();
    loadProjects();
});