import { setNotification } from './notificationActions';

export const ADD_DIVARI_TO_KESKUSDIVARI = 'ADD_DIVARI_TO_KESKUSDIVARI';
export const ADD_DIVARI_TO_KESKUSDIVARI_ERROR = 'ADD_DIVARI_TO_KESKUSDIVARI_ERROR';
export const ADD_DIVARI_WITH_OMA_TIETOKANTA = 'ADD_DIVARI_WITH_OMA_TIETOKANTA';
export const ADD_DIVARI_WITH_OMA_TIETOKANTA_ERROR = 'ADD_DIVARI_WITH_OMA_TIETOKANTA_ERROR';
export const PROCESS_XML = 'PROCESS_XML';
export const PROCESS_XML_ERROR = 'PROCESS_XML_ERROR';

const API_URL = `http://tie-tkannat.it.tuni.fi:${import.meta.env.VITE_SERVER_PORT}/api`;

// Add a divari to keskusdivari.Divari
export const addDivariToKeskusdivari = (divariData) => async (dispatch) => {
    dispatch(setNotification({ message: 'Lisätään divaria keskusdivariin...', requestStatus: 'loading' }));
    try {
        const response = await fetch(`${API_URL}/keskusdivari/divari`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(divariData),
        });
        const data = await response.json();
        dispatch({ type: ADD_DIVARI_TO_KESKUSDIVARI, payload: data });
        dispatch(setNotification({ message: 'Divari lisätty keskusdivariin onnistuneesti', requestStatus: 'success' }));
    } catch (error) {
        dispatch(setNotification({ message: 'Virhe divarin lisäyksessä keskusdivariin', requestStatus: 'error' }));
        console.error('Error adding divari to keskusdivari:', error);
        dispatch({ type: ADD_DIVARI_TO_KESKUSDIVARI_ERROR, payload: error.message });
    }
};

// Add a divari with oma tietokanta (to both keskusdivari.Divari and divari.DivariInfo)
export const addDivariWithOmaTietokanta = (divariData) => async (dispatch) => {
    dispatch(setNotification({ message: 'Lisätään divaria omaan tietokantaan...', requestStatus: 'loading' }));
    try {
        const response = await fetch(`${API_URL}/divari/oma-tietokanta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(divariData),
        });
        const data = await response.json();
        dispatch({ type: ADD_DIVARI_WITH_OMA_TIETOKANTA, payload: data });
        dispatch(setNotification({ message: 'Divari omalla kannalla lisätty onnistuneesti', requestStatus: 'success' }));
    } catch (error) {
        dispatch(setNotification({ message: 'Virhe divarin lisäyksessä omalla tietokannalla', requestStatus: 'error' }));
        console.error('Error adding divari with oma tietokanta:', error);
        dispatch({ type: ADD_DIVARI_WITH_OMA_TIETOKANTA_ERROR, payload: error.message });
    }
};

export const processXmlAndAddDivari = (xmlFile, divariInfo) => async (dispatch) => {
    dispatch(setNotification({ message: 'Käsitellään XML-tiedostoa...', requestStatus: 'loading' }));
    try {
        const text = await xmlFile.text();
        const response = await fetch(`${API_URL}/upload-xml`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xml: text, divari: divariInfo }),
        });

        if (!response.ok) {
            throw new Error('Virhe XML-tiedoston käsittelyssä!');
        }

        const data = await response.json();
        dispatch({ type: PROCESS_XML, payload: data });
        dispatch(setNotification({ message: 'XML-tiedosto käsitelty onnistuneesti', requestStatus: 'success' }));
    } catch (error) {
        console.error('Error processing XML file:', error);
        dispatch(setNotification({ message: 'Virhe XML-tiedoston käsittelyssä', requestStatus: 'error' }));
        dispatch({ type: PROCESS_XML_ERROR, payload: error.message });
    }
};