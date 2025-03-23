import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../actions/notificationActions';
import { updateOrderQuantity, clearOrder } from '../actions/orderActions';
import OrderSummary from './widgets/OrderSummary';
import '../styles/order.css';

const Order = () => {
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (bookId, amount) => {
    dispatch(updateOrderQuantity(bookId, amount));
  };

  const handleOrder = () => {
    dispatch(setNotification({ message: 'Tilaus suoritettu onnistuneesti', requestStatus: 'success' }));
    dispatch(clearOrder());
  };

  const handleCancelOrder = () => {
    dispatch(setNotification({ message: 'Tilaus peruttu.', requestStatus: 'error' }));
    dispatch(clearOrder());
  };
  console.log(order)
  return (
    <div className="order-container">
      <h1>Ostoskori</h1>
      
      {order.length > 0 ? (
        <>
          <OrderSummary items={order}/>
          <ul>
            {order.map((item) => (
              <li key={item.id}>
                <strong>{item.nimi}</strong> (x{item.quantity})
                <button onClick={() => handleUpdateQuantity(item.id, 1)}>+</button>
                <button onClick={() => handleUpdateQuantity(item.id, -1)}>-</button>
              </li>
            ))}
          </ul>
          <h4>Postikulut: </h4>
          <h4>Kokonaishinta: </h4>
          <button className='button-primary-light' onClick={handleOrder}>Place Order</button>
          <button className='button-secondary-light' onClick={handleCancelOrder}>Cancel Order</button>
        </>
      ) : (
        <p>Ostoskori on tyhjä.</p>
      )}
    </div>
  );
};

export default Order;
