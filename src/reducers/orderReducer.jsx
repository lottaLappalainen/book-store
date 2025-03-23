import { ADD_TO_ORDER, REMOVE_FROM_ORDER, UPDATE_ORDER_QUANTITY, CLEAR_ORDER, UPDATE_ORDER_PRICE } from '../actions/orderActions';
import { generateGUID } from '../utils/utils';

const initialState = [];

const initialOrder = {
  id: generateGUID(),
  tilauspvm: new Date(),
  hinta: 0,
  tila: 'vahvistamaton',
  niteet: [],
};

//Updated order reducer
const orderReducer2 = (order = initialOrder, action) => {
  switch (action.type) {
    case ADD_TO_ORDER: 
      { const existingNide = order.niteet.find((nide) => nide.id === action.payload.id)};
      if (existingNide) {
        return order.niteet.map((nide) => 
          nide.id === action.payload.id ? { ...nide, quantity: nide.quantity++ } : nide
        );
      } else {
        const updatedOrder = order;
        updatedOrder.niteet.push({
          ...action.payload, quantity: 1
        })
        return updatedOrder;
      }
  }
}

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
      } 
    }

    case REMOVE_FROM_ORDER: return state.filter((item) => item.id !== action.payload);

    case UPDATE_ORDER_QUANTITY:
      return state
        .map((item) =>
          item.id === action.payload.bookId
            ? { 
                ...item, 
                quantity: item.quantity + action.payload.amount 
              }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with quantity 0
    
    case CLEAR_ORDER: return [];
    
    case UPDATE_ORDER_PRICE:
      { const existingItem = state.find((item) => item.id === action.payload.id);
        if(existingItem) {
          console.log(item)
          return item;
        } else  {
          return state;
        }
      }
    
    default: return state;
  }
};

export default orderReducer;
