// ============================
// SHARED SETTINGS & ELEMENTS
// ============================

export const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

export const dot = document.querySelector('.cursor-dot');
export const ring = document.querySelector('.cursor-ring');


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

if (canvas && ctx) {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const NUM_PARTICLES = 80;

    class Particle {
        constructor() {
            this.reset(true);
        }

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

    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
    }

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

    if (!prefersReducedMotion && !document.hidden) {
        startParticleAnimation();
    }

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

export function addTiltEffect(card) {
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


// Apply tilt to elements already present in HTML
document.querySelectorAll('.tilt-card').forEach(addTiltEffect);


// ============================
// SCROLL REVEAL
// ============================

export const observer = new IntersectionObserver((entries) => {
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
// IMAGE ERROR HANDLER
// ============================

export function handleImageError(image, title) {
    image.addEventListener('error', () => {
        image.classList.add('image-error');
        image.alt = `${title} image is unavailable`;
        console.warn(`Failed to load image: ${image.src}`);
    }, { once: true });
}