import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import { setNotification } from '../actions/notificationActions';
import { addToOrder } from '../actions/orderActions';
import '../styles/Books.css';

const Books = ({ searchQuery }) => {
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //tilapäinen kirjojen data hakutoiminto
  useEffect(() => {
    fetch('/books.json') 
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        dispatch(setNotification({ message: 'Fetching books was successful', requestStatus: 'success' }));
      })
      .catch(error => dispatch(setNotification({ message: error.message, requestStatus: 'error' })));
  }, []);

  const normalizedQuery = searchQuery;

  //kirjat filtteröidään haun perusteella, joka voi kohdistua nimeen tekijään tyyppiin tai luokkaan
  const filteredBooks = books.filter(book =>
    book.nimi.toLowerCase().includes(normalizedQuery) ||
    book.tekijä.toLowerCase().includes(normalizedQuery) ||
    book.tyyppi.toLowerCase().includes(normalizedQuery) ||
    book.luokka.toLowerCase().includes(normalizedQuery)
  );

  const handleAddToOrder = (book) => {
    dispatch(addToOrder(book));
    dispatch(setNotification({ message: `"${book.nimi}" added to your order`, requestStatus: 'success' }));
  };

  return (
    <div className="book-container">
      <h1>Book Store</h1>
      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book.id} className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
              <h2>{book.nimi}</h2>
              <p><strong>Tekijä:</strong> {book.tekijä}</p>
              <button onClick={(e) => { e.stopPropagation(); handleAddToOrder(book); }}>
                Add to Order
              </button>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Books;
