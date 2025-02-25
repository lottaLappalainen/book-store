
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export const setNotification = ({ message, requestStatus }) => {
    return {
      type: SET_NOTIFICATION,
      payload: {
        message,
        requestStatus,
      },
    };
  };
  

export const clearNotification = () => {
  return {
    type: CLEAR_NOTIFICATION,
  };
};