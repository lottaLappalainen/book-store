
export const FETCH_BOOKS = 'FETCH_BOOKS'
export const FETCH_BOOK = 'FETCH_BOOK'
export const ADD_BOOK = 'ADD_BOOK'

export const fetchBooks = () => async (dispatch) => {
    try {
      const response = await fetch('/books.json');
      const data = await response.json();
  
      dispatch({ type: 'FETCH_BOOKS', payload: data });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
  
  export const fetchBookById = (id) => async (dispatch) => {
    try {
      const response = await fetch('/books.json');
      const data = await response.json();
      const book = data.find((b) => b.id === Number(id));
  
      dispatch({ type: 'FETCH_BOOK', payload: book });
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };
  
  export const addBook = (book) => (dispatch) => {
    dispatch({ type: 'ADD_BOOK', payload: book });
  };
  