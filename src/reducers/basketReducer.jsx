import { ADD_TO_BASKET, REMOVE_FROM_BASKET, UPDATE_BASKET_ITEM_QUANTITY, CLEAR_BASKET } from '../actions/basketActions';

const initialState = [];

const basketReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_BASKET:
      { const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      } }

    case REMOVE_FROM_BASKET:
      return state.filter((item) => item.id !== action.payload);

    case UPDATE_BASKET_ITEM_QUANTITY:
      return state
        .map((item) =>
          item.id === action.payload.bookId
            ? { ...item, quantity: item.quantity + action.payload.amount }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with quantity 0

    case CLEAR_BASKET:
      return [];

    default:
      return state;
  }
};

export default basketReducer;