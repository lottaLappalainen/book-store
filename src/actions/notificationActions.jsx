
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export const setNotification = ({ message, stateType, requestStatus }) => {
    return {
      type: SET_NOTIFICATION,
      payload: {
        message,
        stateType,
        requestStatus,
      },
    };
  };
  

export const clearNotification = () => {
  return {
    type: CLEAR_NOTIFICATION,
  };
};