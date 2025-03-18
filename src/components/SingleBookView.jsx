import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../actions/notificationActions';
import { addToOrder } from '../actions/orderActions';
import { fetchBookById } from '../actions/booksActions';

const SingleBookView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const book = useSelector((state) => state.books.selectedBook);

  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  const handleAddToOrder = () => {
    dispatch(addToOrder(book));
    dispatch(setNotification({ message: `"${book.nimi}" lisättiin tilaukseen`, requestStatus: 'success' }));
  };

  if (!book) return <p>Kirjan tietoja ladataan...</p>;
  console.log("book", book)
  return (
    <div className="single-book-container">
      <h1>{book.nimi}</h1>
      <p><strong>Tekijä:</strong> {book.tekija}</p>
      <p><strong>Isbn:</strong> {book.isbn}</p>
      <p><strong>Tyyppi:</strong> {book.tyyppi}</p>
      <p><strong>Luokka:</strong> {book.luokka}</p>
      <button onClick={handleAddToOrder}>Lisää ostoskoriin</button>
    </div>
  );
};

export default SingleBookView;
