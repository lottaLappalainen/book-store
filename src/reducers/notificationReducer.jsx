import { SET_NOTIFICATION, CLEAR_NOTIFICATION } from '../actions/notificationActions';

//empty at first and after clearing, so there is no notification to show
const initialState = {
  message: '',
  requestStatus: '',
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        message: action.payload.message,
        requestStatus: action.payload.requestStatus,
      };
    case CLEAR_NOTIFICATION:
      return {
        message: '',
        requestStatus: '',
      };
    default:
      return state;
  }
};

export default notificationReducer;