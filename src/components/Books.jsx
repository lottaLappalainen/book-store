import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNotification } from '../actions/notificationActions';
import { addToOrder } from '../actions/orderActions';
import { fetchBooks } from '../actions/booksActions';
import '../styles/Books.css';

const Books = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const books = useSelector((state) => state.books.books);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(setNotification({ message: 'Kirjat haettu onnistuneesti', requestStatus: 'success' }));
  }, [dispatch]);

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
    dispatch(setNotification({ message: `"${book.nimi}" lisättiin ostoskoriin`, requestStatus: 'success' }));
  };

  return (
    <div className="book-container">
      <h1>Kirjat</h1>
      <div className="books-grid">
        {sortedBooks.length > 0 ? (
          sortedBooks.map(book => (
            <div key={book.id} className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
              <h2>{book.nimi}</h2>
              <p><strong>Tekijä:</strong> {book.tekija}</p>
              <button onClick={(e) => { e.stopPropagation(); handleAddToOrder(book); }}>
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
