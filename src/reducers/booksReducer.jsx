import { FETCH_BOOKS, FETCH_BOOK, ADD_BOOK, ADD_TEOS_D1, ADD_TEOS_D2, SYNC_DIVARIT } from '../actions/booksActions';

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
    case ADD_TEOS_D1:
    case ADD_TEOS_D2:
      return { ...state, books: [...state.books, action.payload] };

    case SYNC_DIVARIT:
      return state;

    default:
      return state;
  }
};

export default booksReducer;
