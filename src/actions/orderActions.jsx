import { API_URL } from "../utils/consts";
import { setNotification } from '../actions/notificationActions';
import { clearBasket } from "./basketActions";

const orderSplitter = (items, maxWeight) => {
    //laske tilauksen kok.paino
    let totalWeight = 0;
    items.forEach(item => {
        totalWeight += item.quantity * item.paino;
    });
    
    const itemArr = [];

    items.forEach((item) => {
        for (let i = 0; i<item.quantity; i++) itemArr.push(item);
    })

    itemArr.sort((a, b) => b.paino - a.paino);
    
    const orders = [];

    let currOrder = [];
    let currOrderWeight = 0;
    
    while (itemArr.length > 0) {
        const nextItem = itemArr[0];

        //Tilauksen paino ylittymässä --> lisää uusi tilaus
        if (currOrderWeight + nextItem.paino > maxWeight) {
            orders.push(currOrder);
            currOrderWeight = 0;
            currOrder = [];
            continue;
        };

        //Siirrä nide nykyiseen tilaukseen
        currOrderWeight += nextItem.paino;
        currOrder.push(itemArr.splice(0, 1)[0]);

        //Jos viimeinen nide --> lisää nykyinen tilaus
        if (!itemArr[1]) {
            orders.push(currOrder);
            currOrder = [];
            currOrderWeight = 0;
        };
    };
    console.log("asd",orders)
    return orders;
};

function findClosestHintaByPaino(arr, target) {
    if (!arr.length) return null;
  
    const closestItem = arr.reduce((closest, item) => {
      const currDiff = Math.abs(item.max_paino - target);
      const closestDiff = Math.abs(closest.max_paino - target);
      return currDiff < closestDiff ? item : closest;
    });
  
    return closestItem.hinta;
}

export const getPostikulutaulukkoValues = async () => {
    try {
        const response = await fetch(`${API_URL}/postikulut`);
        return response.json();
    } catch (error) {
        console.error("Error fetching postikulutaulukko: ", error);
        throw error;
    }
};

export const initializeOrder = async (items, userId, dispatch) => {
    dispatch(setNotification({ message: 'Tehdään tilausta...', requestStatus: 'loading' }));
    const bodyJSON = JSON.stringify({
        userId: userId,
        items: items,
    });

    try {
        const response = await fetch(`${API_URL}/tilaa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyJSON,
        });

        if (!response.ok) {
            dispatch(setNotification({ message: 'Virhe tilausta tehdessä', requestStatus: 'error' }));
            throw new Error('Virhe tilausta tehdessä');
        }

        const order = await response.json();
        const postages = await getPostikulutaulukkoValues();

        const max = postages.reduce(
            (max, item) => (item.max_paino > max.max_paino ? item : max),
            postages[0]
        );

        const tempOrders = orderSplitter(items, max.max_paino);
        let tempPostage = 0;
        

        tempOrders.forEach((item, index) => {
            
            if (index === tempOrders.length - 1) {
                item.postikulut = findClosestHintaByPaino(postages, item.paino);
            } else {
                item.postikulut = max.hinta;
            }

            tempPostage += parseFloat(item.postikulut);
        });

        const output = {
            ...order,
            postage: tempPostage,
            shipmentCount: tempOrders.length,
            shipments: tempOrders,
        };
        dispatch(setNotification({ message: 'Tilaus tehty onnistuneesti', requestStatus: 'success' }));
        return output; 
    } catch (error) {
        dispatch(setNotification({ message: 'Virhe tilausta tehdessä', requestStatus: 'error' }));
        console.log("Virhe tilausta tehdessä", error);
        throw error;
    }
};

export const confirmOrder = async (order, dispatch, navigate) => {
    dispatch(setNotification({ message: 'Vahvistetaan tilausta...', requestStatus: 'loading' }));
   const tempShipments = [];

   order.shipments.forEach((item) => {
    tempShipments.push({
        items: item,
        postikulut: item.postikulut,
    });
   });

    
    const requestBody = JSON.stringify({
        id: order.id,
        niteet: order.niteet,
        shipments: tempShipments,
    });

    try {
        //päivitä keskusdivarin kantaan
        const response = await fetch(`${API_URL}/vahvista`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody,
        });
        if (!response.ok) throw new Error('Virhe vahvistettaessa tilausta');

        dispatch(setNotification({ message: 'Tilaus vahvistettu', requestStatus: 'success' }));
        dispatch(clearBasket());
        navigate('/books');
    } catch (error) {
        console.log("Virhe vahvistettaessa tilausta", error);
        throw error;
    };
};

export const cancelOrder = async (order, dispatch, navigate) => {
    dispatch(setNotification({ message: 'Hylätään tilausta...', requestStatus: 'loading' }));
    const requestBody = JSON.stringify({
        id: order.id,
        niteet: order.niteet,
    });
    try {
        const response = await fetch(`${API_URL}/hylkaa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody,
        })
        if (!response.ok) throw new Error('Virhe tilausta peruttaessa');
        dispatch(setNotification({ message: 'Tilaus peruttu', requestStatus: 'success' }));
        navigate('/basket');
    } catch (error) {
        console.log("Virhe tilausta peruttaessa", error);
        throw error;
    }
};
