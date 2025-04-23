import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../actions/notificationActions';
import { updateBasketItemQuantity, clearBasket } from '../actions/basketActions';
import OrderSummary from './widgets/BasketSummary';
import '../styles/Order.css';
import { useNavigate, useRevalidator } from 'react-router-dom';
import { initializeOrder } from '../actions/orderActions';

const Basket = () => {
  const basket = useSelector((state) => state.basket);
  const userGlobal = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBasket = async () => {
    try {
      const order = await initializeOrder(basket,userGlobal.id, dispatch);
      navigate('/order', { state: { order: order } });
      console.log("order", order);
    } catch (error) {
      console.log(error)
    }
  };

  const handleCancelBasket =  async () => {
    dispatch(setNotification({ message: 'Tilaus peruttu.', requestStatus: 'error' }));
    dispatch(clearBasket());
  };

  return (
    <div className="order-container">
      <div className="order-content">
        <h1>Ostoskori</h1>

        {basket.length > 0 ? (
          <>
            <OrderSummary items={basket} />
            <div className="button-row">
              <button className="button-primary-light" onClick={handleBasket}>
                Tee tilaus
              </button>
              <button className="button-secondary-light" onClick={handleCancelBasket}>
                Peru tilaus
              </button>
            </div>
          </>
        ) : (
          <p>Ostoskori on tyhjä.</p>
        )}
      </div>
    </div>
  );
};

export default Basket;
