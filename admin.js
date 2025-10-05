// Admin Panel JavaScript with User Management
class AdminPanel {
    constructor() {
        this.orders = [];
        this.currentUser = null;
        this.authSystem = null;
        this.init();
    }

    init() {
        this.loadAuthSystem();
        this.loadOrders();
        this.checkAuth();
        this.bindEvents();
    }

    // Load authentication system
    loadAuthSystem() {
        // Load auth.js if not already loaded
        if (typeof window.authSystem === 'undefined') {
            const script = document.createElement('script');
            script.src = 'auth.js';
            script.onload = () => {
                this.authSystem = window.authSystem;
                this.checkAuth();
            };
            document.head.appendChild(script);
        } else {
            this.authSystem = window.authSystem;
        }
    }

    // Authentication
    checkAuth() {
        if (!this.authSystem) return;
        
        const isLoggedIn = this.authSystem.currentUser && this.authSystem.isAdmin();
        if (isLoggedIn) {
            this.currentUser = this.authSystem.currentUser;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        this.updateStats();
        this.renderOrders();
        this.renderUsers();
    }

    login(email, password) {
        if (!this.authSystem) {
            alert('Система авторизації не завантажена');
            return false;
        }
        
        try {
            const user = this.authSystem.login(email, password);
            if (user.role === 'admin') {
                this.currentUser = user;
                this.showDashboard();
                return true;
            } else {
                alert('Доступ заборонено. Потрібні права адміністратора.');
                return false;
            }
        } catch (error) {
            alert(error.message);
            return false;
        }
    }

    logout() {
        if (this.authSystem) {
            this.authSystem.logout();
        }
        this.showLogin();
    }

    // Orders Management
    loadOrders() {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        }
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    addOrder(orderData) {
        const order = {
            id: 'ORD-' + Date.now(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.orders.unshift(order);
        this.saveOrders();
        this.updateStats();
        this.renderOrders();
    }

    updateOrderStatus(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            this.saveOrders();
            this.updateStats();
            this.renderOrders();
        }
    }

    deleteOrder(orderId) {
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.saveOrders();
        this.updateStats();
        this.renderOrders();
    }

    // Statistics
    updateStats() {
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
        const completedOrders = this.orders.filter(o => o.status === 'completed').length;
        const totalRevenue = this.orders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + this.parsePrice(o.product.price), 0);

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('completedOrders').textContent = completedOrders;
        document.getElementById('totalRevenue').textContent = this.formatPrice(totalRevenue);
    }

    parsePrice(priceStr) {
        return parseInt(priceStr.replace(/[^\d]/g, '')) || 0;
    }

    formatPrice(price) {
        return price.toLocaleString('uk-UA') + ' ₴';
    }

    // Rendering
    renderOrders() {
        const filter = document.getElementById('statusFilter').value;
        const filteredOrders = filter === 'all' ? this.orders : this.orders.filter(o => o.status === filter);
        
        const ordersList = document.getElementById('ordersList');
        
        if (filteredOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-orders">
                    <div class="empty-icon">📦</div>
                    <h3>Немає замовлень</h3>
                    <p>Поки що жодних замовлень не надійшло</p>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = filteredOrders.map(order => this.renderOrderCard(order)).join('');
    }

    renderOrderCard(order) {
        const statusClass = `status-${order.status}`;
        const statusText = this.getStatusText(order.status);
        const createdDate = new Date(order.createdAt).toLocaleDateString('uk-UA');
        const createdTime = new Date(order.createdAt).toLocaleTimeString('uk-UA', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        return `
            <div class="order-card ${statusClass}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>${order.orderNumber}</h3>
                        <span class="order-date">${createdDate} ${createdTime}</span>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
                
                <div class="order-content">
                    <div class="product-info">
                        <h4>${order.product.name}</h4>
                        <div class="product-price">${order.product.price}</div>
                    </div>
                    
                    <div class="client-info">
                        <h5>Клієнт:</h5>
                        <p><strong>${order.client.name}</strong></p>
                        <p>📞 ${order.client.phone}</p>
                        ${order.client.email ? `<p>📧 ${order.client.email}</p>` : ''}
                    </div>
                    
                    <div class="delivery-info">
                        <h5>Доставка:</h5>
                        <p>${this.getDeliveryText(order.delivery.method)}</p>
                        ${order.delivery.address ? `<p>📍 ${order.delivery.address}</p>` : ''}
                    </div>
                    
                    ${order.comments ? `
                        <div class="comments-info">
                            <h5>Коментарі:</h5>
                            <p>${order.comments}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="order-actions">
                    <select class="status-select" onchange="adminPanel.updateOrderStatus('${order.id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>В очікуванні</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>В обробці</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Виконано</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Скасовано</option>
                    </select>
                    <button class="delete-btn" onclick="adminPanel.deleteOrder('${order.id}')">🗑️</button>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'В очікуванні',
            'processing': 'В обробці',
            'completed': 'Виконано',
            'cancelled': 'Скасовано'
        };
        return statusMap[status] || status;
    }

    getDeliveryText(method) {
        const methodMap = {
            'pickup': 'Самовивіз з магазину',
            'delivery': 'Доставка кур\'єром'
        };
        return methodMap[method] || method;
    }

    // Event Handlers
    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('adminPassword').value; // Using password field for email
            const password = document.getElementById('adminPassword').value;
            
            // For backward compatibility, check if it's the old password format
            if (email === 'admin123' || email === localStorage.getItem('adminPassword')) {
                // Old login method
                if (this.loginOldMethod(password)) {
                    document.getElementById('adminPassword').value = '';
                }
            } else {
                // New login method with email
                if (this.login(email, password)) {
                    document.getElementById('adminPassword').value = '';
                }
            }
        });

