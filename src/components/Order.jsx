import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { calculateBasketPriceSum } from "../actions/basketActions";
import '../styles/order.css';
import { confirmOrder, getPostikulutaulukkoValues } from "../actions/orderActions";
import { useLocation } from "react-router-dom";


const Order = () => {
    const { state } = useLocation();


    const items = useSelector((state) => state.basket);
    const userGlobal = useSelector((state) => state.user);

    
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

    const handleConfirmOrder = async () => {
        console.log(order)
        await confirmOrder(order);
    };

    return (
        <div className="summary-card">
            <h4>Tilaustiedot</h4>
            <form>
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
                        <div>{order.price}</div>
                    </div>
                    
                    <div className="summary-row">
                        <div>Postikulut</div>
                        <div>{order.postage}</div>
                    </div>
                    <div className="summary-row">
                        <div>Yht.</div><div>{parseFloat(order.price) + order.postage}</div>
                    </div>
                </section>
                
            </form>
            <button className="button-primary" onClick={handleConfirmOrder}>Vahvista tilaus</button>
           
            
            
        </div>
    );

};

export default Order;