import { API_URL } from "../utils/consts";
import { setNotification } from "./notificationActions";

const exportToCsv = (response) => {

    const headers = Object.keys(response[0]);

        const rows = [
            headers.join(';'),
            ...response.map(row => 
                headers.map(field => 
                    JSON.stringify(row[field] ?? '')
                ).join(';')
            )
        ];

        const csvContent = rows.join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv; charset=utf-8' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'kayttajat_tilaukset.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
};

export const downloadUserOrdersCsv =  async (dispatch) => {
    dispatch(setNotification({ message: 'Ladataan raporttia...', requestStatus: 'loading' }));
    try {
        await fetch(`${API_URL}/kayttajatilaukset`, {
            method: 'GET',
            cache: 'no-store'
        })
        .then(res => res.json())
        .then(data => exportToCsv(data));

    } catch (error) {
        dispatch(setNotification({ message: "Virhe raporttia luotaessa", requestStatus: 'error'}));
        console.log("Virhe raporttia luotaessa", error);
    };
};