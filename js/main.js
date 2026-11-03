import { initializeNavigation } from './navigation.js';
import { loadSkills } from './skills.js';
import { loadProjects, setupProjectDialog } from './projects.js';
import { loadCertificates, setupCertificateDialog } from './certificates.js';
import { loadArticles } from './articles.js';
import { loadBooks } from './books.js';

document.addEventListener("DOMContentLoaded", () => {
    
    initializeNavigation();
    
    setupProjectDialog();
    setupCertificateDialog();
    
    
    loadSkills();
    loadProjects();
    loadArticles();
    loadBooks();
    loadCertificates();
});