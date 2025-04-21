import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateBasketPriceSum } from "../actions/basketActions";
import '../styles/Order.css';
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { cancelOrder, confirmOrder } from "../actions/orderActions";


const Order = () => {
    const { state } = useLocation();

    const items = useSelector((state) => state.basket);
    const userGlobal = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const [user, setUser] = useState(userGlobal);

    const [order, setOrder] = useState({
        id: 0,
        date: new Date(),
        status: 'vahvistamaton',
        price: calculateBasketPriceSum(items),
        postage: 0,
        useEmail: false,
        usePhone: false,
        phone: user.phone,
        niteet: [],
    });


    useEffect(() => {
        setOrder({
            id: state.order.id,
            date: state.order.tilauspvm,
            status: state.order.tila,
            price: state.order.hinta,
            postage: state.order.postage,
            niteet: state.order.niteet,
            shipments: state.order.shipments,
        });
    }, [state])

  

    const handleChangePhone = (e) => {
        setUser({
            ...user,
            phone: e.target.value,
        })
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        await confirmOrder(order, dispatch, navigate); 
    };

    const handleCancelOrder = async (e) => {
        e.preventDefault();
        await cancelOrder(order, dispatch, navigate);
    };

    return (
        <div className="summary-card">
            <h4>Tilaustiedot</h4>
            <form className="form-grid">
                <section>
                    <h5>Tilaaja</h5>
                    <div className="summary-row">
                        <div>Nimi</div><div>{user.name}</div>
                    </div>
                    <div className="summary-row">
                        <div>Sähköposti</div><div>{user.email}</div>
                    </div>
                    <div className="summary-row">
                    <label htmlFor="input_phone">Puhelinnumero</label>

                    {order.usePhone ? (
                            <input
                                id="input-phone"
                                name="input-phone"
                                type="number"
                                value={user.phone}
                                required={order.usePhone}
                                onChange={handleChangePhone}
                            />
                        ) :
                        (
                            <div>{user.phone}</div>
                        )
                    }
                    </div>

                    <div className="summary-row">
                        <div>Postiosoite</div>
                        <div>{user.address}</div>
                    </div>
                </section>
                <section>
                    <h5>Tilaus</h5>



                    <div className="summary-row">
                        <div>Hinta</div>
                        <div>{order.price} €</div>
                    </div>

                    <div className="summary-row">
                        <div>Postikulut</div>
                        <div>{order.postage} €</div>
                    </div>
                    <div className="summary-row">
                        <div>Yht.</div><div>{(parseFloat(order.price) + order.postage).toFixed(2)} €</div>
                    </div>
                </section>
                <button className="button-primary" onClick={handleConfirmOrder}>Vahvista tilaus</button>
                <button className="button-secondary-light" onClick={handleCancelOrder}>Hylkää tilaus</button>
            </form>




        </div>
    );

};

export default Order;