export const FETCH_BOOKS = 'FETCH_BOOKS';
export const FETCH_BOOK = 'FETCH_BOOK';
export const ADD_BOOK = 'ADD_BOOK';

export const fetchBooks = () => async (dispatch) => {
    try {
        const response = await fetch('http://tie-tkannat.it.tuni.fi:8069/api/teos'); 
        const data = await response.json();

        dispatch({ type: FETCH_BOOKS, payload: data });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
};

export const fetchBookById = (id) => async (dispatch) => {
    try {
        const response = await fetch(`http://tie-tkannat.it.tuni.fi:8069/api/teos/${id}`); 
        const data = await response.json();

        dispatch({ type: FETCH_BOOK, payload: data });
    } catch (error) {
        console.error('Error fetching book:', error);
    }
};

export const addBook = (book) => async (dispatch) => {
    try {
        const response = await fetch('http://tie-tkannat.it.tuni.fi:8069/api/teos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        });

        const data = await response.json();
        dispatch({ type: ADD_BOOK, payload: data });
    } catch (error) {
        console.error('Error adding book:', error);
    }
};
