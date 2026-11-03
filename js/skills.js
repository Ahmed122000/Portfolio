
import { observer, addTiltEffect } from './effects.js';

// ============================
// LOAD SKILLS
// ============================

export async function loadSkills() {
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
