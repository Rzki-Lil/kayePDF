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
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-sage-500',
      iconColor: 'text-sage-600',
    },
    error: {
      icon: <AlertCircle size={20} />,
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-red-500',
      iconColor: 'text-red-600',
    },
    info: {
      icon: <Info size={20} />,
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-slate-200 dark:border-slate-700',
      iconColor: 'text-slate-600',
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
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
