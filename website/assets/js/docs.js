// RedBoxVM Documentation - JavaScript

class DocsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMermaid();
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupScrollSpy();
        this.setupCodeCopy();
        this.setupSearch();
        this.setupResponsive();
    }

    // Initialize Mermaid diagrams
    setupMermaid() {
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
                startOnLoad: true,
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                },
                sequence: {
                    diagramMarginX: 50,
                    diagramMarginY: 10,
                    actorMargin: 50,
                    width: 150,
                    height: 65,
                    boxMargin: 10,
                    boxTextMargin: 5,
                    noteMargin: 10,
                    messageMargin: 35,
                    mirrorActors: true,
                    bottomMarginAdj: 1,
                    useMaxWidth: true,
                    rightAngles: false,
                    showSequenceNumbers: false
                },
                gantt: {
                    titleTopMargin: 25,
                    barHeight: 20,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    fontWeight: 'normal',
                    gridLineStartPadding: 35,
                    bottomPadding: 5,
                    leftPadding: 75,
                    topPadding: 50,
                    rightPadding: 25
                }
            });

            // Re-render diagrams when theme changes
            document.addEventListener('themeChanged', () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default';
                mermaid.initialize({ theme: newTheme });
                
                // Re-render all mermaid diagrams
                const diagrams = document.querySelectorAll('.mermaid');
                diagrams.forEach((diagram, index) => {
                    const graphDefinition = diagram.textContent;
                    diagram.innerHTML = '';
                    diagram.removeAttribute('data-processed');
                    mermaid.render(`mermaid-${index}`, graphDefinition, (svgCode) => {
                        diagram.innerHTML = svgCode;
                    });
                });
            });
        }
    }

    // Setup navigation functionality
    setupNavigation() {
        const navLinks = document.querySelectorAll('.docs-nav-link');
        const currentPath = window.location.pathname;

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            }

            link.addEventListener('click', (e) => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
            });
        });

        // Mobile navigation toggle
        const sidebar = document.querySelector('.docs-sidebar');
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'docs-mobile-toggle';
        toggleBtn.innerHTML = '☰ Navigation';
        toggleBtn.style.cssText = `
            display: none;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: var(--primary-gradient);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
        `;

        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }

    // Setup theme toggle functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (!themeToggle) return;

        // Get saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        this.setTheme(currentTheme);
        this.updateThemeIcon(currentTheme, sunIcon, moonIcon);

        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(currentTheme);
            this.updateThemeIcon(currentTheme, sunIcon, moonIcon);
            localStorage.setItem('theme', currentTheme);
            
            // Dispatch custom event for mermaid re-rendering
            document.dispatchEvent(new CustomEvent('themeChanged'));
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
    }

    updateThemeIcon(theme, sunIcon, moonIcon) {
        if (theme === 'dark') {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    }

    // Setup scroll spy for navigation
    setupScrollSpy() {
        const headings = document.querySelectorAll('.docs-content h2, .docs-content h3');
        const navLinks = document.querySelectorAll('.docs-nav-link');

        if (headings.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    if (id) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                }
            });
        }, {
            rootMargin: '-20% 0px -80% 0px'
        });

        headings.forEach(heading => {
            if (!heading.id) {
                heading.id = heading.textContent.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
            }
            observer.observe(heading);
        });
    }

    // Setup code copy functionality
    setupCodeCopy() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            const pre = block.parentElement;
            const button = document.createElement('button');
            button.className = 'copy-code-btn';
            button.innerHTML = '📋 Copy';
            button.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.75rem;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
            `;

            pre.style.position = 'relative';
            pre.appendChild(button);

            pre.addEventListener('mouseenter', () => {
                button.style.opacity = '1';
            });

            pre.addEventListener('mouseleave', () => {
                button.style.opacity = '0';
            });

            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    button.innerHTML = '✅ Copied!';
                    setTimeout(() => {
                        button.innerHTML = '📋 Copy';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                    button.innerHTML = '❌ Failed';
                    setTimeout(() => {
                        button.innerHTML = '📋 Copy';
                    }, 2000);
                }
            });
        });
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('docs-search');
        if (!searchInput) return;

        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchResults.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;

        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(searchResults);

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query, searchResults);
            }, 300);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.parentElement.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    performSearch(query, resultsContainer) {
        const content = document.querySelector('.docs-content');
        const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = content.querySelectorAll('p');
        
        const results = [];
        const queryLower = query.toLowerCase();

        // Search in headings
        headings.forEach(heading => {
            if (heading.textContent.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'heading',
                    text: heading.textContent,
                    element: heading
                });
            }
        });

        // Search in paragraphs
        paragraphs.forEach(paragraph => {
            if (paragraph.textContent.toLowerCase().includes(queryLower)) {
                const text = paragraph.textContent;
                const index = text.toLowerCase().indexOf(queryLower);
                const snippet = text.substring(Math.max(0, index - 50), index + 100);
                
                results.push({
                    type: 'content',
                    text: snippet,
                    element: paragraph
                });
            }
        });

        this.displaySearchResults(results, resultsContainer, query);
    }

    displaySearchResults(results, container, query) {
        if (results.length === 0) {
            container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted);">No results found</div>';
        } else {
            container.innerHTML = results.slice(0, 5).map(result => `
                <div class="search-result-item" style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); cursor: pointer;">
                    <div style="font-weight: 600; color: var(--text-primary);">${result.type === 'heading' ? '📋' : '📄'} ${this.highlightText(result.text, query)}</div>
                </div>
            `).join('');

            // Add click handlers
            container.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    results[index].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    container.style.display = 'none';
                });
            });
        }

        container.style.display = 'block';
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: var(--primary-color); color: white; padding: 2px 4px; border-radius: 2px;">$1</mark>');
    }

    // Setup responsive behavior
    setupResponsive() {
        const sidebar = document.querySelector('.docs-sidebar');
        const toggleBtn = document.querySelector('.docs-mobile-toggle');

        const handleResize = () => {
            if (window.innerWidth <= 768) {
                if (toggleBtn) toggleBtn.style.display = 'block';
                sidebar.style.cssText += `
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 280px;
                    height: 100vh;
                    z-index: 999;
                    transition: left 0.3s ease;
                    overflow-y: auto;
                `;
            } else {
                if (toggleBtn) toggleBtn.style.display = 'none';
                sidebar.classList.remove('mobile-open');
                sidebar.style.cssText = '';
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Mobile sidebar styles
        const style = document.createElement('style');
        style.textContent = `
            .docs-sidebar.mobile-open {
                left: 0 !important;
            }
            
            @media (max-width: 768px) {
                .docs-sidebar.mobile-open::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: -1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize documentation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DocsManager();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});