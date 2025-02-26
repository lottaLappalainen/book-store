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

  useEffect(() => {
    fetch('/books.json') 
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        dispatch(setNotification({ message: 'Fetching books was successful', requestStatus: 'success' }));
      })
      .catch(error => dispatch(setNotification({ message: error.message, requestStatus: 'error' })));
  }, []);

  const normalizeText = (text) => text.toLowerCase().trim();

  //tehtävänannossa kohta r4
  const rankByRelevance = (books, query) => {
    const trimmedQuery = query.trim(); 
    return books
      .map((book) => {
        const titleWords = normalizeText(book.nimi).split(/\s+/);
        const queryWords = trimmedQuery.split(/\s+/);
        let fullMatches = 0;
        let partialMatches = 0;

        queryWords.forEach((q) => {
          if (titleWords.includes(q)) fullMatches++;
          else if (titleWords.some((word) => word.includes(q))) partialMatches++;
        });

        return { ...book, score: fullMatches * 2 + partialMatches };
      })
      .sort((a, b) => b.score - a.score);
  };

  const trimmedSearchQuery = normalizeText(searchQuery);

  const filteredBooks = books.filter(book =>
    normalizeText(book.nimi).includes(trimmedSearchQuery) ||
    normalizeText(book.tekijä).includes(trimmedSearchQuery) ||
    normalizeText(book.tyyppi).includes(trimmedSearchQuery) ||
    normalizeText(book.luokka).includes(trimmedSearchQuery)
  );

  const sortedBooks = rankByRelevance(filteredBooks, trimmedSearchQuery);

  const handleAddToOrder = (book) => {
    dispatch(addToOrder(book));
    dispatch(setNotification({ message: `"${book.nimi}" added to your order`, requestStatus: 'success' }));
  };

  return (
    <div className="book-container">
      <h1>Book Store</h1>
      <div className="books-grid">
        {sortedBooks.length > 0 ? (
          sortedBooks.map(book => (
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
