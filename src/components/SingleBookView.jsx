import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setNotification } from '../actions/notificationActions';
import { addToOrder } from '../actions/orderActions';

const SingleBookView = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('/books.json')
      .then((response) => response.json())
      .then((data) => {
        const foundBook = data.find((book) => book.id === Number(id));
        setBook(foundBook);
      })
      .catch((error) => dispatch(setNotification({ message: error.message, requestStatus: 'error' })));
  }, [id]);

  const handleAddToOrder = () => {
    dispatch(addToOrder(book));
    dispatch(setNotification({ message: `"${book.nimi}" added to your order`, requestStatus: 'success' }));
  };

  if (!book) return <p>Loading book details...</p>;

  return (
    <div className="single-book-container">
      <h1>{book.nimi}</h1>
      <p>
        <strong>Tekijä:</strong> {book.tekijä}
      </p>
      <p>
        <strong>Tyyppi:</strong> {book.tyyppi}
      </p>
      <p>
        <strong>Luokka:</strong> {book.luokka}
      </p>
      <button onClick={handleAddToOrder}>Add to Order</button>
    </div>
  );
};

export default SingleBookView;
