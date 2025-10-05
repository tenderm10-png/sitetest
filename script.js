// Carousel functionality
class ProductCarousel {
    constructor() {
        this.container = document.querySelector('.products-container');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        this.currentIndex = 0;
        this.itemWidth = 280 + 30; // width + gap
        this.maxIndex = Math.max(0, Math.floor(this.container.scrollWidth / this.itemWidth) - 1);
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateButtons();
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.container.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
        });

        this.container.addEventListener('touchend', () => {
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Check if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex;
        }
        this.scrollToSlide();
    }

    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.scrollToSlide();
    }

    scrollToSlide() {
        const scrollLeft = this.currentIndex * this.itemWidth;
        this.container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        this.updateButtons();
    }

    updateButtons() {
        // Update button states if needed
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
    }
}

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
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Глобальна функція для пошуку (викликається з HTML)
function performSearch() {
    const searchInput = document.getElementById('main-search');
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
    const animateElements = document.querySelectorAll('.product-item, .category-card, .section-title');
    animateElements.forEach(el => observer.observe(el));
}

// Add CSS for animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .product-item, .category-card, .section-title {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .product-item.animate-in, .category-card.animate-in, .section-title.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (prefers-reduced-motion: reduce) {
            .product-item, .category-card, .section-title {
                transition: none;
                opacity: 1;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Modal for product details
function initProductModals() {
    const detailButtons = document.querySelectorAll('.details-btn');
    
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productItem = btn.closest('.product-item');
            const productTitle = productItem.querySelector('h3').textContent;
            const productPrice = productItem.querySelector('.price').textContent;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'product-modal';
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <button class="modal-close">&times;</button>
                        <h3>${productTitle}</h3>
                        <div class="modal-price">${productPrice}</div>
                        <div class="modal-description">
                            <h4>Опис товару:</h4>
                            <ul>
                                <li>Висока якість матеріалів</li>
                                <li>Сучасний дизайн</li>
                                <li>Легке встановлення</li>
                                <li>Гарантія 2 роки</li>
                                <li>Екологічно чисті матеріали</li>
                            </ul>
                        </div>
                        <div class="modal-actions">
                            <button class="btn-primary">Замовити</button>
                            <button class="btn-secondary">Закрити</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal styles
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;
            
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.cssText = `
                background: white;
                padding: 40px;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            `;
            
            document.body.appendChild(modal);
            
            // Close modal events
            modal.querySelector('.modal-close').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
                if (e.target === modal.querySelector('.modal-overlay')) {
                    document.body.removeChild(modal);
                }
            });
            
            // Esc key to close
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(modal);
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        });
    });
}

