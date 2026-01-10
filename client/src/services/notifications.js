// Notification service for system-wide notifications
export const NotificationService = {
    // Check if notifications are enabled
    isEnabled(type) {
        const settings = localStorage.getItem('appSettings');
        if (!settings) return true; // Default to enabled
        
        const parsedSettings = JSON.parse(settings);
        return parsedSettings.notifications?.[type] ?? true;
    },

    // Send browser notification
    sendBrowserNotification(title, body, icon = '/favicon.ico') {
        if (!('Notification' in window)) return;
        
        // Check if browser notifications are enabled
        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body, icon });
                }
            });
        }
    },

    // Send system notification (checks settings first)
    notify(type, title, message, data = {}) {
        if (!this.isEnabled(type)) return;
        
        // Send browser notification
        this.sendBrowserNotification(title, message);
        
        // Log to console for development
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`, data);
        
        // Store notification in localStorage for history
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift({
            id: Date.now(),
            type,
            title,
            message,
            data,
            timestamp: new Date().toISOString(),
            read: false
        });
        
        // Keep only last 50 notifications
        localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 50)));
    },

    // Order notifications
    orderCreated(order) {
        this.notify('orderUpdates', 'New Order Created', `Order #${order._id} has been placed`, order);
    },

    orderStatusChanged(order, oldStatus, newStatus) {
        this.notify('orderUpdates', 'Order Status Updated', `Order #${order._id} status changed from ${oldStatus} to ${newStatus}`, order);
    },

    // Stock notifications
    lowStock(product) {
        this.notify('lowStock', 'Low Stock Alert', `Product "${product.productName}" is running low on stock (${product.stock} remaining)`, product);
    },

    // System notifications
    systemAlert(message, severity = 'info') {
        this.notify('email', 'System Alert', message, { severity });
    },

    // Weekly report notification
    weeklyReportReady(reportData) {
        this.notify('weeklyReports', 'Weekly Report Ready', 'Your weekly performance summary is now available', reportData);
    },

    // Get notification history
    getNotificationHistory(limit = 10) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        return notifications.slice(0, limit);
    },

    // Mark notification as read
    markAsRead(notificationId) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    },

    // Clear all notifications
    clearAll() {
        localStorage.removeItem('notifications');
    }
};

// Auto-request notification permission on load
if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

export default NotificationService;