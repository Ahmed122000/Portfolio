
import {
    dot,
    ring,
    observer,
    addTiltEffect,
    handleImageError
} from './effects.js';

// ============================
// PROJECT EFFECTS
// ============================

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

    if (ring) {
        // Custom cursor
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => ring.classList.add('hovering'));
            card.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        });
    }
}


// ============================
// PROJECT FILTERS
// ============================

function initializeProjectFilters(projects) {
    const filterContainer = document.getElementById('project-filters');

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

export function setupProjectDialog() {
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


// ============================
// LOAD PROJECTS
// ============================

export async function loadProjects() {
    const featuredGrid = document.getElementById('featured-project-grid');
    const otherGrid = document.getElementById('other-project-grid');

    try {
        const response = await fetch('data/projects.json');

        if (!response.ok) {
            throw new Error('Failed to load projects');
        }

        const projects = await response.json();

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card tilt-card';
            card.dataset.category = project.category;

            // Project image
            const imageWrap = document.createElement('div');
            imageWrap.className = 'project-img-wrap';

            const image = document.createElement('img');
            image.src = project.image;
            image.alt = project.title;
            image.loading = 'lazy';
            handleImageError(image, project.title);

            // GitHub overlay
            const overlay = document.createElement('div');
            overlay.className = 'project-overlay';

            const githubLink = document.createElement('a');
            githubLink.href = project.github;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.className = 'overlay-btn';

            const githubIcon = document.createElement('i');
            githubIcon.className = 'fab fa-github';
            githubIcon.setAttribute('aria-hidden', 'true');
            githubLink.append(githubIcon, document.createTextNode(' GitHub'));

            overlay.appendChild(githubLink);
            imageWrap.append(image, overlay);

            // Project information
            const body = document.createElement('div');
            body.className = 'project-body';

            const title = document.createElement('h3');
            title.textContent = project.title;

            const description = document.createElement('p');
            description.textContent = project.description;

            // Technologies
            const techList = document.createElement('ul');
            techList.className = 'tech-stack';

            project.technologies.forEach(technology => {
                const item = document.createElement('li');
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
        console.error('Error loading projects:', error);
        featuredGrid.textContent = 'Unable to load projects.';
    }
}
