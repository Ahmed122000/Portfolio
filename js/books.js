
import { observer, addTiltEffect } from './effects.js';


export async function loadBooks() {
    const container = document.getElementById('books-grid');

    if (!container) return;

    try {
        const response = await fetch('data/books.json');

        if (!response.ok) {
            throw new Error('Failed to load books');
        }

        const data = await response.json();

        if (!Array.isArray(data.books)) {
            throw new Error('Invalid books data format');
        }

        container.replaceChildren();

        if (data.books.length === 0) {
            container.textContent = 'No books added yet.';
            return;
        }

        data.books.forEach(book => {
            const card = document.createElement('article');
            card.className = 'book-card reveal';

            // Book cover
            if (book.cover) {
                const cover = document.createElement('img');
                cover.className = 'book-cover';
                cover.src = book.cover;
                cover.alt = `${book.title} cover`;
                cover.loading = 'lazy';

                cover.onerror = () => cover.remove();

                card.appendChild(cover);
            }

            // Book information
            const info = document.createElement('div');
            info.className = 'book-info';

            const title = document.createElement('h3');
            title.textContent = book.title;

            const author = document.createElement('p');
            author.className = 'book-author';
            author.textContent = Array.isArray(book.author)
                ? book.author.join(', ')
                : book.author || 'Unknown author';

            // Reading status
            const status = document.createElement('span');
            status.className = `book-status ${book.readingStatus}`;
            status.textContent = book.readingStatus.replace('-', ' ');

            info.append(title, author, status);

            // Book tags
            if (Array.isArray(book.tags) && book.tags.length > 0) {
                const tagsList = document.createElement('ul');
                tagsList.className = 'book-tags';

                book.tags.forEach(tag => {
                    const item = document.createElement('li');
                    item.textContent = tag;
                    tagsList.appendChild(item);
                });

                info.appendChild(tagsList);
            }

            card.appendChild(info);

            // Publisher link
            if (book.url) {
                const link = document.createElement('a');
                link.className = 'book-link';
                link.href = book.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = 'View Book →';

                card.appendChild(link);
            }

            // Store reading status for filtering
            card.dataset.status = book.readingStatus;

            container.appendChild(card);

            observer.observe(card);
            addTiltEffect(card);
        });

        // Reading status filters
        const filters = document.querySelectorAll('.book-filter');

        filters.forEach(button => {
            button.addEventListener('click', () => {
                const selectedFilter = button.dataset.filter;

                // Update active filter
                filters.forEach(filter => {
                    filter.classList.toggle('active', filter === button);
                });

                // Show matching books
                container.querySelectorAll('.book-card').forEach(card => {
                    const matches =
                        selectedFilter === 'all' ||
                        card.dataset.status === selectedFilter;

                    card.hidden = !matches;
                });
            });
        });

    } catch (error) {
        console.error('Error loading books:', error);
        container.textContent = 'Unable to load books.';
    }
}
