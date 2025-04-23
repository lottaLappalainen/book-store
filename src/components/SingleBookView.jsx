import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../actions/notificationActions";
import { addToBasket } from "../actions/basketActions";
import { fetchBookById } from "../actions/booksActions";
import { fetchTypes } from "../actions/typesActions";
import { fetchCategories } from "../actions/categoriesActions";
import "../styles/Singlebook.css"; 
import bookImage from "../assets/book.png";

const SingleBookView = ({role}) => {
  const { id } = useParams(); // get the book ID from the URL
  const dispatch = useDispatch();

  const book = useSelector((state) => state.books.selectedBook);
  const tyypit = useSelector((state) => state.types.types);
  const luokat = useSelector((state) => state.categories.categories);
  const basket = useSelector((state) => state.basket);

  useEffect(() => {
    dispatch(fetchBookById(id));
    dispatch(fetchTypes());
    dispatch(fetchCategories());
  }, [dispatch, id]);

  // grab book type and category names or fall back to "Tuntematon" if not found
  const bookTyyppi = tyypit.find((t) => t.id === book?.tyyppiid)?.nimi || "Tuntematon";
  const bookLuokka = luokat.find((l) => l.id === book?.luokkaid)?.nimi || "Tuntematon";

  const handleAddToBasket = () => {
    dispatch(addToBasket(book)); 
    dispatch(setNotification({ message: `"${book.nimi}" lisättiin ostoskoriin`, requestStatus: "success" }));
  };

  // check how many copies are already in the basket
  const itemInBasket = basket.find((item) => item.id === book?.id);
  const basketQuantity = itemInBasket?.quantity || 0;
  const canAddToBasket = book?.kpl > basketQuantity; // make sure there's still availability

  if (!book) return <p>Kirjan tietoja ladataan...</p>; // show loading state if book isn't ready yet

  return (
    <div className="single-book-container">
      <img src={bookImage} alt="Book Cover" className="book-image" />
      <div className="book-details">
        <h1>{book.nimi}</h1>
        <h4>Tekijä: <em>{book.tekija}</em></h4>
        {book.isbn && <p><strong>Isbn:</strong> {book.isbn}</p>}
        <p><strong>Tyyppi:</strong> {bookTyyppi}</p>
        <p><strong>Luokka:</strong> {bookLuokka}</p>
        <p><strong>Saatavilla:</strong> {book.kpl - basketQuantity} / {book.kpl}</p>

        {/* only allow non-admins to add books to the basket */}
        {role !== "yllapitaja" && (
          book.kpl > 0 && canAddToBasket ? (
            <button onClick={handleAddToBasket}>Lisää ostoskoriin</button>
          ) : (
            <button disabled>
              {book.kpl === 0 ? "Ei saatavilla" : "Niteitä ei ole saatavilla"}
            </button>
          )
        )}
      </div> 
    </div>
  );
};

export default SingleBookView;
