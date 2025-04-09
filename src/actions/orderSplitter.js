
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

    return orders;
};

export default orderSplitter;