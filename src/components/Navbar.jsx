import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';

function Navbar({ role, onSearch }) {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/books">Kirjat</Link></li>
        {role === "customer" && <li><Link to="/order">Ostoskori</Link></li>}
        {role === "admin" && <li><Link to="/addbook">Lisää kirja</Link></li>}
      </ul>
      <button onClick={() => dispatch(logout())}>Kirjaudu ulos</button>

      <input
        type="text"
        placeholder="Hae kirjoja..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
    </nav>
  );
}

export default Navbar;
