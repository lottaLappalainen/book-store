import { LOGIN, LOGOUT } from '../actions/userActions';

const initialState = {
    role: 'guest',
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
    //väliaikaisesti laittaa käyttäjän aina asiakkaaksi kirjautumisen yhteydessä
      case LOGIN:
        return { ...state, role: 'customer' };
      case LOGOUT:
        return { ...state, role: 'guest' };
      default:
        return state;
    }
  };
  
  export default userReducer;