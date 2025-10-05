// Catalog functionality
class CatalogManager {
    constructor() {
        this.products = document.querySelectorAll('.product-card');
        this.filters = {
            category: [],
            material: [],
            color: '',
            priceRange: { min: 20000, max: 120000 }
        };
        this.sortType = 'popular';
        this.currentView = 'grid';
        
        // Пагінація видалена - показуємо всі товари
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initSearch();
        // this.initFilters(); // Фільтри тимчасово приховані
        // this.initPriceRange(); // Фільтри тимчасово приховані
        this.initSorting();
        this.initViewToggle();
    }

    bindEvents() {
        // Category filters - тимчасово приховані
        /*
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleFilterChange());
        });
        
        // Material filters - тимчасово приховані
        document.querySelectorAll('.material-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleFilterChange());
        });

        // Color filters - тимчасово приховані
        document.querySelectorAll('.color-option').forEach(color => {
            color.addEventListener('click', (e) => this.handleColorChange(e));
        });

        // Reset button - тимчасово приховані
        document.querySelector('.filter-reset').addEventListener('click', () => this.resetFilters());
        */

        // Quick view buttons
        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => this.showQuickView(e));
        });

        // Кнопки "Купувати" теперь обрабатываются через onclick="openOrderForm(this)"
    }

    initSearch() {
        const searchInput = document.getElementById('catalog-search');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            this.performSearch(query);
        });
    }

    initFilters() {
        this.updateFilterState(false); // Не застосовуємо фільтри при ініціалізації
        // Застосовуємо початкові фільтри після ініціалізації
        setTimeout(() => {
            this.updateFilterState(true);
        }, 100);
    }

    initPriceRange() {
        const minSlider = document.getElementById('price-min');
        const maxSlider = document.getElementById('price-max');
        const priceDisplay = document.getElementById('price-current');

        const updatePriceDisplay = () => {
            const min = parseInt(minSlider.value);
            const max = parseInt(maxSlider.value);
            
            this.filters.priceRange.min = min;
            this.filters.priceRange.max = max;
            
            priceDisplay.textContent = `${min.toLocaleString('uk-UA')} - ${max.toLocaleString('uk-UA')} ₴`;
            this.applyFilters();
        };

        minSlider.addEventListener('input', updatePriceDisplay);
        maxSlider.addEventListener('input', updatePriceDisplay);
    }

    initSorting() {
        const sortSelect = document.getElementById('sort');
        
        sortSelect.addEventListener('change', (e) => {
            this.sortType = e.target.value;
            this.applySorting();
        });
    }

    initViewToggle() {
        const toggleBtn = document.getElementById('view-toggle');
        const gridIcon = toggleBtn.querySelector('.grid-view-icon');
        const listIcon = toggleBtn.querySelector('.list-view-icon');

        toggleBtn.addEventListener('click', () => {
            this.currentView = this.currentView === 'grid' ? 'list' : 'grid';
            
            // Update visual state
            const grid = document.getElementById('products-grid');
            if (this.currentView === 'list') {
                grid.classList.add('list-view');
                listIcon.style.color = '#2563eb';
                gridIcon.style.color = '#6b7280';
            } else {
                grid.classList.remove('list-view');
                gridIcon.style.color = '#2563eb';
                listIcon.style.color = '#6b7280';
            }
            
            toggleBtn.classList.toggle('active', this.currentView === 'list');
        });
    }

    showAllProducts() {
        // Показуємо всі товари при завантаженні сторінки
        this.products.forEach(product => {
            product.style.display = 'block';
        });
    }

    handleFilterChange() {
        this.updateFilterState();
        this.applyFilters();
    }

    handleColorChange(e) {
        // Remove active class from all colors
        document.querySelectorAll('.color-option').forEach(color => {
            color.classList.remove('active');
        });
        
        // Add active class to clicked color
        e.target.classList.add('active');
        
        // Update filter
        this.filters.color = e.target.dataset.color;
        this.applyFilters();
    }

    updateFilterState(applyFilters = true) {
        // Update category filters
        this.filters.category = [];
        document.querySelectorAll('.category-filter input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                this.filters.category.push(checkbox.value);
            }
        });

        // Update material filters
        this.filters.material = [];
        document.querySelectorAll('.material-filter input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                this.filters.material.push(checkbox.value);
            }
        });
        
        // Apply filters only if requested
        if (applyFilters) {
            this.applyFilters();
        }
    }

    performSearch(query) {
        // Використовуємо функцію пошуку з бази даних
        const searchResults = searchProducts(query);
        const resultIds = searchResults.map(product => product.id);
        
        this.products.forEach(product => {
            const productId = parseInt(product.dataset.productId) || 0;
            const isMatch = query === '' || resultIds.includes(productId);
            
            if (isMatch) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        
        this.updateProductCount();
    }

    applyFilters() {
        this.products.forEach(product => {
            let showProduct = true;
            
            // Category filter
            if (this.filters.category.length > 0) {
                const productCategory = product.dataset.category;
                if (!this.filters.category.includes(productCategory)) {
                    showProduct = false;
                }
            }
            
            // Material filter
            if (this.filters.material.length > 0) {
                const productMaterial = product.dataset.material;
                if (!this.filters.material.includes(productMaterial)) {
                    showProduct = false;
                }
            }
            
            // Color filter
            if (this.filters.color && this.filters.color !== '') {
                const productColor = product.dataset.color;
                if (productColor !== this.filters.color) {
                    showProduct = false;
                }
            }
            
            // Price filter
            const productPrice = parseInt(product.dataset.price);
            if (productPrice < this.filters.priceRange.min || productPrice > this.filters.priceRange.max) {
                showProduct = false;
            }
            
            // Apply visibility
            product.style.display = showProduct ? 'block' : 'none';
            
            // Add animation for visible products
            if (showProduct) {
                product.style.opacity = '0';
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transition = 'opacity 0.3s ease';
                }, 0);
            }
        });
        
        this.applySorting();
        this.updateProductCount();
    }

    applySorting() {
        const grid = document.getElementById('products-grid');
        const visibleProducts = Array.from(this.products).filter(p => 
            p.style.display !== 'none'
        );
        
        // Sort based on current sort type
        visibleProducts.sort((a, b) => {
            switch (this.sortType) {
                case 'price-low':
                    return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                case 'price-high':
                    return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                case 'name':
                    const nameA = a.querySelector('.product-name').textContent;
                    const nameB = b.querySelector('.product-name').textContent;
                    return nameA.localeCompare(nameB, 'uk');
                case 'newest':
                    // Simulate sorting by new products (those with "Новинка" badge)
                    const aIsNew = a.querySelector('.product-badge:not(.sale):not([style*="display: none"])') !== null;
                    const bIsNew = b.querySelector('.product-badge:not(.sale):not([style*="display: none"])') !== null;
                    if (aIsNew && !bIsNew) return -1;
                    if (!aIsNew && bIsNew) return 1;
                    return 0;
                case 'popular':
                default:
                    // Sort by rating (simulated)
                    const ratingA = a.querySelector('.rating-count').textContent.match(/\d+/)[0];
                    const ratingB = b.querySelector('.rating-count').textContent.match(/\d+/)[0];
                    return parseInt(ratingB) - parseInt(ratingA);
            }
        });
        
        // Reorder products in DOM
        visibleProducts.forEach(product => {
            grid.appendChild(product);
        });
    }

    updateProductCount() {
        const visibleCount = Array.from(this.products).filter(p => 
            p.style.display !== 'none'
        ).length;
        
        // Оновлюємо лічильник товарів, якщо елемент існує
        const productsCountElement = document.getElementById('products-count');
        if (productsCountElement) {
            productsCountElement.textContent = `${visibleCount} товарів знайдено`;
        }
    }

    resetFilters() {
        // Reset checkboxes
        document.querySelectorAll('.category-filter input[type="checkbox"], .material-filter input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset color selection
        document.querySelectorAll('.color-option').forEach(color => {
            color.classList.remove('active');
        });
        
        // Reset price range
        const minSlider = document.getElementById('price-min');
        const maxSlider = document.getElementById('price-max');
        minSlider.value = 20000;
        maxSlider.value = 120000;
        
        // Reset filters object
        this.filters = {
            category: [],
            material: [],
            color: '',
            priceRange: { min: 20000, max: 120000 }
        };
        
        // Reset price display
        document.getElementById('price-current').textContent = '20 000 - 120 000 ₴';
        
        // Clear search
        document.getElementById('catalog-search').value = '';
        
        // Show all products
        this.products.forEach(product => {
            product.style.display = 'block';
        });
        
        this.updateProductCount();
    }

    showQuickView(e) {
        e.stopPropagation();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        const productImage = productCard.querySelector('.product-image img').src;
        
        // Create modal
        this.createQuickViewModal({
            name: productName,
            price: productPrice,
            image: productImage
        });
    }

    createQuickViewModal(product) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <div class="modal-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="modal-info">
                            <h2>${product.name}</h2>
                            <div class="modal-price">${product.price}</div>
                            <div class="modal-features">
                                <h3>Особливості:</h3>
                                <ul>
                                    <li>Високоякісні матеріали</li>
                                    <li>Сучасний дизайн</li>
                                    <li>Легке встановлення</li>
                                    <li>Гарантія 2 роки</li>
                                </ul>
                            </div>
                            <div class="modal-actions">
                                <button class="btn-primary modal-buy-now">Купити зараз</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
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
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border-radius: 16px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalSlideIn 0.3s ease-out;
            border: 2px solid #ffd700;
            box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
        `;
        
        document.body.appendChild(modal);
        
        // Handle close events
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                document.body.removeChild(modal);
            }
        });
        
        // Handle buy now button - close modal and open order form
        modal.querySelector('.modal-buy-now').addEventListener('click', () => {
            // Close the quick view modal
            document.body.removeChild(modal);
            
            // Create a temporary product card element to pass to openOrderForm
            const tempProductCard = document.createElement('div');
            tempProductCard.className = 'product-card';
            tempProductCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${product.price}</div>
                </div>
            `;
            
            // Create a temporary button element and attach it to the product card
            const tempButton = document.createElement('button');
            tempButton.className = 'buy-now-btn';
            tempProductCard.appendChild(tempButton);
            
            // Call openOrderForm with the temporary button
            openOrderForm(tempButton);
        });
        
        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        // Add CSS animation if not exists
        if (!document.querySelector('#modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .modal-body {
                    display: flex;
                    gap: 30px;
                    padding: 40px;
                }
                
                .modal-image {
                    flex: 1;
                }
                
                .modal-image img {
                    width: 100%;
                    border-radius: 12px;
                    border: 2px solid #ffd700;
                }
                
                .modal-info {
                    flex: 1;
                    padding-left: 20px;
                }
                
                .modal-info h2 {
                    font-size: 1.8rem;
                    margin-bottom: 16px;
                    color: #ffd700;
                    font-weight: 700;
                }
                
                .modal-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #ffed4e;
                    margin-bottom: 24px;
                }
                
                .modal-features h3 {
                    font-size: 1.2rem;
                    margin-bottom: 12px;
                    color: #ffd700;
                    font-weight: 600;
                }
                
                .modal-features ul {
                    list-style: none;
                    padding: 0;
                }
                
                .modal-features li {
                    padding: 8px 0;
                    border-bottom: 1px solid #444;
                    color: #e5e5e5;
                }
                
                .modal-actions {
                    display: flex;
                    margin-top: 30px;
                }
                
                .btn-primary {
                    padding: 14px 28px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                    color: #1a1a1a;
                    border: none;
                    width: 100%;
                    font-size: 1rem;
                }
                
                .btn-primary:hover {
                    background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
                }
                
                .modal-close {
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
                
                .modal-close:hover {
                    color: #ffd700;
                }
                
                @media (max-width: 768px) {
                    .modal-body {
                        flex-direction: column;
                        padding: 20px;
                    }
                    
                    .modal-info {
                        padding-left: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Функция удалена - теперь используется openOrderForm() из script.js

    showNotification(message, type = 'info') {
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Handle broken images for catalog
function handleCatalogImageError(img) {
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.catalogManager = new CatalogManager();
    
    // Add error handlers for all catalog images
    const catalogImages = document.querySelectorAll('.product-card img, .product-image img');
    catalogImages.forEach(img => {
        img.addEventListener('error', () => handleCatalogImageError(img));
    });
    
    // Показуємо всі товари при завантаженні
    setTimeout(() => {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            product.style.display = 'block';
        });
    }, 100);
    
    // Ініціалізуємо автодоповнення для каталогу
    if (document.getElementById('catalog-search')) {
        window.catalogSearchAutocomplete = new SearchAutocomplete('catalog-search', {
            minLength: 2,
            maxResults: 5,
            debounceDelay: 300
        });
    }
    
    // Add notification styles
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

// Глобальна функція для пошуку з каталогу
function performCatalogSearch() {
    const searchInput = document.getElementById('catalog-search');
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

// Order Form Functions
function openOrderForm(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    
    // Fill modal with product data
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').textContent = productPrice;
    document.getElementById('modalProductImage').src = productImage;
    document.getElementById('modalProductImage').alt = productName;
    
    // Set summary prices
    document.getElementById('summaryProductPrice').textContent = productPrice;
    document.getElementById('summaryTotalPrice').textContent = productPrice;
    
    // Show modal
    document.getElementById('orderModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize delivery options
    initializeDeliveryOptions();
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('orderForm').reset();
    document.getElementById('addressSection').style.display = 'none';
    document.getElementById('summaryDeliveryPrice').textContent = 'Безкоштовно';
}

function initializeDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    const addressSection = document.getElementById('addressSection');
    
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'pickup') {
                addressSection.style.display = 'none';
                document.getElementById('summaryDeliveryPrice').textContent = 'Безкоштовно';
            } else {
                addressSection.style.display = 'block';
                let deliveryPrice = '';
                switch(this.value) {
                    case 'courier':
                        deliveryPrice = '200 ₴';
                        break;
                    case 'post':
                        deliveryPrice = '150 ₴';
                        break;
                    case 'ukrpost':
                        deliveryPrice = '80 ₴';
                        break;
                }
                document.getElementById('summaryDeliveryPrice').textContent = deliveryPrice;
            }
            
            updateTotalPrice();
        });
    });
}

