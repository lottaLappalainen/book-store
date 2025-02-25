import { ADD_TO_ORDER, REMOVE_FROM_ORDER, UPDATE_ORDER_QUANTITY, CLEAR_ORDER } from '../actions/orderActions';

const initialState = [];

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_ORDER:
      { const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      } }

    case REMOVE_FROM_ORDER:
      return state.filter((item) => item.id !== action.payload);

    case UPDATE_ORDER_QUANTITY:
      return state
        .map((item) =>
          item.id === action.payload.bookId
            ? { ...item, quantity: item.quantity + action.payload.amount }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with quantity 0

    case CLEAR_ORDER:
      return [];

    default:
      return state;
  }
};

export default orderReducer;
