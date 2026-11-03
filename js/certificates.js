
import {
    dot,
    ring,
    observer,
    addTiltEffect,
    handleImageError
} from './effects.js';


export function setupCertificateDialog() {
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

    // Basic information
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
    const skillsSection = document.getElementById(
        'certificate-skills-section'
    );
    const skillsList = document.getElementById(
        'certificate-dialog-skills'
    );

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
    const projectsSection = document.getElementById(
        'certificate-projects-section'
    );
    const projectsContainer = document.getElementById(
        'certificate-dialog-projects'
    );

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
    const linksContainer = document.getElementById(
        'certificate-dialog-links'
    );

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


export async function loadCertificates() {
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
            handleImageError(image, certificate.title);

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
            body.append(provider, title, description);

            if (links.children.length > 0) {
                body.appendChild(links);
            }

            card.append(image, body);
            container.appendChild(card);

            // Open details dialog
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute(
                'aria-label',
                `View details for ${certificate.title}`
            );

            card.addEventListener('click', () => {
                showCertificateDetails(certificate);
            });

            // Keyboard interaction
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    showCertificateDetails(certificate);
                }
            });

            // Prevent external links from opening the dialog
            links.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', event => {
                    event.stopPropagation();
                });
            });

            // Reveal animation and tilt effect
            observer.observe(card);
            addTiltEffect(card);
        });

    } catch (error) {
        console.error('Error loading certificates:', error);
        container.textContent = 'Unable to load certificates.';
    }
}
