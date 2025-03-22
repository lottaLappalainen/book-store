import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNotification } from '../actions/notificationActions';
import { addToOrder } from '../actions/orderActions';
import { fetchBooks } from '../actions/booksActions';
import '../styles/Books.css';

const Books = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const books = useSelector((state) => state.books.books);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(setNotification({ message: 'Kirjat haettu onnistuneesti', requestStatus: 'success' }));
  }, [dispatch]);

  const handleAddToOrder = (book) => {
    dispatch(addToOrder(book));
    dispatch(setNotification({ message: `"${book.nimi}" lisättiin ostoskoriin`, requestStatus: 'success' }));
  };

  return (
    <div className="book-container">
      <h1>Kirjat</h1>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map(book => (
            <div key={book.id} className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
              <h2>{book.nimi}</h2>
              <p><strong>Tekijä:</strong> {book.tekija}</p>
              <button className='button-secondary' onClick={(e) => { e.stopPropagation(); handleAddToOrder(book); }}>
                Lisää ostoskoriin
              </button>
            </div>
          ))
        ) : (
          <p>Kirjoja ei löytynyt.</p>
        )}
      </div>
    </div>
  );
};

export default Books;
