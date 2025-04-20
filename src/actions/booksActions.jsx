import { setNotification } from '../actions/notificationActions';

export const FETCH_BOOKS = 'FETCH_BOOKS';
export const FETCH_BOOK = 'FETCH_BOOK';
export const ADD_BOOK = 'ADD_BOOK';
export const ADD_TEOS_D1 = 'ADD_TEOS_D1';
export const ADD_TEOS_D2 = 'ADD_TEOS_D2';

const API_URL = `http://tie-tkannat.it.tuni.fi:${import.meta.env.VITE_SERVER_PORT}/api`;
export const SYNC_DIVARIT  = 'SYNC_DIVARIT';


export const fetchBooks = () => async (dispatch) => {
    dispatch(setNotification({ message: 'Haetaan kirjoja...', requestStatus: 'loading' }));
    try {
        const response = await fetch(`${API_URL}/teos`);
        const data = await response.json();
        dispatch({ type: FETCH_BOOKS, payload: data });
        dispatch(setNotification({ message: 'Kirjat haettu onnistuneesti', requestStatus: 'success' }));
    } catch (error) {
        dispatch(setNotification({ message: 'Virhe kirjojen haussa', requestStatus: 'error' }));
        console.error('Error fetching books:', error);
    }
};

// Hakee yksittäisen kirjan ID:llä
export const fetchBookById = (id) => async (dispatch) => {
    dispatch(setNotification({ message: 'Haetaan kirjaa...', requestStatus: 'loading' }));
    try {
        const response = await fetch(`${API_URL}/teos/${id}`);
        const data = await response.json();
        dispatch({ type: FETCH_BOOK, payload: data });
        dispatch(setNotification({ message: 'Kirja haettu onnistuneesti', requestStatus: 'success' }));
    } catch (error) {
        dispatch(setNotification({ message: 'Virhe kirjan haussa', requestStatus: 'error' }));
        console.error('Error fetching book:', error);
    }
};

// Lisää uusi kirja divariin D1
export const addTeosToD1 = (book) => async (dispatch) => {
    dispatch(setNotification({ message: 'Lisätään teosta...', requestStatus: 'loading' }));
    try {
        const response = await fetch(`${API_URL}/divari/teos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book),
        });
        const data = await response.json();
        dispatch({ type: ADD_TEOS_D1, payload: data });
        dispatch(setNotification({ message: 'Teos lisätty onnistuneesti', requestStatus: 'success' }));
    } catch (error) {
        dispatch(setNotification({ message: 'Virhe teoksen lisäyksessä', requestStatus: 'error' }));
        console.error('Error adding book to D1:', error);
    }
};

// Lisää olemassa olevan kirjan divariin D2
export const addTeosToD2 = (teosId, divariId, ostohinta) => async (dispatch) => {
    dispatch(setNotification({ message: 'Lisätään teosta...', requestStatus: 'loading' }));
    try {
        const response = await fetch(`${API_URL}/divari/nide`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teosId, divariId, ostohinta }),
        });
        const data = await response.json();
        dispatch({ type: ADD_TEOS_D2, payload: data });
        dispatch(setNotification({ message: 'Teos lisätty onnistuneesti', requestStatus: 'success' }));
    } catch (error) {
        dispatch(setNotification({ message: 'Virhe teoksen lisäyksessä', requestStatus: 'error' }));
        console.error('Error adding book to D2:', error);
    }
};

export const syncDivaris = () => async (dispatch) => {
    dispatch(setNotification({ message: 'Synkataan divareita...', requestStatus: 'loading' }));
    try {
        const response = await fetch(`${API_URL}/sync`);
        const data = await response.json();
        dispatch({ type: SYNC_DIVARIT, payload: data });
        dispatch(setNotification({ message: 'Divarit synkattu onnistuneesti', requestStatus: 'success' }));
    } catch (error) {
        dispatch(setNotification({ message: 'Virhe divareitten synkkauksessa', requestStatus: 'error' }));
        console.error('Error updating divari:', error);
    }
};