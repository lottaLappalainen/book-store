import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { setNotification } from '../actions/notificationActions';
import '../styles/Books.css';

const Books = ({ searchQuery }) => {
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();

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

  const normalizedQuery = searchQuery.toLowerCase();

  //kirjat filtteröidään haun perusteella, joka voi kohdistua nimeen tekijään tyyppiin tai luokkaan
  const filteredBooks = books.filter(book =>
    book.nimi.toLowerCase().includes(normalizedQuery) ||
    book.tekijä.toLowerCase().includes(normalizedQuery) ||
    book.tyyppi.toLowerCase().includes(normalizedQuery) ||
    book.luokka.toLowerCase().includes(normalizedQuery)
  );

  return (
    <div className="book-container">
      <h1>Book Store</h1>
      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <h2>{book.nimi}</h2>
              <p><strong>Tekijä:</strong> {book.tekijä}</p>
              <p><strong>Tyyppi:</strong> {book.tyyppi}</p>
              <p><strong>Luokka:</strong> {book.luokka}</p>
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
