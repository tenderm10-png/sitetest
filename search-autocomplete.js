// Компонент автодоповнення для пошуку товарів
class SearchAutocomplete {
    constructor(searchInputId, options = {}) {
        this.searchInput = document.getElementById(searchInputId);
        this.options = {
            minLength: 2,
            maxResults: 5,
            debounceDelay: 300,
            ...options
        };
        
        this.autocompleteContainer = null;
        this.selectedIndex = -1;
        this.results = [];
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        this.createAutocompleteContainer();
        this.bindEvents();
    }
    
    createAutocompleteContainer() {
        // Створюємо контейнер для підказок
        this.autocompleteContainer = document.createElement('div');
        this.autocompleteContainer.className = 'search-autocomplete';
        this.autocompleteContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border: 2px solid #ffd700;
            border-top: none;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            z-index: 1000;
            max-height: 400px;
            overflow-y: auto;
            display: none;
            backdrop-filter: blur(10px);
            margin-top: -2px;
        `;
        
        // Додаємо контейнер після поля пошуку
        this.searchInput.parentNode.style.position = 'relative';
        this.searchInput.parentNode.appendChild(this.autocompleteContainer);
    }
    
    bindEvents() {
        // Обробка введення тексту
        this.searchInput.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        // Обробка клавіш
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // Приховування при кліку поза контейнером
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && 
                !this.autocompleteContainer.contains(e.target)) {
                this.hide();
            }
        });
        
        // Обробка фокусу
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.length >= this.options.minLength) {
                this.handleInput(this.searchInput.value);
            }
        });
    }
    
    handleInput(query) {
        // Очищуємо попередній таймер
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        // Встановлюємо новий таймер для debounce
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, this.options.debounceDelay);
    }
    
    performSearch(query) {
        if (query.length < this.options.minLength) {
            this.hide();
            return;
        }
        
        // Виконуємо пошук
        const results = searchProducts(query);
        this.results = results.slice(0, this.options.maxResults);
        
        if (this.results.length > 0) {
            this.show();
            this.renderResults();
        } else {
            this.hide();
        }
    }
    
    renderResults() {
        const resultsHTML = this.results.map((product, index) => `
            <div class="autocomplete-item ${index === this.selectedIndex ? 'selected' : ''}" 
                 data-index="${index}" 
                 data-product-id="${product.id}">
                <div class="autocomplete-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="autocomplete-content">
                    <div class="autocomplete-header">
                        <div class="autocomplete-name">${this.highlightMatch(product.name, this.searchInput.value)}</div>
                        <div class="autocomplete-rating">
                            <span class="stars">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</span>
                        </div>
                    </div>
                    <div class="autocomplete-category">${this.getCategoryName(product.category)}</div>
                    <div class="autocomplete-price">${product.price.toLocaleString('uk-UA')} ₴</div>
                </div>
            </div>
        `).join('');
        
        this.autocompleteContainer.innerHTML = resultsHTML;
        
        // Додаємо обробники подій для елементів
        this.autocompleteContainer.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.selectResult(index);
            });
            
            item.addEventListener('mouseenter', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.selectedIndex = index;
                this.updateSelection();
            });
        });
        
        // Додаємо стилі якщо їх ще немає
        this.addStyles();
    }
    
    addStyles() {
        if (document.getElementById('autocomplete-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'autocomplete-styles';
        style.textContent = `
            .search-autocomplete {
                scrollbar-width: thin;
                scrollbar-color: #ffd700 #2d2d2d;
            }
            
            .search-autocomplete::-webkit-scrollbar {
                width: 6px;
            }
            
            .search-autocomplete::-webkit-scrollbar-track {
                background: #2d2d2d;
            }
            
            .search-autocomplete::-webkit-scrollbar-thumb {
                background: #ffd700;
                border-radius: 3px;
            }
            
            .autocomplete-item {
                display: flex;
                align-items: flex-start;
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 1px solid rgba(255, 215, 0, 0.1);
                position: relative;
                background: linear-gradient(135deg, rgba(45, 45, 45, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%);
            }
            
            .autocomplete-item:last-child {
                border-bottom: none;
                border-radius: 0 0 10px 10px;
            }
            
            .autocomplete-item:first-child {
                border-radius: 10px 10px 0 0;
            }
            
            .autocomplete-item:hover,
            .autocomplete-item.selected {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%);
                transform: translateX(6px);
                box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);
            }
            
