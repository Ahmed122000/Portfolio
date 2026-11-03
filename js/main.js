
const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

// Keep these available to the other functions
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

// ============================
// CUSTOM CURSOR
// ============================

if (!prefersReducedMotion && dot && ring) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let cursorAnimationId = null;

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;

        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        if (
            Math.abs(mouseX - ringX) > 0.1 ||
            Math.abs(mouseY - ringY) > 0.1
        ) {
            cursorAnimationId = requestAnimationFrame(animateCursor);
        } else {
            cursorAnimationId = null;
        }
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';

        const hoverTarget = e.target.closest(
            'a, button, .skill-card, .project-card, .course-card, .contact-card, #project-dialog, #certificate-dialog'
        );

        ring.classList.toggle('hovering', Boolean(hoverTarget));

        if (cursorAnimationId === null) {
            cursorAnimationId = requestAnimationFrame(animateCursor);
        }
    });
}

// ============================
// PARTICLE CANVAS
// ============================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d');

if(canvas && ctx){
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


    let particleAnimationId = null;

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawLines();

        particleAnimationId = requestAnimationFrame(animateParticles);
    }

    function startParticleAnimation() {
        if (particleAnimationId !== null) return;
        animateParticles();
    }

    function stopParticleAnimation() {
        if (particleAnimationId === null) return;

        cancelAnimationFrame(particleAnimationId);
        particleAnimationId = null;
    }

    // Start when the page is visible
    if (!prefersReducedMotion && !document.hidden) {
        startParticleAnimation();
    }

    // Stop when the user switches tabs or minimizes the browser
    document.addEventListener('visibilitychange', () => {
        if (document.hidden || prefersReducedMotion) {
            stopParticleAnimation();
        } else {
            startParticleAnimation();
        }
    });
}
// ============================
// REUSABLE 3D TILT EFFECT
// ============================

