import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationContainer } from '../components/common/Notification';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: 'info',
            duration: 5000,
            ...notification
        };
        setNotifications(prev => [...prev, newNotification]);
        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const showSuccess = useCallback((title, message) => {
        return addNotification({ type: 'success', title, message });
    }, [addNotification]);

    const showError = useCallback((title, message) => {
        return addNotification({ type: 'error', title, message, duration: 7000 });
    }, [addNotification]);

    const showInfo = useCallback((title, message) => {
        return addNotification({ type: 'info', title, message });
    }, [addNotification]);

    const showWarning = useCallback((title, message) => {
        return addNotification({ type: 'warning', title, message });
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{
            addNotification,
            removeNotification,
            showSuccess,
            showError,
            showInfo,
            showWarning
        }}>
            {children}
            <NotificationContainer
                notifications={notifications}
                onClose={removeNotification}
            />
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}
