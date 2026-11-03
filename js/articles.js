
import { observer, addTiltEffect } from './effects.js';


export async function loadArticles() {
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

            // Scroll reveal and tilt effect
            observer.observe(card);
            addTiltEffect(card);
        });

    } catch (error) {
        console.error('Error loading articles:', error);
        container.textContent = 'Unable to load articles.';
    }
}