function updateTotalPrice() {
    const productPriceText = document.getElementById('summaryProductPrice').textContent;
    const deliveryPriceText = document.getElementById('summaryDeliveryPrice').textContent;
    
    // Extract numeric values
    const productPrice = parseInt(productPriceText.replace(/[^\d]/g, '')) || 0;
    let deliveryPrice = 0;
    
    if (deliveryPriceText !== 'Безкоштовно') {
        deliveryPrice = parseInt(deliveryPriceText.replace(/[^\d]/g, '')) || 0;
    }
    
    const totalPrice = productPrice + deliveryPrice;
    const formattedTotal = totalPrice.toLocaleString('uk-UA') + ' ₴';
    
    document.getElementById('summaryTotalPrice').textContent = formattedTotal;
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const orderData = {
                productName: document.getElementById('modalProductName').textContent,
                productPrice: document.getElementById('modalProductPrice').textContent,
                customerName: formData.get('customerName'),
                customerPhone: formData.get('customerPhone'),
                customerEmail: formData.get('customerEmail'),
                delivery: formData.get('delivery'),
                deliveryAddress: formData.get('deliveryAddress'),
                payment: formData.get('payment'),
                orderComment: formData.get('orderComment'),
                totalPrice: document.getElementById('summaryTotalPrice').textContent
            };
            
            // Validate required fields
            if (!orderData.customerName || !orderData.customerPhone) {
                alert('Будь ласка, заповніть обов\'язкові поля');
                return;
            }
            
            if (orderData.delivery !== 'pickup' && !orderData.deliveryAddress) {
                alert('Будь ласка, введіть адресу доставки');
                return;
            }
            
            // Show success message
            showOrderSuccess(orderData);
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('orderModal');
            if (modal && modal.style.display === 'flex') {
                closeOrderModal();
            }
        }
    });
    
    // Close modal on backdrop click
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('orderModal');
        if (e.target === modal) {
            closeOrderModal();
        }
    });
});

    function showOrderSuccess(orderData) {
        closeOrderModal();
        
        // Save order to localStorage for admin panel
        saveOrderToAdmin(orderData);
        
        // Create success modal
        const successModal = document.createElement('div');
        successModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            backdrop-filter: blur(5px);
        `;
        
        successModal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
                border-radius: 20px;
                border: 2px solid #ffd700;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
            ">
                <div style="
                    color: #ffd700;
                    font-size: 4rem;
                    margin-bottom: 20px;
                ">✓</div>
                <h2 style="
                    color: #ffd700;
                    font-size: 1.8rem;
                    margin-bottom: 20px;
                    font-weight: 700;
                ">Замовлення оформлено!</h2>
                <p style="
                    color: #e5e5e5;
                    font-size: 1.1rem;
                    margin-bottom: 30px;
                    line-height: 1.6;
                ">Дякуємо за ваше замовлення!<br>Ми зв'яжемося з вами найближчим часом для підтвердження деталей.</p>
                <div style="
                    background: linear-gradient(135deg, #333 0%, #2d2d2d 100%);
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 30px;
                    border: 1px solid #444;
                ">
                    <p style="color: #e5e5e5; margin-bottom: 10px;"><strong>Товар:</strong> ${orderData.productName}</p>
                    <p style="color: #e5e5e5; margin-bottom: 10px;"><strong>Загальна сума:</strong> ${orderData.totalPrice}</p>
                    <p style="color: #e5e5e5;"><strong>Спосіб доставки:</strong> ${getDeliveryMethodName(orderData.delivery)}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" style="
                    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                    color: #1a1a1a;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(255, 215, 0, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(255, 215, 0, 0.3)'">
                    Зрозуміло
                </button>
            </div>
        `;
        
        document.body.appendChild(successModal);
        document.body.style.overflow = 'hidden';
        
        // Auto close after 10 seconds
        setTimeout(() => {
            if (successModal.parentElement) {
                successModal.remove();
                document.body.style.overflow = 'auto';
            }
        }, 10000);
    }

    // Save order to admin panel
    function saveOrderToAdmin(orderData) {
        // Get existing orders
        const existingOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        
        // Create new order object
        const newOrder = {
            id: Date.now(), // Unique ID
            orderNumber: `#${String(existingOrders.length + 1001).padStart(4, '0')}`,
            productName: orderData.productName,
            productPrice: orderData.productPrice,
            totalPrice: orderData.totalPrice,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerEmail: orderData.customerEmail || '',
            delivery: orderData.delivery,
            deliveryAddress: orderData.deliveryAddress || '',
            payment: orderData.payment,
            orderComment: orderData.orderComment || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to orders array
        existingOrders.unshift(newOrder); // Add to beginning
        
        // Save back to localStorage
        localStorage.setItem('adminOrders', JSON.stringify(existingOrders));
        
        console.log('Order saved to admin panel:', newOrder);
    }

function getDeliveryMethodName(value) {
    switch(value) {
        case 'pickup': return 'Самовивіз';
        case 'courier': return 'Кур\'єром';
        case 'post': return 'Нова Пошта';
        case 'ukrpost': return 'Укрпошта';
        default: return 'Не вказано';
    }
}

// Функція для додавання нового товару в каталог
function addProductToCatalog(productData) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // Створюємо новий елемент товару
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.productId = productData.id || Date.now();
    productCard.dataset.category = productData.category || 'doors';
    productCard.dataset.material = productData.material || 'wood';
    productCard.dataset.color = productData.color || 'brown';
    productCard.dataset.price = productData.price || '50000';
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${productData.image || 'https://via.placeholder.com/300x400/F5F5DC/8B4513?text=Новий+товар'}" 
                 alt="${productData.name || 'Новий товар'}" 
                 loading="lazy">
            <div class="product-badges">
                <span class="product-badge new">Новинка</span>
            </div>
            <div class="product-actions-overlay">
                <button class="quick-view" title="Швидкий перегляд">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${productData.name || 'Новий товар'}</h3>
            <div class="product-rating">
                <div class="stars">
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star">★</span>
                </div>
                <span class="rating-count">(12 відгуків)</span>
            </div>
            <div class="product-features">
                ${(productData.features || ['Високоякісні матеріали', 'Сучасний дизайн']).map(feature => 
                    `<span class="feature">${feature}</span>`
                ).join('')}
            </div>
            <div class="product-footer">
                <div class="product-price">${(productData.price || 50000).toLocaleString('uk-UA')} ₴</div>
                <button class="buy-now-btn" onclick="openOrderForm(this)">Купувати</button>
            </div>
        </div>
    `;
    
    // Додаємо товар в сітку
    productsGrid.appendChild(productCard);
    
    // Додаємо анімацію появи
    productCard.style.opacity = '0';
    productCard.style.transform = 'translateY(20px)';
    productCard.style.transition = 'all 0.5s ease';
    
    setTimeout(() => {
        productCard.style.opacity = '1';
        productCard.style.transform = 'translateY(0)';
    }, 100);
    
    // Оновлюємо лічильник товарів
    const catalogManager = window.catalogManager;
    if (catalogManager) {
        catalogManager.updateProductCount();
    }
    
    return productCard;
}

// Приклад використання функції додавання товару
function addSampleProduct() {
    const newProduct = {
        id: Date.now(),
        name: 'Двері міжкімнатні PREMIUM',
        price: 95000,
        image: 'https://via.placeholder.com/300x400/F5F5DC/8B4513?text=PREMIUM',
        category: 'doors',
        material: 'wood',
        color: 'brown',
        features: ['Преміум матеріали', 'Покращена звукоізоляція', 'Елегантний дизайн']
    };
    
    addProductToCatalog(newProduct);
}
