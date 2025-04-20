import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/Notification.css';

const Notification = () => {
  const notification = useSelector(state => state.notification);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return isVisible && notification?.message ? (
    <div className={`notification ${notification.requestStatus}`}>
      {notification.message}
    </div>
  ) : null;
};

export default Notification;
