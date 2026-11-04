// ============================
// BACK TO TOP VISIBILITY
// ============================

function setupBackToTop() {
    const backToTop = document.querySelector('.back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }
}


// ============================
// MOBILE NAV HAMBURGER
// ============================

function setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navBar = document.querySelector('.nav-bar');

    if (hamburger && navBar) {
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
}


// ============================
// ACTIVE NAV HIGHLIGHT
// ============================

function setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-bar a');

    function updateActiveLink() {
        let current = '';

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${current}`;

            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    // Initialize immediately
    updateActiveLink();

    // Update while scrolling
    window.addEventListener('scroll', updateActiveLink, {
        passive: true
    });
}

// ============================
// HERO TYPING EFFECT
// ============================

function setupTypingEffect() {
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!prefersReducedMotion) {
        const subtitle = document.querySelector('.hero-subtitle');

        if (subtitle) {
            const original = subtitle.textContent;
            subtitle.textContent = '';

            let i = 0;

            setTimeout(() => {
                const type = setInterval(() => {
                    subtitle.textContent += original[i];
                    i++;

                    if (i >= original.length) {
                        clearInterval(type);
                    }
                }, 35);
            }, 700);
        }
    }
}


// ============================
// INITIALIZE NAVIGATION
// ============================

export function initializeNavigation() {
    setupBackToTop();
    setupMobileNavigation();
    setupActiveNavigation();
    setupTypingEffect();
}