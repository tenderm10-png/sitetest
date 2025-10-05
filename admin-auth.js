// Simple Admin Authentication
class AdminAuth {
    constructor() {
        // Admin credentials (hardcoded for security)
        this.adminCredentials = {
            username: 'admin_dvery_2024',
            password: 'Dv3ry@dm1n#S3cur3!'
        };
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
    }

    // Check if admin is already authenticated
    checkAuth() {
        const authStatus = sessionStorage.getItem('adminAuth');
        if (authStatus === 'true') {
            this.isAuthenticated = true;
            this.showAdminContent();
        } else {
            this.showLoginForm();
        }
    }

    // Show login form
    showLoginForm() {
        const adminContent = document.querySelector('.admin-dashboard');
        if (adminContent) {
            adminContent.innerHTML = `
                <div class="admin-login-container">
                    <div class="admin-login-form">
                        <div class="login-header">
                            <h2>🔐 Вхід в адмін панель</h2>
                            <p>Введіть дані для доступу</p>
                        </div>
                        <form id="adminLoginForm">
                            <div class="form-group">
                                <label for="adminUsername">Логін:</label>
                                <input type="text" id="adminUsername" name="username" required 
                                       placeholder="Введіть логін" autocomplete="username">
                            </div>
                            <div class="form-group">
                                <label for="adminPassword">Пароль:</label>
                                <input type="password" id="adminPassword" name="password" required 
                                       placeholder="Введіть пароль" autocomplete="current-password">
                            </div>
                            <button type="submit" class="admin-login-btn">Увійти</button>
                        </form>
                        <div class="login-footer">
                            <p><a href="index.html">← Повернутися на сайт</a></p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Show admin content
    showAdminContent() {
        // Restore original admin content
        const adminContent = document.querySelector('.admin-dashboard');
        if (adminContent) {
            adminContent.innerHTML = `
                <!-- Stats Grid -->
                <section class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="totalOrdersCount">0</h3>
                            <p>Всього замовлень</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 18V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 12H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="pendingOrdersCount">0</h3>
                            <p>В очікуванні</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="completedOrdersCount">0</h3>
                            <p>Виконано</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 1V23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 5H9.5C8.11929 5 7 6.11929 7 7.5S8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5S15.8807 15 14.5 15H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="totalRevenueAmount">0 ₴</h3>
                            <p>Загальний дохід</p>
                        </div>
                    </div>
                </section>

                <!-- Orders Section -->
                <section class="orders-section">
                    <div class="section-header">
                        <h2>Управління замовленнями</h2>
                        <div class="order-filters">
                            <select id="orderStatusFilter">
                                <option value="all">Всі статуси</option>
                                <option value="pending">В очікуванні</option>
                                <option value="processing">В обробці</option>
                                <option value="completed">Виконано</option>
                                <option value="cancelled">Скасовано</option>
                            </select>
                            <button class="refresh-btn" onclick="refreshOrders()">Оновити</button>
                            <button class="export-btn" onclick="exportOrders()">Експорт</button>
                        </div>
                    </div>
                    <div class="orders-list" id="ordersList">
                        <!-- Orders will be loaded dynamically -->
                    </div>
                    <div class="empty-orders" id="emptyOrders" style="display: none;">
                        <div class="empty-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7H21L19 21H5L3 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 21V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 21V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M1 3H5L7.68 14.39C7.77 14.7 8.06 14.94 8.38 14.94H17.5C17.78 14.94 18.05 14.74 18.13 14.47L21 5H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="8.5" cy="20.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                                <circle cx="19.5" cy="20.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </div>
                        <h3>Замовлень не знайдено</h3>
                        <p>Спробуйте змінити фільтри або дочекайтеся нових замовлень.</p>
                    </div>
                </section>

                <!-- Settings Section -->
                <section class="settings-section">
                    <div class="section-header">
                        <h2>Налаштування системи</h2>
                    </div>
                    <div class="settings-grid">
                        <div class="setting-card">
                            <h3>Загальні налаштування</h3>
                            <div class="form-group">
                                <label for="siteName">Назва сайту</label>
                                <input type="text" id="siteName" value="Dvery">
                            </div>
                            <div class="form-group">
                                <label for="adminEmail">Email адміністратора</label>
                                <input type="email" id="adminEmail" value="admin@dvery.com">
                            </div>
                            <button class="save-btn">Зберегти зміни</button>
                        </div>
                        <div class="setting-card">
                            <h3>Безпека</h3>
                            <div class="form-group">
                                <label for="oldPassword">Старий пароль</label>
                                <input type="password" id="oldPassword">
                            </div>
                            <div class="form-group">
                                <label for="newPassword">Новий пароль</label>
                                <input type="password" id="newPassword">
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Підтвердіть новий пароль</label>
                                <input type="password" id="confirmPassword">
                            </div>
                            <button class="save-btn">Змінити пароль</button>
                            <button class="danger-btn" style="margin-top: 15px;" onclick="clearAllOrders()">Видалити всі замовлення</button>
                            <button class="danger-btn" style="margin-top: 10px;" onclick="resetStatistics()">Скинути статистику</button>
                            <button class="danger-btn" style="margin-top: 10px;" onclick="debugOrders()">Показати замовлення (консоль)</button>
                        </div>
                    </div>
                </section>
            `;
            
            // Load orders after content is rendered
            this.loadOrders();
        }
    }

    // Bind events
    bindEvents() {
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'adminLoginForm') {
                e.preventDefault();
                this.handleLogin(e);
            }
        });

    }

    // Handle login
    handleLogin(e) {
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (username === this.adminCredentials.username && 
            password === this.adminCredentials.password) {
            this.isAuthenticated = true;
            sessionStorage.setItem('adminAuth', 'true');
            this.showAdminContent();
            this.showNotification('Успішний вхід в адмін панель!', 'success');
        } else {
            this.showNotification('Невірний логін або пароль!', 'error');
        }
    }

    // Logout
    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('adminAuth');
        this.showLoginForm();
        this.showNotification('Ви вийшли з адмін панелі', 'info');
    }

    // Load orders from localStorage
    loadOrders() {
        const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        console.log('Loading orders:', orders);
        this.updateStats(orders);
        this.renderOrders(orders);
        this.bindOrderEvents();
    }

    // Update statistics
    updateStats(orders) {
        const total = orders.length;
        const pending = orders.filter(order => order.status === 'pending').length;
        const completed = orders.filter(order => order.status === 'completed').length;
        
        console.log('Orders count:', total, 'Pending:', pending, 'Completed:', completed);
        
        // Get or initialize max values from localStorage
        let maxOrders = parseInt(localStorage.getItem('maxOrdersCount') || '0');
        let maxRevenue = parseInt(localStorage.getItem('maxRevenueAmount') || '0');
        let maxCompleted = parseInt(localStorage.getItem('maxCompletedCount') || '0');
        
        console.log('Current max orders:', maxOrders, 'Current max revenue:', maxRevenue, 'Current max completed:', maxCompleted);
        
        // Update max values if current values are higher
        console.log('Checking total orders:', total, 'vs max orders:', maxOrders);
        if (total > maxOrders) {
            maxOrders = total;
            localStorage.setItem('maxOrdersCount', maxOrders.toString());
            console.log('Updated max orders to:', maxOrders);
        } else {
            console.log('Max orders not updated, current:', total, 'max:', maxOrders);
        }
        
        // Update max completed orders if current is higher
        console.log('Checking completed orders:', completed, 'vs max completed:', maxCompleted);
        if (completed > maxCompleted) {
            maxCompleted = completed;
            localStorage.setItem('maxCompletedCount', maxCompleted.toString());
            console.log('Updated max completed to:', maxCompleted);
        } else {
            console.log('Max completed not updated, current:', completed, 'max:', maxCompleted);
        }
        
        // Calculate current total revenue
        const currentRevenue = orders.reduce((sum, order) => {
            // Parse price more carefully - remove spaces and currency symbols
            let priceText = order.totalPrice.toString();
            console.log('Original price text:', priceText);
            
            // Remove all non-numeric characters except dots and commas
            priceText = priceText.replace(/[^\d.,]/g, '');
            
            // Handle Ukrainian number format - replace comma with dot
            priceText = priceText.replace(',', '.');
            
            // Remove multiple dots (keep only the last one)
            const parts = priceText.split('.');
            if (parts.length > 2) {
                priceText = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
            }
            
            const price = parseFloat(priceText) || 0;
            console.log('Cleaned price text:', priceText, 'Parsed price:', price);
            return sum + price;
        }, 0);
        
        console.log('Current total revenue:', currentRevenue);
        
        // Update max revenue if current is higher
        if (currentRevenue > maxRevenue) {
            maxRevenue = currentRevenue;
            localStorage.setItem('maxRevenueAmount', maxRevenue.toString());
            console.log('Updated max revenue to:', maxRevenue);
        }

        // Update UI - use max values for total orders, revenue, and completed orders
        document.getElementById('totalOrdersCount').textContent = maxOrders;
        document.getElementById('pendingOrdersCount').textContent = pending;
        document.getElementById('completedOrdersCount').textContent = maxCompleted;
        document.getElementById('totalRevenueAmount').textContent = maxRevenue.toLocaleString() + ' ₴';
        
        console.log('Final stats - Orders:', maxOrders, 'Completed:', maxCompleted, 'Revenue:', maxRevenue);
    }

    // Render orders
    renderOrders(orders) {
        const ordersList = document.getElementById('ordersList');
        const emptyOrders = document.getElementById('emptyOrders');
        
        if (orders.length === 0) {
            ordersList.innerHTML = '';
            emptyOrders.style.display = 'block';
            return;
        }

        emptyOrders.style.display = 'none';
        ordersList.innerHTML = orders.map(order => this.renderOrderCard(order)).join('');
    }

    // Render single order card
    renderOrderCard(order) {
        const orderDate = new Date(order.createdAt).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusText = this.getStatusText(order.status);
        const deliveryText = this.getDeliveryText(order.delivery);
        const paymentText = this.getPaymentText(order.payment);

        return `
            <div class="order-card status-${order.status}" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Замовлення ${order.orderNumber}</h3>
                        <span class="order-date">${orderDate}</span>
                    </div>
                    <span class="status-badge status-${order.status}">${statusText}</span>
                </div>
                <div class="order-content">
                    <div class="product-info">
                        <h4>${order.productName}</h4>
                        <p>Ціна: ${order.productPrice}</p>
                        <p><strong>Загальна сума: ${order.totalPrice}</strong></p>
                    </div>
                    <div class="client-info">
                        <h5>Клієнт</h5>
                        <p>Ім'я: ${order.customerName}</p>
                        <p>Телефон: ${order.customerPhone}</p>
                        ${order.customerEmail ? `<p>Email: ${order.customerEmail}</p>` : ''}
                    </div>
                    <div class="delivery-info">
                        <h5>Доставка</h5>
                        <p>${deliveryText}</p>
                        ${order.deliveryAddress ? `<p>Адреса: ${order.deliveryAddress}</p>` : ''}
                        <p>Оплата: ${paymentText}</p>
                    </div>
                    ${order.orderComment ? `
                    <div class="comments-info">
                        <h5>Коментар</h5>
                        <p>${order.orderComment}</p>
                    </div>
                    ` : ''}
                </div>
                <div class="order-actions">
                    <select class="status-select" data-order-id="${order.id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>В очікуванні</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>В обробці</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Виконано</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Скасовано</option>
                    </select>
                    <button class="delete-btn" onclick="deleteOrder(${order.id})">Видалити</button>
                </div>
            </div>
        `;
    }

    // Get status text
    getStatusText(status) {
        const statusMap = {
            'pending': 'В очікуванні',
            'processing': 'В обробці',
            'completed': 'Виконано',
            'cancelled': 'Скасовано'
        };
        return statusMap[status] || status;
    }

    // Get delivery text
    getDeliveryText(delivery) {
        const deliveryMap = {
            'pickup': 'Самовивіз',
            'courier': 'Кур\'єром',
            'post': 'Нова Пошта',
            'ukrpost': 'Укрпошта'
        };
        return deliveryMap[delivery] || delivery;
    }

    // Get payment text
    getPaymentText(payment) {
        const paymentMap = {
            'cash': 'Готівка',
            'card': 'Картка'
        };
        return paymentMap[payment] || payment;
    }

    // Bind order events
    bindOrderEvents() {
        // Status change events
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.updateOrderStatus(e.target.dataset.orderId, e.target.value);
            });
        });

        // Filter events
        const statusFilter = document.getElementById('orderStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterOrders(e.target.value);
            });
        }
    }

    // Update order status
    updateOrderStatus(orderId, newStatus) {
        const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        const orderIndex = orders.findIndex(order => order.id == orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            orders[orderIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('adminOrders', JSON.stringify(orders));
            
            // Max completed count will be updated in loadOrders -> updateStats
            
            this.loadOrders(); // Reload to update UI
            this.showNotification(`Статус замовлення оновлено на "${this.getStatusText(newStatus)}"`, 'success');
        }
    }

    // Filter orders
    filterOrders(status) {
        const allOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        const filteredOrders = status === 'all' ? allOrders : allOrders.filter(order => order.status === status);
        
        this.renderOrders(filteredOrders);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
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
}

// Initialize admin auth
let adminAuth;
document.addEventListener('DOMContentLoaded', () => {
    adminAuth = new AdminAuth();
    window.adminAuth = adminAuth;
});

// Global functions for admin panel
function refreshOrders() {
    if (window.adminAuth) {
        window.adminAuth.loadOrders();
        window.adminAuth.showNotification('Замовлення оновлено', 'success');
    }
}

function exportOrders() {
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    if (orders.length === 0) {
        alert('Немає замовлень для експорту');
        return;
    }
    
    // Create CSV content
    const csvContent = [
        ['Номер замовлення', 'Товар', 'Клієнт', 'Телефон', 'Email', 'Спосіб доставки', 'Оплата', 'Статус', 'Сума', 'Дата створення'],
        ...orders.map(order => [
            order.orderNumber,
            order.productName,
            order.customerName,
            order.customerPhone,
            order.customerEmail || '',
            window.adminAuth.getDeliveryText(order.delivery),
            window.adminAuth.getPaymentText(order.payment),
            window.adminAuth.getStatusText(order.status),
            order.totalPrice,
            new Date(order.createdAt).toLocaleDateString('uk-UA')
        ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.adminAuth.showNotification('Експорт завершено', 'success');
}

function deleteOrder(orderId) {
    if (confirm('Ви впевнені, що хочете видалити це замовлення?')) {
        const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        const filteredOrders = orders.filter(order => order.id != orderId);
        localStorage.setItem('adminOrders', JSON.stringify(filteredOrders));
        
        if (window.adminAuth) {
            window.adminAuth.loadOrders();
            window.adminAuth.showNotification('Замовлення видалено', 'success');
        }
    }
}

function clearAllOrders() {
    if (confirm('Ви впевнені, що хочете видалити ВСІ замовлення? Цю дію неможливо скасувати!\n\nПримітка: Статистика "Всього замовлень" та "Загальний дохід" залишиться незмінною.')) {
        localStorage.removeItem('adminOrders');
        
        if (window.adminAuth) {
            window.adminAuth.loadOrders();
            window.adminAuth.showNotification('Всі замовлення видалено (статистика збережена)', 'success');
        }
    }
}

function resetStatistics() {
    if (confirm('Ви впевнені, що хочете скинути статистику "Всього замовлень", "Виконано" та "Загальний дохід"?\n\nЦе встановить значення на 0 і статистика буде рахуватися заново.')) {
        localStorage.removeItem('maxOrdersCount');
        localStorage.removeItem('maxRevenueAmount');
        localStorage.removeItem('maxCompletedCount');
        
        if (window.adminAuth) {
            window.adminAuth.loadOrders();
            window.adminAuth.showNotification('Статистика скинута', 'success');
        }
    }
}

function debugOrders() {
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const maxOrders = localStorage.getItem('maxOrdersCount') || '0';
    const maxRevenue = localStorage.getItem('maxRevenueAmount') || '0';
    const maxCompleted = localStorage.getItem('maxCompletedCount') || '0';
    
    console.log('=== DEBUG ORDERS ===');
    console.log('Orders in localStorage:', orders);
    console.log('Max orders count:', maxOrders);
    console.log('Max completed count:', maxCompleted);
    console.log('Max revenue amount:', maxRevenue);
    console.log('Orders length:', orders.length);
    
    const completed = orders.filter(order => order.status === 'completed').length;
    console.log('Current completed orders:', completed);
    
    // Debug price parsing
    console.log('=== PRICE PARSING DEBUG ===');
    let totalRevenue = 0;
    orders.forEach((order, index) => {
        const originalPrice = order.totalPrice.toString();
        let priceText = originalPrice;
        
        // Remove all non-numeric characters except dots and commas
        priceText = priceText.replace(/[^\d.,]/g, '');
        
        // Handle Ukrainian number format - replace comma with dot
        priceText = priceText.replace(',', '.');
        
        // Remove multiple dots (keep only the last one)
        const parts = priceText.split('.');
        if (parts.length > 2) {
            priceText = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
        }
        
        const parsedPrice = parseFloat(priceText) || 0;
        
        totalRevenue += parsedPrice;
        
        console.log(`Order ${index + 1} price parsing:`, {
            original: originalPrice,
            cleaned: priceText,
            parsed: parsedPrice,
            runningTotal: totalRevenue
        });
    });
    
    console.log('Final calculated revenue:', totalRevenue);
    
    orders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
            id: order.id,
            orderNumber: order.orderNumber,
            productName: order.productName,
            totalPrice: order.totalPrice,
            status: order.status
        });
    });
    
    alert('Дані виведено в консоль браузера (F12 -> Console)');
}
