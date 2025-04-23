import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  UPDATE_USER_PHONE
} from '../actions/userActions';

//the role is guest by default, so only login/register is shown
const initialState = {
  id: null,
  name: null,
  role: 'guest',
  email: null,
  phone: null,
  address: null,
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
      return { 
        ...state,
        id: action.payload.id,
        name: action.payload.name, 
        email: action.payload.email, 
        role: action.payload.role, 
        phone: action.payload.phone, 
        address: action.payload.address,
        loading: false, 
        error: null 
      };

    case REGISTER_SUCCESS:
      return { ...state, loading: false, error: null };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return { ...initialState };

    case UPDATE_USER_PHONE:
      return { ...state, phone: action.payload };

    default:
      return state;
  }
};

export default userReducer;
