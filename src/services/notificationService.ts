import { useState, useEffect } from 'preact/hooks';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

type Subscriber = (n: Notification[]) => void;
let subscribers: Subscriber[] = [];
let notifications: Notification[] = [];

const notifySubscribers = () => {
  const current = [...notifications];
  subscribers.forEach((callback) => callback(current));
};

export const toast = {
  show: (message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    notifications = [...notifications, { id, message, type }];
    notifySubscribers();

    setTimeout(() => {
      notifications = notifications.filter((n) => n.id !== id);
      notifySubscribers();
    }, 4000);
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
};

export function useNotifications() {
  const [list, setList] = useState<Notification[]>(notifications);

  useEffect(() => {
    const sub: Subscriber = (newList) => setList(newList);
    subscribers.push(sub);
    return () => {
      subscribers = subscribers.filter((s) => s !== sub);
    };
  }, []);

  return list;
}
