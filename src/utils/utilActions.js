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