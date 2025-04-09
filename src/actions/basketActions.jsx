export const ADD_TO_BASKET = 'ADD_TO_BASKET';
export const REMOVE_FROM_BASKET = 'REMOVE_FROM_BASKET';
export const UPDATE_BASKET_ITEM_QUANTITY = 'UPDATE_ORDER_QUANTITY';
export const CLEAR_BASKET = 'CLEAR_ORDER';


export const addToBasket = (book) => ({
  type: ADD_TO_BASKET,
  payload: book,
});

export const removeFromBasket = (bookId) => ({
  type: REMOVE_FROM_BASKET,
  payload: bookId,
});

export const updateBasketItemQuantity = (bookId, amount) => ({
  type: UPDATE_BASKET_ITEM_QUANTITY,
  payload: { bookId, amount },
});

export const clearBasket = () => ({
  type: CLEAR_BASKET,
});


/**
 * 
 * @param {Array} items - The nide items in basket.
 * @returns - The calculated sum price of the items.
 */
export const calculateBasketPriceSum = (items) => {
  let price = 0;
  items.forEach(item => {
      price = price + item.quantity * parseFloat(item.hinta);
  });
  price = price.toFixed(2);
  return price;
};


