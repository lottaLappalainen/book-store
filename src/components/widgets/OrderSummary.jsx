import { useDispatch, useSelector } from "react-redux";
import { updateOrderQuantity, updateOrderPrice } from "../../actions/orderActions";

const OrderSummaryRow = ({ item, updateQuantity }) => {
    const {hinta, id, isbn, julkaisuvuosi, kpl, luokkaid, nimi, paino, quantity, tekija, tyyppiid} = item;
    
    
    return (
        <tr className="data-row">
            <td>{nimi}</td>
            <td>{tekija}</td>
            <td>{hinta}</td>
            <td className="action-cell">
                {quantity}
                <div>
                    <button 
                        className="button-secondary action-button" 
                        onClick={() => updateQuantity(id, 1)}
                    >
                        +
                    </button>
                    <button 
                        className="button-secondary-light action-button" 
                        onClick={() => updateQuantity(id, -1)}
                    >
                        -
                    </button>   
                </div>
            </td>
            
        </tr>
    );
};


const OrderSummary = ({items}) => {
    const order = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const handleUpdateQuantity = (bookId, amount) => {
        dispatch(updateOrderQuantity(bookId, amount));
        console.log("order:", order)
        dispatch(updateOrderPrice(order.id));
    };

    return (
        <div style={{}}>
            {order && order.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Nimi</th>
                            <th scope="col">Tekijä</th>
                            <th scope="col">Hinta</th>
                            <th scope="col">Määrä</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <OrderSummaryRow key={item.id} item={item} updateQuantity={handleUpdateQuantity}/>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" colSpan="3">Kokonaishinta</th>
                            <td>{order.hinta}</td>
                        </tr>
                    </tfoot>
                </table>
                
            ) : (
                <p>No items</p>
            )}
        </div>
    );
};

export default OrderSummary;