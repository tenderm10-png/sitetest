// Contact Page JavaScript functionality

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

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Відправляємо...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Ім\'я повинно містити мінімум 2 символи');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Введіть коректний email адрес');
    }
    
    if (!data.subject) {
        errors.push('Оберіть тему повідомлення');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Повідомлення повинно містити мінімум 10 символів');
    }
    
    if (!data.privacy) {
        errors.push('Необхідно погодитися з обробкою персональних даних');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="message-content">
            <div class="message-icon">✅</div>
            <h3>Повідомлення відправлено!</h3>
            <p>Дякуємо за звернення. Ми зв'яжемося з вами найближчим часом.</p>
            <button class="close-message">Закрити</button>
        </div>
    `;
    
    message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const messageContent = message.querySelector('.message-content');
    messageContent.style.cssText = `
        background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
        padding: 40px;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
        border: 2px solid #ffd700;
        color: #e5e5e5;
    `;
    
    // Style the icon
    const icon = message.querySelector('.message-icon');
    icon.style.cssText = `
        font-size: 3rem;
        margin-bottom: 20px;
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
    `;
    
    // Style the heading
    const heading = message.querySelector('h3');
    heading.style.cssText = `
        color: #ffd700;
        margin-bottom: 15px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    `;
    
    // Style the close button
    const closeBtn = message.querySelector('.close-message');
    closeBtn.style.cssText = `
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        color: #1a1a1a;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    // Close message events
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(message);
    });
    
    message.addEventListener('click', (e) => {
        if (e.target === message) {
            document.body.removeChild(message);
        }
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 5000);
}

function showErrorMessage(text) {
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <div class="message-content">
            <div class="message-icon">❌</div>
            <h3>Помилка валідації</h3>
            <p>${text}</p>
            <button class="close-message">Закрити</button>
        </div>
    `;
    
    message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const messageContent = message.querySelector('.message-content');
    messageContent.style.cssText = `
        background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
        padding: 40px;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
        border: 2px solid #ffd700;
        color: #e5e5e5;
    `;
    
    // Style the icon
    const icon = message.querySelector('.message-icon');
    icon.style.cssText = `
        font-size: 3rem;
        margin-bottom: 20px;
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
    `;
    
    // Style the heading
    const heading = message.querySelector('h3');
    heading.style.cssText = `
        color: #ffd700;
        margin-bottom: 15px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    `;
    
    // Style the close button
    const closeBtn = message.querySelector('.close-message');
    closeBtn.style.cssText = `
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        color: #1a1a1a;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    // Close message events
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(message);
    });
    
    message.addEventListener('click', (e) => {
        if (e.target === message) {
            document.body.removeChild(message);
        }
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Animation on scroll
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
    const animateElements = document.querySelectorAll('.contact-card, .contact-form, .faq-item');
    animateElements.forEach(el => observer.observe(el));
}

// Contact card interactions
function initContactCardInteractions() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add click effect
            card.style.transform = 'translateY(-8px) scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px) scale(1)';
            }, 150);
        });
    });
}

// Phone number formatting
function initPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.startsWith('380')) {
                    value = '+380 ' + value.slice(3);
                } else if (value.startsWith('0')) {
                    value = '+380 ' + value.slice(1);
                } else {
                    value = '+380 ' + value;
                }
            }
            
            e.target.value = value;
        });
    }
}

// Add CSS for animations and effects
function addContactPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .contact-card, .contact-form, .faq-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .contact-card.animate-in, .contact-form.animate-in, .faq-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .contact-card {
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .contact-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        .form-group input:invalid {
            border-color: #ef4444;
        }
        
        .form-group input:valid {
            border-color: #22c55e;
        }
        
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .contact-card, .contact-form, .faq-item {
                transition: none;
                opacity: 1;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Глобальна функція для пошуку зі сторінки контактів
function performContactSearch() {
    const searchInput = document.getElementById('contact-search');
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
    addContactPageStyles();
    initSmoothScrolling();
    initSearch();
    initContactForm();
    initFAQ();
    initScrollAnimations();
    initContactCardInteractions();
    initPhoneFormatting();
    
    // Ініціалізуємо автодоповнення для сторінки контактів
    if (document.getElementById('contact-search')) {
        window.contactSearchAutocomplete = new SearchAutocomplete('contact-search', {
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
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        if (item.classList.contains('active')) {
            // Recalculate height for active items
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        }
    });
});
