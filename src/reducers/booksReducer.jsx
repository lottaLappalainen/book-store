import { FETCH_BOOKS, FETCH_BOOK, ADD_BOOK } from '../actions/booksActions';

const initialState = {
  books: [],
  selectedBook: null,
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOKS:
      return { ...state, books: action.payload };

    case FETCH_BOOK:
      return { ...state, selectedBook: action.payload };

    case ADD_BOOK:
      return { ...state, books: [...state.books, action.payload] };

    default:
      return state;
  }
};

export default booksReducer;
