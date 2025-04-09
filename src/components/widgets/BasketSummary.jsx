import { useDispatch } from "react-redux";
import { updateBasketItemQuantity } from "../../actions/basketActions";
import { useEffect, useState } from "react";


const BasketSummaryRow = ({ item, updateQuantity }) => {
    const {hinta, id, isbn, julkaisuvuosi, kpl, luokkaid, nimi, paino, quantity, tekija, tyyppiid} = item;
    
    
    return (
        <tr className="data-row">
            <td>{nimi}</td>
            <td>{tekija}</td>
            <td>{hinta}</td>
            <td>{quantity}</td>
            <td>
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
            </td>
        </tr>
    );
};


const BasketSummary = ({items}) => {
    const dispatch = useDispatch();
    const [fullPrice, setFullPrice] = useState();
    

    useEffect(() => {
        let price = 0;
        items.forEach(item => {
            price = price + item.quantity * parseFloat(item.hinta);
        });
        setFullPrice(price.toFixed(2));
    },[items]);


    const handleUpdateQuantity = (bookId, amount) => {
        dispatch(updateBasketItemQuantity(bookId, amount));
    };

    return (
        <div style={{}}>
            {items && items.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Nimi</th>
                            <th scope="col">Tekijä</th>
                            <th scope="col">Hinta</th>
                            <th scope="col">Kplmäärä</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <BasketSummaryRow key={item.id} item={item} updateQuantity={handleUpdateQuantity}/>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" colSpan="3">Kokonaishinta</th>
                            <td>{fullPrice} €</td>
                        </tr>
                    </tfoot>
                </table>
                
            ) : (
                <p>No items</p>
            )}
        </div>
    );
};

export default BasketSummary;