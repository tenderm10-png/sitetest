// About Page JavaScript functionality

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            alert('Будь ласка, введіть мінімум 2 символи для пошуку');
            return;
        }
        
        // Redirect to catalog with search query
        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
    }
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Animation on scroll for about page elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.value-card, .team-member, .stat-item, .about-section');
    animateElements.forEach(el => observer.observe(el));
}

// Counter animation for statistics
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/\d/g, '');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Team member hover effects
function initTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', () => {
            member.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Value cards interaction
function initValueCardsInteraction() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(37, 99, 235, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for animations and effects
function addAboutPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .value-card, .team-member, .stat-item, .about-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .value-card.animate-in, .team-member.animate-in, .stat-item.animate-in, .about-section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .team-member {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .value-card {
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .value-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @media (prefers-reduced-motion: reduce) {
            .value-card, .team-member, .stat-item, .about-section {
                transition: none;
                opacity: 1;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect for hero section
function initParallaxEffect() {
    const heroSection = document.querySelector('.about-header');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Глобальна функція для пошуку зі сторінки "Про нас"
function performAboutSearch() {
    const searchInput = document.getElementById('about-search');
    if (searchInput) {
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            alert('Будь ласка, введіть мінімум 2 символи для пошуку');
            return;
        }
        
        // Використовуємо функцію пошуку з бази даних
        const results = searchProducts(query);
        
        if (results.length === 0) {
            alert(`За запитом "${query}" товари не знайдені.\n\nСпробуйте інші ключові слова або перевірте правильність написання.`);
            return;
        }
        
        // Переходимо на сторінку результатів пошуку
        const searchUrl = `search-results.html?q=${encodeURIComponent(query)}`;
        window.location.href = searchUrl;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addAboutPageStyles();
    initSmoothScrolling();
    initSearch();
    initScrollAnimations();
    initCounterAnimation();
    initTeamInteractions();
    initValueCardsInteraction();
    initParallaxEffect();
    
    // Ініціалізуємо автодоповнення для сторінки "Про нас"
    if (document.getElementById('about-search')) {
        window.aboutSearchAutocomplete = new SearchAutocomplete('about-search', {
            minLength: 2,
            maxResults: 5,
            debounceDelay: 300
        });
    }
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate animations if needed
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        if (!stat.classList.contains('animated')) {
            stat.classList.add('animated');
        }
    });
});

