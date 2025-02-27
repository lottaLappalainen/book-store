import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToOrder } from "../actions/orderActions";
import { setNotification } from "../actions/notificationActions";
import "../styles/Books.css";

const Search = () => {
  const [nimi, setNimi] = useState("");
  const [tekijä, setTekijä] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const books = useSelector((state) => state.books.books);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const normalizeText = (text) => text.toLowerCase().trim();

  // Get unique categories (luokka) from books
  const uniqueCategories = [...new Set(books.map(book => book.luokka).filter(Boolean))];

  const filteredBooks = books.filter((book) =>
    (nimi ? normalizeText(book.nimi).includes(normalizeText(nimi)) : true) &&
    (tekijä ? normalizeText(book.tekijä).includes(normalizeText(tekijä)) : true) &&
    (selectedType ? normalizeText(book.tyyppi) === normalizeText(selectedType) : true) &&
    (selectedCategory ? normalizeText(book.luokka) === normalizeText(selectedCategory) : true)
  );

  const handleAddToOrder = (book, e) => {
    e.stopPropagation(); // Prevents clicking from triggering book navigation
    dispatch(addToOrder(book));
    dispatch(setNotification({ message: `"${book.nimi}" lisättiin ostoskoriin`, requestStatus: "success" }));
  };

  return (
    <div className="search-container">
      <h1>Hae tuotteita</h1>

      <div className="search-fields">
        <input type="text" placeholder="Kirjan nimi" value={nimi} onChange={(e) => setNimi(e.target.value)} />
        <input type="text" placeholder="Tekijä" value={tekijä} onChange={(e) => setTekijä(e.target.value)} />

        {/* Dropdown for "Tyyppi" */}
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">Valitse tyyppi</option>
          <option value="romaani">Romaani</option>
          <option value="kuvakirja">Kuvakirja</option>
          <option value="sarjakuva">Sarjakuva</option>
        </select>

        {/* Dynamic Dropdown for "Luokka" */}
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Valitse luokka</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
              <h2>{book.nimi}</h2>
              <p><strong>Tekijä:</strong> {book.tekijä}</p>
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