            .autocomplete-image {
                width: 60px;
                height: 60px;
                margin-right: 16px;
                border-radius: 10px;
                overflow: hidden;
                flex-shrink: 0;
                border: 2px solid rgba(255, 215, 0, 0.3);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .autocomplete-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .autocomplete-item:hover .autocomplete-image img {
                transform: scale(1.05);
            }
            
            .autocomplete-content {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            
            .autocomplete-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 12px;
            }
            
            .autocomplete-name {
                color: #ffd700;
                font-weight: 700;
                font-size: 1rem;
                line-height: 1.2;
                flex: 1;
                min-width: 0;
            }
            
            .autocomplete-category {
                color: #aaa;
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 500;
                margin-top: 2px;
            }
            
            .autocomplete-price {
                color: #ffd700;
                font-weight: 800;
                font-size: 1.1rem;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .autocomplete-rating {
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .autocomplete-rating .stars {
                color: #ffd700;
                font-size: 0.9rem;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.3));
            }
            
            .highlight {
                background: rgba(255, 215, 0, 0.3);
                color: #ffd700;
                font-weight: 700;
                padding: 1px 2px;
                border-radius: 2px;
            }
            
            /* Анімація появи */
            .search-autocomplete.show {
                animation: slideDown 0.3s ease-out;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Адаптивність */
            @media (max-width: 768px) {
                .autocomplete-item {
                    padding: 12px;
                }
                
                .autocomplete-image {
                    width: 50px;
                    height: 50px;
                    margin-right: 12px;
                }
                
                .autocomplete-name {
                    font-size: 0.9rem;
                }
                
                .autocomplete-category {
                    font-size: 0.7rem;
                }
                
                .autocomplete-price {
                    font-size: 1rem;
                }
                
                .autocomplete-rating .stars {
                    font-size: 0.8rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    handleKeydown(e) {
        if (!this.isVisible()) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.results.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectResult(this.selectedIndex);
                } else {
                    // Якщо нічого не вибрано, виконуємо звичайний пошук
                    this.performNormalSearch();
                }
                break;
                
            case 'Escape':
                this.hide();
                break;
        }
    }
    
    updateSelection() {
        const items = this.autocompleteContainer.querySelectorAll('.autocomplete-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
    }
    
    selectResult(index) {
        if (index >= 0 && index < this.results.length) {
            const product = this.results[index];
            
            // Переходимо на сторінку результатів пошуку з конкретним товаром
            const searchUrl = `search-results.html?q=${encodeURIComponent(product.name)}`;
            window.location.href = searchUrl;
        }
    }
    
    performNormalSearch() {
        const query = this.searchInput.value.trim();
        if (query.length >= this.options.minLength) {
            const searchUrl = `search-results.html?q=${encodeURIComponent(query)}`;
            window.location.href = searchUrl;
        }
    }
    
    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    getCategoryName(category) {
        const categoryNames = {
            'interior-doors': 'Міжкімнатні двері',
            'entrance-doors': 'Вхідні двері',
            'windows': 'Вікна',
            'sliding-doors': 'Розсувні двері'
        };
        return categoryNames[category] || category;
    }
    
    show() {
        this.autocompleteContainer.style.display = 'block';
        this.autocompleteContainer.classList.add('show');
        this.selectedIndex = -1;
    }
    
    hide() {
        this.autocompleteContainer.style.display = 'none';
        this.autocompleteContainer.classList.remove('show');
        this.selectedIndex = -1;
    }
    
    isVisible() {
        return this.autocompleteContainer.style.display === 'block';
    }
    
    destroy() {
        if (this.autocompleteContainer) {
            this.autocompleteContainer.remove();
        }
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
}

// Експорт для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchAutocomplete;
}
