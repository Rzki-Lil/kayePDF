import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-preact';
import { useNotifications, NotificationType } from '../../services/notificationService.ts';

export function NotificationContainer() {
  const notifications = useNotifications();

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <NotificationItem key={n.id} {...n} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ message, type }: { message: string, type: NotificationType }) {
  const configs = {
    success: {
      icon: <CheckCircle2 size={20} />,
      bg: 'bg-brand-surface',
      border: 'border-brand-primary',
      iconColor: 'text-brand-primary',
    },
    error: {
      icon: <AlertCircle size={20} />,
      bg: 'bg-brand-error-surface',
      border: 'border-brand-error',
      iconColor: 'text-brand-error',
    },
    info: {
      icon: <Info size={20} />,
      bg: 'bg-bg-accent',
      border: 'border-border-main',
      iconColor: 'text-text-muted',
    },
  };

  const config = configs[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className={`pointer-events-auto min-w-[320px] max-w-100 p-4 rounded-[20px] border shadow-2xl flex items-start gap-4 ${config.bg} ${config.border}`}
    >
      <div className={`${config.iconColor} mt-0.5`}>
        {config.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-text-main leading-tight">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
