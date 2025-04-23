import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTypes } from "../actions/typesActions";
import { fetchCategories } from "../actions/categoriesActions";
import "../styles/Books.css";
import "../styles/Search.css";

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

  // This handles relevance scoring based on how well book title matches search words
  const getRelevanceScore = (title, searchWords) => {
    const titleWords = title.toLowerCase().split(/\s+/);
    let score = 0;
  
    for (const word of searchWords) {
      let matched = false;
  
      // Full word match gives more points
      for (const titleWord of titleWords) {
        if (titleWord === word) {
          score += 2; // full word match gets higher weight
          matched = true;
          break;
        }
      }
  
      // Partial match still counts, just less
      if (!matched && title.includes(word)) {
        score += 1; // partial match
      }
    }
  
    return score;
  };
  
  const filteredBooks = books
    .map((book) => {
      const bookNimi = book.nimi ? normalizeText(book.nimi) : "";
      const bookTekija = book.tekija ? normalizeText(book.tekija) : "";
      const bookTyyppi = tyypit.find((t) => t.id === book.tyyppiid)?.nimi || "";
      const bookLuokka = luokat.find((l) => l.id === book.luokkaid)?.nimi || "";

      const nameWords = normalizeText(nimi).split(/\s+/).filter(Boolean);
      const relevance = nimi ? getRelevanceScore(bookNimi, nameWords) : 0;

      const authorMatch = tekijä ? bookTekija.includes(normalizeText(tekijä)) : true;
      const typeMatch = selectedType ? normalizeText(bookTyyppi) === normalizeText(selectedType) : true;
      const categoryMatch = selectedCategory ? normalizeText(bookLuokka) === normalizeText(selectedCategory) : true;

      return {
        ...book,
        relevance,
        match:
          (!nimi || relevance > 0) &&
          (!tekijä || authorMatch) &&
          (!selectedType || typeMatch) &&
          (!selectedCategory || categoryMatch)
      };
    })
    .filter(book => book.match)
    .sort((a, b) => b.relevance - a.relevance); // sort so most relevant results are at the top

  // Just calculates total and average price of books in the selected category
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

    return { totalPrice: totalPrice.toFixed(2), avgPrice }; 
  };

  const { totalPrice, avgPrice } = calculatePrices();

  return (
    <div className="search-container">
      <h1>Hae tuotteita</h1>

      <div className="search-fields">
          <input
              type="text"
              placeholder="Kirjan nimi"
              value={nimi}
              onChange={(e) => setNimi(e.target.value)}
              className="form-input"
          />
          <input
              type="text"
              placeholder="Tekijä"
              value={tekijä}
              onChange={(e) => setTekijä(e.target.value)}
              className="form-input"
          />

          <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-input"
          >
              <option value="">Valitse tyyppi</option>
              {tyypit.map((tyyppi) => (
                  <option key={tyyppi.id} value={tyyppi.nimi}>
                      {tyyppi.nimi}
                  </option>
              ))}
          </select>

          <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
          >
              <option value="">Valitse luokka</option>
              {luokat.map((luokka) => (
                  <option key={luokka.id} value={luokka.nimi}>
                      {luokka.nimi}
                  </option>
              ))}
          </select>
      </div>

      {/* Show price summary only when category is selected and no search is active */}
      {selectedCategory && !nimi && !tekijä && !selectedType && (
        <div className="price-summary">
          <p><strong>Kokonaishinta:</strong> {totalPrice}€</p>
          <p><strong>Keskihinta:</strong> {avgPrice}€</p>
        </div>
      )}

      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
              <h2>{book.nimi}</h2>
              <p><strong>Tekijä:</strong> {book.tekija}</p>
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
