import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Notification({ notification, onClose }) {
    useEffect(() => {
        if (notification.autoClose !== false) {
            const timer = setTimeout(() => {
                onClose();
            }, notification.duration || 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    const icons = {
        success: CheckCircle2,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle
    };

    const Icon = icons[notification.type] || Info;

    const styles = {
        success: 'bg-success/10 border-success/20 text-success',
        error: 'bg-error/10 border-error/20 text-error',
        info: 'bg-info/10 border-info/20 text-info',
        warning: 'bg-warning/10 border-warning/20 text-warning'
    };

    return (
        <div
            className={cn(
                'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-alibaba-lg animate-slide-up',
                styles[notification.type] || styles.info
            )}
            role={notification.type === 'error' ? 'alert' : 'status'}
            aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
        >
            <Icon size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                {notification.title && (
                    <p className="text-sm font-semibold mb-1">{notification.title}</p>
                )}
                <p className="text-sm">{notification.message}</p>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity rounded"
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
}

export function NotificationContainer({ notifications, onClose }) {
    if (!notifications || notifications.length === 0) return null;

    return (
        <div
            className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full sm:w-auto"
            role="region"
            aria-label="Notifications"
        >
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    notification={notification}
                    onClose={() => onClose(notification.id)}
                />
            ))}
        </div>
    );
}

