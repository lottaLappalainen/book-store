import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToOrder } from "../actions/orderActions";
import { setNotification } from "../actions/notificationActions";
import { fetchTypes } from "../actions/typesActions";
import { fetchCategories } from "../actions/categoriesActions";
import "../styles/Books.css";

const Search = ({role}) => {
  const [nimi, setNimi] = useState("");
  const [tekijä, setTekijä] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const books = useSelector((state) => state.books.books);
  const tyypit = useSelector((state) => state.types.types);
  const luokat = useSelector((state) => state.categories.categories);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTypes());
    dispatch(fetchCategories());
  }, [dispatch]);

  const normalizeText = (text) => text.toLowerCase().trim();

  const filteredBooks = books.filter((book) => {
    const bookNimi = book.nimi ? normalizeText(book.nimi) : "";
    const bookTekija = book.tekija ? normalizeText(book.tekija) : "";

    const bookTyyppi = tyypit.find((t) => t.id === book.tyyppiid)?.nimi || "";
    const bookLuokka = luokat.find((l) => l.id === book.luokkaid)?.nimi || "";

    return (
      (nimi ? bookNimi.includes(normalizeText(nimi)) : true) &&
      (tekijä ? bookTekija.includes(normalizeText(tekijä)) : true) &&
      (selectedType ? normalizeText(bookTyyppi) === normalizeText(selectedType) : true) &&
      (selectedCategory ? normalizeText(bookLuokka) === normalizeText(selectedCategory) : true)
    );
  });

  const handleAddToOrder = (book, e) => {
    e.stopPropagation();
    dispatch(addToOrder(book));
    dispatch(setNotification({ message: `"${book.nimi}" lisättiin ostoskoriin`, requestStatus: "success" }));
  };

  const calculatePrices = () => {
    const booksToCalculate = selectedCategory
      ? books.filter((book) => {
          const bookLuokka = luokat.find((l) => l.id === book.luokkaid)?.nimi || "";
          return normalizeText(bookLuokka) === normalizeText(selectedCategory);
        })
      : books;

    const totalPrice = booksToCalculate.reduce((sum, book) => {
      const price = parseFloat(book.hinta) || 0; // Ensure hinta is a valid number
      return sum + price;
    }, 0);

    const avgPrice = booksToCalculate.length > 0 ? (totalPrice / booksToCalculate.length).toFixed(2) : 0;

    return { totalPrice: totalPrice.toFixed(2), avgPrice }; // Format totalPrice to 2 decimal places
  };

  const { totalPrice, avgPrice } = calculatePrices();

  return (
    <div className="search-container">
      <h1>Hae tuotteita</h1>

      <div className="search-fields">
        <input type="text" placeholder="Kirjan nimi" value={nimi} onChange={(e) => setNimi(e.target.value)} />
        <input type="text" placeholder="Tekijä" value={tekijä} onChange={(e) => setTekijä(e.target.value)} />

        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Valitse tyyppi</option>
          {tyypit.map((tyyppi) => (
            <option key={tyyppi.id} value={tyyppi.nimi}>
              {tyyppi.nimi}
            </option>
          ))}
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Valitse luokka</option>
          {luokat.map((luokka) => (
            <option key={luokka.id} value={luokka.nimi}>
              {luokka.nimi}
            </option>
          ))}
        </select>
      </div>

      {role === "yllapitaja" && <div className="price-summary">
        <p><strong>Kokonaishinta:</strong> {totalPrice}</p>
        <p><strong>Keskihinta:</strong> {avgPrice}</p>
      </div>}

      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
              <h2>{book.nimi}</h2>
              <p><strong>Tekijä:</strong> {book.tekija}</p>
              <button onClick={(e) => handleAddToOrder(book, e)}>Lisää ostoskoriin</button>
            </div>
          ))
        ) : (
          <p>Ei tuloksia.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