        // Password change form
        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const savedPassword = localStorage.getItem('adminPassword') || 'admin123';
            
            if (currentPassword === savedPassword) {
                localStorage.setItem('adminPassword', newPassword);
                alert('Пароль успішно змінено!');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
            } else {
                alert('Невірний поточний пароль!');
            }
        });

        // Status filter
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.renderOrders();
        });

        // User status filter
        document.getElementById('userStatusFilter').addEventListener('change', () => {
            this.renderUsers();
        });
    }

    // User Management
    renderUsers() {
        if (!this.authSystem) return;
        
        const filter = document.getElementById('userStatusFilter').value;
        let users = this.authSystem.getAllUsers();
        
        if (filter !== 'all') {
            users = users.filter(u => u.status === filter);
        }
        
        const usersGrid = document.getElementById('usersGrid');
        
        if (users.length === 0) {
            usersGrid.innerHTML = `
                <div class="empty-orders">
                    <div class="empty-icon">👥</div>
                    <h3>Немає користувачів</h3>
                    <p>Поки що жодних користувачів не зареєстровано</p>
                </div>
            `;
            return;
        }

        usersGrid.innerHTML = users.map(user => this.renderUserCard(user)).join('');
    }

    renderUserCard(user) {
        const statusClass = `status-${user.status}`;
        const statusText = this.getUserStatusText(user.status);
        const roleText = user.role === 'admin' ? 'Адміністратор' : 'Користувач';
        const createdDate = new Date(user.createdAt).toLocaleDateString('uk-UA');
        const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('uk-UA') : 'Ніколи';

        return `
            <div class="user-card ${statusClass}">
                <div class="user-header">
                    <div class="user-id">ID: ${user.id}</div>
                    <div class="user-status ${statusClass}">${statusText}</div>
                </div>
                
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p>📧 ${user.email}</p>
                    <p>📞 ${user.phone}</p>
                    <p>📅 Зареєстровано: ${createdDate}</p>
                    <p>🔐 Останній вхід: ${lastLogin}</p>
                    <span class="user-role">${roleText}</span>
                </div>
                
                <div class="user-actions">
                    <select onchange="adminPanel.updateUserStatus(${user.id}, this.value)">
                        <option value="pending" ${user.status === 'pending' ? 'selected' : ''}>Очікує</option>
                        <option value="active" ${user.status === 'active' ? 'selected' : ''}>Активний</option>
                        <option value="blocked" ${user.status === 'blocked' ? 'selected' : ''}>Заблокований</option>
                    </select>
                    
                    ${user.role !== 'admin' ? `
                        <button class="make-admin-btn" onclick="adminPanel.makeUserAdmin(${user.id})">
                            Зробити адміном
                        </button>
                    ` : ''}
                    
                    <button class="block-btn" onclick="adminPanel.toggleUserBlock(${user.id})">
                        ${user.status === 'blocked' ? 'Розблокувати' : 'Заблокувати'}
                    </button>
                </div>
            </div>
        `;
    }

    getUserStatusText(status) {
        const statusMap = {
            'pending': 'Очікує',
            'active': 'Активний',
            'blocked': 'Заблокований'
        };
        return statusMap[status] || status;
    }

    updateUserStatus(userId, status) {
        if (!this.authSystem) return;
        
        if (this.authSystem.updateUserStatus(userId, status)) {
            this.renderUsers();
            this.showNotification(`Статус користувача оновлено`, 'success');
        }
    }

    makeUserAdmin(userId) {
        if (!this.authSystem) return;
        
        if (confirm('Ви впевнені, що хочете надати цьому користувачу права адміністратора?')) {
            if (this.authSystem.updateUserRole(userId, 'admin')) {
                this.renderUsers();
                this.showNotification(`Користувач отримав права адміністратора`, 'success');
            }
        }
    }

    toggleUserBlock(userId) {
        if (!this.authSystem) return;
        
        const user = this.authSystem.getUserById(userId);
        if (!user) return;
        
        const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
        const action = newStatus === 'blocked' ? 'заблоковано' : 'розблоковано';
        
        if (confirm(`Ви впевнені, що хочете ${action} цього користувача?`)) {
            if (this.authSystem.updateUserStatus(userId, newStatus)) {
                this.renderUsers();
                this.showNotification(`Користувач ${action}`, 'success');
            }
        }
    }

    refreshUsers() {
        this.renderUsers();
        this.showNotification('Список користувачів оновлено!', 'success');
    }

    // Backward compatibility
    loginOldMethod(password) {
        const adminPassword = localStorage.getItem('adminPassword') || 'admin123';
        if (password === adminPassword) {
            localStorage.setItem('adminLoggedIn', 'true');
            this.showDashboard();
            return true;
        } else {
            alert('Невірний пароль!');
            return false;
        }
    }

    // Utility functions
    refreshOrders() {
        this.loadOrders();
        this.updateStats();
        this.renderOrders();
        this.showNotification('Замовлення оновлено!', 'success');
    }

    exportOrders() {
        const dataStr = JSON.stringify(this.orders, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `orders_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Замовлення експортовано!', 'success');
    }

    clearAllData() {
        if (confirm('Ви впевнені, що хочете видалити всі дані? Цю дію неможливо скасувати!')) {
            localStorage.removeItem('orders');
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminPassword');
            this.orders = [];
            this.updateStats();
            this.renderOrders();
            this.showNotification('Всі дані очищено!', 'warning');
            setTimeout(() => {
                this.showLogin();
            }, 2000);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#22c55e' : type === 'warning' ? '#f59e0b' : '#2563eb'};
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
}

// Global functions
function logout() {
    adminPanel.logout();
}

function refreshOrders() {
    adminPanel.refreshOrders();
}

function exportOrders() {
    adminPanel.exportOrders();
}

function refreshUsers() {
    adminPanel.refreshUsers();
}

function updateUserStatus(userId, status) {
    adminPanel.updateUserStatus(userId, status);
}

function makeUserAdmin(userId) {
    adminPanel.makeUserAdmin(userId);
}

function toggleUserBlock(userId) {
    adminPanel.toggleUserBlock(userId);
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});

// Function to add order from main site (called from order form)
function addOrderToAdmin(orderData) {
    if (typeof adminPanel !== 'undefined') {
        adminPanel.addOrder(orderData);
    } else {
        // If admin panel is not loaded, save to localStorage for later
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
