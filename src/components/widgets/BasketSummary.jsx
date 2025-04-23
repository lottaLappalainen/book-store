import { useDispatch } from "react-redux";
import { updateBasketItemQuantity } from "../../actions/basketActions";
import { useEffect, useState } from "react";
import '../../styles/Order.css';

const BasketSummaryRow = ({ item, updateQuantity }) => {
    const { hinta, id, isbn, julkaisuvuosi, kpl, luokkaid, nimi, paino, quantity, tekija, tyyppiid } = item;

    const canIncrease = quantity < kpl;

    return (
        <tr className="data-row">
            <td>{nimi}</td>
            <td>{tekija}</td>
            <td>{hinta} €</td>
            <td>{quantity}</td>
            <td>{paino} g</td>
            <td>
                <button 
                    className="button-secondary action-button" 
                    onClick={() => updateQuantity(id, 1)}
                    disabled={!canIncrease}
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

const BasketSummary = ({ items }) => {
    const dispatch = useDispatch();
    const [fullPrice, setFullPrice] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);

    useEffect(() => {
        let price = 0;
        let weight = 0;
        items.forEach(item => {
            price += item.quantity * parseFloat(item.hinta);
            weight += item.quantity * parseFloat(item.paino);
        });
        setFullPrice(price.toFixed(2));
        setTotalWeight(weight);
    }, [items]);

    const handleUpdateQuantity = (bookId, amount) => {
        dispatch(updateBasketItemQuantity(bookId, amount));
    };

    return (
        <div className="basket-container">
            {items && items.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Nimi</th>
                            <th scope="col">Tekijä</th>
                            <th scope="col">Hinta</th>
                            <th scope="col">Kplmäärä</th>
                            <th scope="col">Paino</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <BasketSummaryRow key={item.id} item={item} updateQuantity={handleUpdateQuantity} />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" colSpan="3">Kokonaishinta</th>
                            <td>{fullPrice} €</td>
                        </tr>
                        <tr>
                            <th scope="row" colSpan="3">Kokonaispaino</th>
                            <td>{totalWeight} g</td>
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
