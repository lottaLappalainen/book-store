import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar({ role, onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/books">Books</Link></li>
        {role === "customer" && <li><Link to="/order">Order</Link></li>}
        {role === "admin" && <li><Link to="/addbook">Add a Book</Link></li>}
      </ul>

      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
    </nav>
  );
}

export default Navbar;
