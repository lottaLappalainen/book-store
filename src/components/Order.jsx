import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { calculateBasketPriceSum } from "../actions/basketActions";
import '../styles/Order.css';
import { getPostikulutaulukkoValues } from "../actions/orderActions";
import orderSplitter from "../actions/orderSplitter";
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

   const [orderItems, setOrderItems] = useState();

    //Hae postikulutaulukko ja laske tilauksen kok.paino
    useEffect(() => {
        const getPostikulutaulukko = async () => {
            try {
                const data = await getPostikulutaulukkoValues();
                setPostikulutaulukko(data);
            } catch (err) {
                console.log(err)
            }
        }
        getPostikulutaulukko();

    }, []);


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

   /*
    function findClosestHintaByPaino(arr, target) {
        if (!arr.length) return null;

        const closestItem = arr.reduce((closest, item) => {
          const currDiff = Math.abs(item.max_paino - target);
          const closestDiff = Math.abs(closest.max_paino - target);
          return currDiff < closestDiff ? item : closest;
        });

        return closestItem.hinta;
    }

    useEffect(() => {
        if (postikulutaulukko) {
            console.log(items)
            let weight = 0;
            items.forEach(item => {
                weight = weight+item.paino*item.quantity;
            });
            setOrderWeight(weight);

            const max = postikulutaulukko.reduce(
                (max, item) => (item.max_paino > max.max_paino ? item : max), postikulutaulukko[0]
            );

            const tempOrders = orderSplitter(items, max.max_paino);
            let tempPostage = 0;
            tempOrders.forEach((order, index) => {
                if (index === tempOrders.length - 1) order.postikulut = findClosestHintaByPaino(postikulutaulukko, order.paino);
                else order.postikulut = max.hinta;

                tempPostage += parseFloat(order.postikulut);
            });
            setOrderItems(tempOrders);
            setOrderPostage(tempPostage);
        }
    }, [postikulutaulukko]);
   */



    const handleUseEmail = () => {
        setOrder({
            ...order,
            useEmail: !order.useEmail,
        });
    };

    const handleUsePhone = () => {
        setOrder({
            ...order,
            usePhone: !order.usePhone,
        });
    };

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




        </div>
    );

};

export default Order;