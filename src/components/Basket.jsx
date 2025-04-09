import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../actions/notificationActions';
import { updateBasketItemQuantity, clearBasket } from '../actions/basketActions';
import OrderSummary from './widgets/BasketSummary';
import '../styles/order.css';
import { useNavigate } from 'react-router-dom';
import { initializeOrder } from '../actions/orderActions';

const Basket = () => {
  const basket = useSelector((state) => state.basket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdateQuantity = (bookId, amount) => {
    dispatch(updateBasketItemQuantity(bookId, amount));
  };

  const handleBasket = async () => {
    try {
      const order = await initializeOrder(basket);
      navigate('/order', { state: { order: order } });
      console.log("order", order);
    } catch (error) {
      console.log(error)
    }
    
    //navigate('/order');
  };

  const handleCancelBasket = () => {
    dispatch(setNotification({ message: 'Tilaus peruttu.', requestStatus: 'error' }));
    dispatch(clearBasket());
  };

  return (
    <div className="order-container">
      <h1>Ostoskori</h1>
      
      {basket.length > 0 ? (
        <>
          <OrderSummary items={basket}/>
          <button className='button-primary-light' onClick={handleBasket}>Place Order</button>
          <button className='button-secondary-light' onClick={handleCancelBasket}>Cancel Order</button>
        </>
      ) : (
        <p>Ostoskori on tyhjä.</p>
      )}
    </div>
  );
};

export default Basket;