// Handle broken images
function handleImageError(img) {
    img.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
    img.style.display = 'flex';
    img.style.alignItems = 'center';
    img.style.justifyContent = 'center';
    img.style.color = '#1a1a1a';
    img.style.fontSize = '0.8rem';
    img.style.fontWeight = '600';
    img.style.borderRadius = '8px';
    img.alt = 'Фото товару';
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZDcwMCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWExYTFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+0KTQvtGC0L7QvSDQvtC00L7RgNC+0YHRjDwvdGV4dD48L3N2Zz4=';
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    new ProductCarousel();
    initSmoothScrolling();
    initSearch();
    initScrollAnimations();
    initProductModals();
    
    // Add error handlers for all product images
    const productImages = document.querySelectorAll('.product-image img, .product-item img');
    productImages.forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
    
    // Ініціалізуємо автодоповнення для головної сторінки
    if (document.getElementById('main-search')) {
        window.mainSearchAutocomplete = new SearchAutocomplete('main-search', {
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
    
    // Add notification animation styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyles);
});

// Функция открытия формы заказа
function openOrderForm(button) {
    const productItem = button.closest('.product-item, .product-card');
    
    // Получаем данные о товаре
    const productName = productItem.querySelector('h3, .product-name').textContent;
    const productPrice = productItem.querySelector('.price, .product-price').textContent;
    const productImage = productItem.querySelector('.product-image img').src;
    const productId = productItem.dataset.productId || Date.now().toString();
    
    // Создаем модальное окно с формой заказа
    createOrderModal({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage
    });
}

// Создание модального окна с формой заказа
function createOrderModal(product) {
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h2>Замовлення товару</h2>
                </div>
                <div class="modal-body">
                    <div class="product-summary">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <div class="product-price">${product.price}</div>
                        </div>
                    </div>
                    
                    <form class="order-form" id="quickOrderForm">
                        <div class="form-section">
                            <h4>Контактні дані</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="clientName">Ім'я *</label>
                                    <input type="text" id="clientName" name="clientName" required>
                                </div>
                                <div class="form-group">
                                    <label for="clientPhone">Телефон *</label>
                                    <input type="tel" id="clientPhone" name="clientPhone" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="clientEmail">Email</label>
                                <input type="email" id="clientEmail" name="clientEmail">
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4>Спосіб отримання</h4>
                            <div class="delivery-methods">
                                <div class="delivery-option" data-method="pickup">
                                    <div class="delivery-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                            <circle cx="12" cy="10" r="3"/>
                                        </svg>
                                    </div>
                                    <div class="delivery-info">
                                        <h5>Самовивіз з магазину</h5>
                                        <p>Безкоштовно • 1-2 дні</p>
                                    </div>
                                    <div class="delivery-radio">
                                        <input type="radio" name="deliveryMethod" value="pickup" id="pickup">
                                        <label for="pickup"></label>
                                    </div>
                                </div>
                                
                                <div class="delivery-option" data-method="delivery">
                                    <div class="delivery-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="1" y="3" width="15" height="13"/>
                                            <polygon points="16,8 20,8 23,11 23,16 16,16"/>
                                            <circle cx="5.5" cy="18.5" r="2.5"/>
                                            <circle cx="18.5" cy="18.5" r="2.5"/>
                                        </svg>
                                    </div>
                                    <div class="delivery-info">
                                        <h5>Доставка кур'єром</h5>
                                        <p>200 ₴ • 2-3 дні</p>
                                    </div>
                                    <div class="delivery-radio">
                                        <input type="radio" name="deliveryMethod" value="delivery" id="delivery">
                                        <label for="delivery"></label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group" id="addressGroup" style="display: none;">
                                <label for="deliveryAddress">Адреса доставки *</label>
                                <textarea id="deliveryAddress" name="deliveryAddress" rows="3" placeholder="Введіть повну адресу доставки..."></textarea>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4>Додаткова інформація</h4>
                            <div class="form-group">
                                <label for="orderComments">Коментарі до замовлення</label>
                                <textarea id="orderComments" name="orderComments" rows="3" placeholder="Додаткові побажання..."></textarea>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeOrderModal()">Скасувати</button>
                            <button type="submit" class="btn-primary">Замовити</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем стили
    addOrderModalStyles();
    
    document.body.appendChild(modal);
    
    // Обработчики событий
    setupOrderModalEvents(modal, product);
}

// Настройка событий модального окна
function setupOrderModalEvents(modal, product) {
    // Закрытие модального окна
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            document.body.removeChild(modal);
        }
    });
    
    // ESC для закрытия
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // Обработка выбора способа доставки
    const deliveryOptions = modal.querySelectorAll('.delivery-option');
    const addressGroup = modal.querySelector('#addressGroup');
    
    deliveryOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Убираем активный класс со всех опций
            deliveryOptions.forEach(opt => opt.classList.remove('active'));
            
            // Добавляем активный класс к выбранной опции
            option.classList.add('active');
            
            // Устанавливаем значение радио-кнопки
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Показываем/скрываем поле адреса
            if (radio.value === 'delivery') {
                addressGroup.style.display = 'block';
                modal.querySelector('#deliveryAddress').required = true;
            } else {
                addressGroup.style.display = 'none';
                modal.querySelector('#deliveryAddress').required = false;
            }
        });
        
        // Обработка клика по радио-кнопке
        const radio = option.querySelector('input[type="radio"]');
        radio.addEventListener('change', () => {
            if (radio.checked) {
                deliveryOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                if (radio.value === 'delivery') {
                    addressGroup.style.display = 'block';
                    modal.querySelector('#deliveryAddress').required = true;
                } else {
                    addressGroup.style.display = 'none';
                    modal.querySelector('#deliveryAddress').required = false;
                }
            }
        });
    });
    
    // Обработка отправки формы
    const form = modal.querySelector('#quickOrderForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitQuickOrder(form, product);
    });
    
    // Форматирование телефона
    const phoneInput = modal.querySelector('#clientPhone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.startsWith('380')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+38' + value;
            } else if (!value.startsWith('+')) {
                value = '+380' + value;
            }
        }
        e.target.value = value;
    });
}

