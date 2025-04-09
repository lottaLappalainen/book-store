import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../actions/notificationActions";
import { addToBasket } from "../actions/basketActions";
import { fetchBookById } from "../actions/booksActions";
import { fetchTypes } from "../actions/typesActions";
import { fetchCategories } from "../actions/categoriesActions";

const SingleBookView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const book = useSelector((state) => state.books.selectedBook);
  const tyypit = useSelector((state) => state.types.types);
  const luokat = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchBookById(id));
    dispatch(fetchTypes());
    dispatch(fetchCategories());
  }, [dispatch, id]);

  const bookTyyppi = tyypit.find((t) => t.id === book?.tyyppiid)?.nimi || "Tuntematon";
  const bookLuokka = luokat.find((l) => l.id === book?.luokkaid)?.nimi || "Tuntematon";

  const handleAddToBasket = () => {
    dispatch(addToBasket(book));
    dispatch(setNotification({ message: `"${book.nimi}" lisättiin ostoskoriin`, requestStatus: "success" }));
  };

  if (!book) return <p>Kirjan tietoja ladataan...</p>;

  return (
    <div className="single-book-container">
      <h1>{book.nimi}</h1>
      <p><strong>Tekijä:</strong> {book.tekija}</p>
      {book.isbn && <p><strong>Isbn:</strong> {book.isbn}</p>} 
      <p><strong>Tyyppi:</strong> {bookTyyppi}</p>
      <p><strong>Luokka:</strong> {bookLuokka}</p>
      <button onClick={handleAddToBasket}>Lisää ostoskoriin</button>
    </div>
  );
};

export default SingleBookView;
