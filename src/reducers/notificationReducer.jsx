import { SET_NOTIFICATION, CLEAR_NOTIFICATION } from '../actions/notificationActions';

const initialState = {
  message: '',
  stateType: '',
  requestStatus: '',
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        message: action.payload.message,
        stateType: action.payload.stateType,
        requestStatus: action.payload.requestStatus,
      };
    case CLEAR_NOTIFICATION:
      return {
        message: '',
        stateType: '',
        requestStatus: '',
      };
    default:
      return state;
  }
};

export default notificationReducer;