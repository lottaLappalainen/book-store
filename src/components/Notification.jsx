import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/Notification.css';

const Notification = () => {
  const notification = useSelector(state => state.notification); // grab the current notification from Redux
  const [isVisible, setIsVisible] = useState(false); 
  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false); // hide it after 5 seconds
      }, 5000);
      return () => clearTimeout(timer); 
    }
  }, [notification]);

  // only show the notification if it's marked visible and actually has a message
  return isVisible && notification?.message ? (
    <div className={`notification ${notification.requestStatus}`}>
      {notification.message}
    </div>
  ) : null;
};

export default Notification;