function addTiltEffect(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * -10;
        const rotateY = ((x / rect.width) - 0.5) * 10;

        card.style.transform =
            `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform =
            'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
    });
}

// Apply to elements already present in HTML
document.querySelectorAll('.tilt-card').forEach(addTiltEffect);


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
// BACK TO TOP VISIBILITY
// ============================
const backToTop = document.querySelector('.back-to-top');

if(backToTop){
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    });
}
// ============================
// MOBILE NAV HAMBURGER
// ============================
const hamburger = document.getElementById('hamburger');
const navBar = document.querySelector('.nav-bar');

if(hamburger && navBar){
    hamburger.addEventListener('click', () => {
        const isOpen = navBar.classList.toggle('open');

        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu when a navigation link is clicked
    navBar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navBar.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

}
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

if(!prefersReducedMotion){
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
        addTiltEffect(card);
    });

    // Reveal animation
    projectCards.forEach(card => {
        card.classList.add('reveal');
        observer.observe(card);
    });

    if(ring){
        // Custom cursor
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => ring.classList.add('hovering'));
            card.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        });
    }
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


function handleImageError(image, title) {
    image.addEventListener('error', () => {
        image.classList.add('image-error');
        image.alt = `${title} image is unavailable`;
        console.warn(`Failed to load image: ${image.src}`);
    }, { once: true });
}


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

function setupCertificateDialog() {
    const dialog = document.getElementById('certificate-dialog');
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
    
    dialog.addEventListener('close', () => {
        document.body.append(dot, ring);
    });
}


function showCertificateDetails(certificate) {
    const dialog = document.getElementById('certificate-dialog');

    // Fill basic information
    document.getElementById('certificate-dialog-title').textContent =
        certificate.title;

    document.getElementById('certificate-dialog-provider').textContent =
        certificate.provider;

    document.getElementById('certificate-dialog-description').textContent =
        certificate.description;

        // Certificate image
    const imageSection = document.getElementById(
        'certificate-dialog-image-section'
    );
    const certificateImage = document.getElementById(
        'certificate-dialog-image'
    );

    if (certificate.image) {
        certificateImage.src = certificate.image;
        certificateImage.alt = `${certificate.title} certificate`;
        imageSection.hidden = false;

        certificateImage.onerror = () => {
            imageSection.hidden = true;
        };
    } else {
        certificateImage.removeAttribute('src');
        imageSection.hidden = true;
    }

    // Issue date
    const dateElement = document.getElementById(
        'certificate-dialog-date'
    );

    if (certificate.issueDate) {
        const date = new Date(`${certificate.issueDate}T00:00:00`);

        dateElement.textContent = `Issued on: ${date.toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        )}`;

        dateElement.hidden = false;
    } else {
        dateElement.textContent = '';
        dateElement.hidden = true;
    }
    // Skills section
    const skillsSection = document.getElementById('certificate-skills-section');
    const skillsList = document.getElementById('certificate-dialog-skills');

    skillsList.replaceChildren();

    if (certificate.skills?.length) {
        certificate.skills.forEach(skill => {
            const item = document.createElement('li');
            item.textContent = skill;
            skillsList.appendChild(item);
        });

        skillsSection.hidden = false;
    } else {
        skillsSection.hidden = true;
    }

    // Related projects section
    const projectsSection = document.getElementById('certificate-projects-section');
    const projectsContainer = document.getElementById('certificate-dialog-projects');

    projectsContainer.replaceChildren();

    if (certificate.relatedProjects?.length) {
        certificate.relatedProjects.forEach(project => {
            const item = document.createElement('p');
            item.textContent = project;
            projectsContainer.appendChild(item);
        });

        projectsSection.hidden = false;
    } else {
        projectsSection.hidden = true;
    }

    // Course and certificate links
    const linksContainer = document.getElementById('certificate-dialog-links');
    linksContainer.replaceChildren();

    if (certificate.courseUrl) {
        const courseLink = document.createElement('a');
        courseLink.href = certificate.courseUrl;
        courseLink.target = '_blank';
        courseLink.rel = 'noopener noreferrer';
        courseLink.className = 'btn-course';
        courseLink.textContent = 'Course';

        linksContainer.appendChild(courseLink);
    }

    if (certificate.certificateUrl) {
        const certificateLink = document.createElement('a');
        certificateLink.href = certificate.certificateUrl;
        certificateLink.target = '_blank';
        certificateLink.rel = 'noopener noreferrer';
        certificateLink.className = 'btn-course cert';
        certificateLink.textContent = 'Certificate';

        linksContainer.appendChild(certificateLink);
    }

    // Move custom cursor inside the modal
    dialog.append(dot, ring);
    dialog.showModal();
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


async function loadSkills() {
    const container = document.getElementById('skills-container');

    try {
        const response = await fetch('data/skills.json');

        if (!response.ok) {
            throw new Error('Failed to load skills');
        }

        const data = await response.json();

        data.categories.forEach(category => {
            // Category container
            const categoryElement = document.createElement('div');
            categoryElement.className = 'skills-category';

            // Category title
            const title = document.createElement('h3');
            title.className = 'cat-title';

            const categoryIcon = document.createElement('span');
            categoryIcon.className = 'cat-icon';
            categoryIcon.textContent = category.icon;

            title.append(categoryIcon, document.createTextNode(category.title));

            // Skills grid
            const grid = document.createElement('div');
            grid.className = 'skills-grid';

            category.skills.forEach(skill => {
                const card = document.createElement('div');
                card.className = 'skill-card tilt-card reveal';

                const icon = document.createElement('span');
                icon.className = 'skill-icon';

                if (skill.type === 'class') {
                    const iconElement = document.createElement('i');
                    iconElement.className = skill.icon;
                    iconElement.setAttribute('aria-hidden', 'true');
                    icon.appendChild(iconElement);
                } else {
                    icon.textContent = skill.icon;
                }

                const name = document.createElement('div');
                name.className = 'skill-name';
                name.textContent = skill.name;

                card.append(icon, name);
                grid.appendChild(card);

                // Apply effects to dynamically created cards
                observer.observe(card);

                addTiltEffect(card);
            });

            categoryElement.append(title, grid);
            container.appendChild(categoryElement);
        });

    } catch (error) {
        console.error('Error loading skills:', error);
        container.textContent = 'Unable to load skills right now.';
    }
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
            handleImageError(image, project.title)
 
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



// ============================
// LOAD ARTICLES
// ============================

async function loadArticles() {
    const container = document.getElementById('articles-grid');

    if (!container) return;

    try {
        const response = await fetch('data/articles.json');

        if (!response.ok) {
            throw new Error('Failed to load articles');
        }

        const data = await response.json();

        if (!Array.isArray(data.articles)) {
            throw new Error('Invalid articles data format');
        }

        if (data.articles.length === 0) {
            container.textContent = 'Articles coming soon.';
            return;
        }

        data.articles.forEach(article => {
            const card = document.createElement('article');
            card.className = 'article-card reveal';

            // Article image
            if (article.image) {
                const image = document.createElement('img');
                image.src = article.image;
                image.alt = article.title;
                image.loading = 'lazy';
                image.className = 'article-image';

                // Hide image if the file doesn't exist
                image.onerror = () => image.remove();

                card.appendChild(image);
            }

            // Publication date
            if (article.date) {
                const date = document.createElement('span');
                date.className = 'article-date';
                date.textContent = article.date;
                card.appendChild(date);
            }

            // Article title
            const title = document.createElement('h3');
            title.textContent = article.title;

            // Article description
            const description = document.createElement('p');
            description.textContent = article.description;

            card.append(title, description);

            // Article tags
            if (Array.isArray(article.tags) && article.tags.length > 0) {
                const tagsList = document.createElement('ul');
                tagsList.className = 'article-tags';

                article.tags.forEach(tag => {
                    const item = document.createElement('li');
                    item.textContent = tag;
                    tagsList.appendChild(item);
                });

                card.appendChild(tagsList);
            }

            // Read article link
            const link = document.createElement('a');
            link.className = 'article-link';
            link.href = article.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Read Article →';

            card.appendChild(link);
            container.appendChild(card);

            // Scroll reveal
            observer.observe(card);
            addTiltEffect(card);
        });

    } catch (error) {
        console.error('Error loading articles:', error);
        container.textContent = 'Unable to load articles.';
    }
}


async function loadCertificates() {
    const container = document.getElementById('certificates-grid');

    try {
        const response = await fetch('data/certificates.json');

        if (!response.ok) {
            throw new Error('Failed to load certificates');
        }

        const data = await response.json();

        data.certificates.forEach(certificate => {
            // Card
            const card = document.createElement('div');
            card.className = 'course-card tilt-card reveal';

            // Certificate image
            const image = document.createElement('img');
            image.src = certificate.image;
            image.alt = certificate.title;
            image.loading = 'lazy';
            handleImageError(image, certificate.title)

            // Card body
            const body = document.createElement('div');
            body.className = 'course-body';

            const provider = document.createElement('div');
            provider.className = 'course-provider';
            provider.textContent = certificate.provider;

            const title = document.createElement('h3');
            title.textContent = certificate.title;

            const description = document.createElement('p');
            description.textContent = certificate.description;

            // Links
            const links = document.createElement('div');
            links.className = 'course-links';

            if (certificate.courseUrl) {
                const courseLink = document.createElement('a');
                courseLink.href = certificate.courseUrl;
                courseLink.target = '_blank';
                courseLink.rel = 'noopener noreferrer';
                courseLink.className = 'btn-course';
                courseLink.textContent = 'Course';

                links.appendChild(courseLink);
            }

            if (certificate.certificateUrl) {
                const certificateLink = document.createElement('a');
                certificateLink.href = certificate.certificateUrl;
                certificateLink.target = '_blank';
                certificateLink.rel = 'noopener noreferrer';
                certificateLink.className = 'btn-course cert';
                certificateLink.textContent = 'Certificate';

                links.appendChild(certificateLink);
            }

            // Assemble card
            // Assemble card
            body.append(provider, title, description);

            if (links.children.length > 0) {
                body.appendChild(links);
            }

            card.append(image, body);
            container.appendChild(card);

            // Make the card open its details dialog
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `View details for ${certificate.title}`);

            card.addEventListener('click', () => {
                showCertificateDetails(certificate);
            });

            // Support keyboard interaction
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    showCertificateDetails(certificate);
                }
            });

            // Prevent clicking external links from opening the dialog
            links.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', event => {
                    event.stopPropagation();
                });
            });

            // Reveal animation
            observer.observe(card);

            addTiltEffect(card);
        });

    } catch (error) {
        console.error('Error loading certificates:', error);
        container.textContent = 'Unable to load certificates.';
    }
}



document.addEventListener("DOMContentLoaded", () => {
    setupProjectDialog();
    setupCertificateDialog();
    loadSkills();
    loadProjects();
    loadArticles();
    loadCertificates();
});