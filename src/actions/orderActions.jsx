export const ADD_TO_ORDER = 'ADD_TO_ORDER';
export const REMOVE_FROM_ORDER = 'REMOVE_FROM_ORDER';
export const UPDATE_ORDER_QUANTITY = 'UPDATE_ORDER_QUANTITY';
export const CLEAR_ORDER = 'CLEAR_ORDER';

export const addToOrder = (book) => ({
  type: ADD_TO_ORDER,
  payload: book,
});

export const removeFromOrder = (bookId) => ({
  type: REMOVE_FROM_ORDER,
  payload: bookId,
});

export const updateOrderQuantity = (bookId, amount) => ({
  type: UPDATE_ORDER_QUANTITY,
  payload: { bookId, amount },
});

export const clearOrder = () => ({
  type: CLEAR_ORDER,
});