// Отправка быстрого заказа
function submitQuickOrder(form, product) {
    const formData = new FormData(form);
    const orderData = {
        product: product,
        client: {
            name: formData.get('clientName'),
            phone: formData.get('clientPhone'),
            email: formData.get('clientEmail')
        },
        delivery: {
            method: formData.get('deliveryMethod'),
            address: formData.get('deliveryAddress')
        },
        comments: formData.get('orderComments'),
        orderDate: new Date().toISOString(),
        orderNumber: 'ORD-' + Date.now()
    };
    
    // Отправляем заказ в админку
    addOrderToAdmin(orderData);
    
    // Показываем уведомление об успешном заказе
    showOrderConfirmation(orderData);
    
    // Закрываем модальное окно
    const modal = form.closest('.order-modal');
    document.body.removeChild(modal);
}

// Показ подтверждения заказа
function showOrderConfirmation(orderData) {
    const confirmation = document.createElement('div');
    confirmation.className = 'order-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <div class="confirmation-icon">✅</div>
            <h3>Замовлення прийнято!</h3>
            <div class="confirmation-details">
                <p><strong>Номер замовлення:</strong> ${orderData.orderNumber}</p>
                <p><strong>Товар:</strong> ${orderData.product.name}</p>
                <p><strong>Ціна:</strong> ${orderData.product.price}</p>
                <p><strong>Клієнт:</strong> ${orderData.client.name}</p>
                <p><strong>Телефон:</strong> ${orderData.client.phone}</p>
            </div>
            <div class="confirmation-message">
                <p>Наш менеджер зв'яжеться з вами протягом 30 хвилин для підтвердження замовлення.</p>
            </div>
            <button class="btn-primary" onclick="this.closest('.order-confirmation').remove()">Зрозуміло</button>
        </div>
    `;
    
    // Добавляем стили для подтверждения
    confirmation.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    const content = confirmation.querySelector('.confirmation-content');
    content.style.cssText = `
        background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
        border-radius: 16px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        border: 2px solid #ffd700;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
        text-align: center;
        color: #e5e5e5;
    `;
    
    document.body.appendChild(confirmation);
    
    // Автоматическое закрытие через 10 секунд
    setTimeout(() => {
        if (document.body.contains(confirmation)) {
            document.body.removeChild(confirmation);
        }
    }, 10000);
}

// Добавление стилей для модального окна заказа
function addOrderModalStyles() {
    if (document.querySelector('#order-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'order-modal-styles';
    style.textContent = `
        .order-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .order-modal .modal-content {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            border: 2px solid #ffd700;
            box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
            animation: slideInUp 0.3s ease-out;
        }
        
        .order-modal .modal-header {
            padding: 30px 30px 20px;
            border-bottom: 2px solid #ffd700;
            text-align: center;
        }
        
        .order-modal .modal-header h2 {
            color: #ffd700;
            font-size: 1.8rem;
            margin: 0;
        }
        
        .order-modal .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            color: #e5e5e5;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .order-modal .modal-close:hover {
            color: #ffd700;
        }
        
        .order-modal .modal-body {
            padding: 30px;
        }
        
        .product-summary {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 12px;
            border: 1px solid #ffd700;
        }
        
        .product-summary .product-image {
            width: 100px;
            height: 100px;
            border-radius: 8px;
            overflow: hidden;
            border: 2px solid #ffd700;
        }
        
        .product-summary .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .product-summary .product-info {
            flex: 1;
        }
        
        .product-summary h3 {
            color: #ffd700;
            font-size: 1.2rem;
            margin-bottom: 10px;
        }
        
        .product-summary .product-price {
            color: #ffed4e;
            font-size: 1.3rem;
            font-weight: 700;
        }
        
        .order-form .form-section {
            margin-bottom: 30px;
        }
        
        .order-form .form-section h4 {
            color: #ffd700;
            font-size: 1.2rem;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ffd700;
        }
        
        .delivery-methods {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .delivery-option {
            display: flex;
            align-items: center;
            padding: 20px;
            border: 2px solid #ffd700;
            border-radius: 12px;
            background: rgba(255, 215, 0, 0.05);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .delivery-option::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
            transition: left 0.5s ease;
        }
        
        .delivery-option:hover::before {
            left: 100%;
        }
        
        .delivery-option:hover {
            border-color: #ffed4e;
            background: rgba(255, 215, 0, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
        }
        
        .delivery-option.active {
            border-color: #ffed4e;
            background: rgba(255, 215, 0, 0.15);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        
        .delivery-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 50%;
            margin-right: 20px;
            transition: all 0.3s ease;
        }
        
        .delivery-option.active .delivery-icon {
            background: rgba(255, 215, 0, 0.2);
            transform: scale(1.1);
        }
        
        .delivery-icon svg {
            color: #ffd700;
            transition: all 0.3s ease;
        }
        
        .delivery-option.active .delivery-icon svg {
            color: #ffed4e;
            transform: rotate(5deg);
        }
        
        .delivery-info {
            flex: 1;
        }
        
        .delivery-info h5 {
            color: #ffd700;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 5px 0;
            transition: color 0.3s ease;
        }
        
        .delivery-option.active .delivery-info h5 {
            color: #ffed4e;
        }
        
        .delivery-info p {
            color: #e5e5e5;
            font-size: 0.9rem;
            margin: 0;
            opacity: 0.8;
        }
        
        .delivery-radio {
            position: relative;
        }
        
        .delivery-radio input[type="radio"] {
            position: absolute;
            opacity: 0;
            cursor: pointer;
        }
        
        .delivery-radio label {
            width: 24px;
            height: 24px;
            border: 2px solid #ffd700;
            border-radius: 50%;
            display: block;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .delivery-radio label::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 12px;
            height: 12px;
            background: #ffd700;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            transition: transform 0.3s ease;
        }
        
        .delivery-radio input[type="radio"]:checked + label {
            border-color: #ffed4e;
            background: rgba(255, 215, 0, 0.1);
        }
        
        .delivery-radio input[type="radio"]:checked + label::after {
            transform: translate(-50%, -50%) scale(1);
        }
        
        .delivery-option.active .delivery-radio label {
            border-color: #ffed4e;
            background: rgba(255, 215, 0, 0.1);
        }
        
        .delivery-option.active .delivery-radio label::after {
            transform: translate(-50%, -50%) scale(1);
        }
        
        .order-form .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .order-form .form-group {
            margin-bottom: 20px;
        }
        
        .order-form label {
            display: block;
            font-weight: 600;
            color: #ffd700;
            margin-bottom: 8px;
        }
        
        .order-form input,
        .order-form select,
        .order-form textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #ffd700;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            background: #1a1a1a;
            color: #e5e5e5;
        }
        
        .order-form input:focus,
        .order-form select:focus,
        .order-form textarea:focus {
            outline: none;
            border-color: #ffed4e;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }
        
        .order-form input::placeholder,
        .order-form textarea::placeholder {
            color: #888;
        }
        
        .order-form .form-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-top: 30px;
        }
        
        .order-form .btn-primary,
        .order-form .btn-secondary {
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
        }
        
        .order-form .btn-primary {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #1a1a1a;
        }
        
        .order-form .btn-primary:hover {
            background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
            transform: translateY(-2px);
        }
        
        .order-form .btn-secondary {
            background: transparent;
            color: #6b7280;
            border: 2px solid #6b7280;
        }
        
        .order-form .btn-secondary:hover {
            border-color: #9ca3af;
            color: #9ca3af;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .order-modal .modal-content {
                width: 95%;
                margin: 20px;
            }
            
            .order-modal .modal-body {
                padding: 20px;
            }
            
            .product-summary {
                flex-direction: column;
                text-align: center;
            }
            
            .order-form .form-row {
                grid-template-columns: 1fr;
            }
            
            .order-form .form-actions {
                flex-direction: column;
            }
            
            .delivery-option {
                padding: 15px;
            }
            
            .delivery-icon {
                width: 40px;
                height: 40px;
                margin-right: 15px;
            }
            
            .delivery-info h5 {
                font-size: 1rem;
            }
            
            .delivery-info p {
                font-size: 0.85rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Функция добавления заказа в админку
function addOrderToAdmin(orderData) {
    // Если админка загружена, добавляем заказ напрямую
    if (typeof adminPanel !== 'undefined') {
        adminPanel.addOrder(orderData);
    } else {
        // Если админка не загружена, сохраняем в localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = {
            id: 'ORD-' + Date.now(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        orders.unshift(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// Закрытие модального окна заказа
function closeOrderModal() {
    const modal = document.querySelector('.order-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#22c55e' : '#2563eb'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility function to handle responsive behavior
function handleResize() {
    const carousel = window.productCarousel;
    if (carousel) {
        carousel.maxIndex = Math.max(0, Math.floor(carousel.container.scrollWidth / carousel.itemWidth) - 1);
        carousel.updateButtons();
    }
}

window.addEventListener('resize', handleResize);

