import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';
import { syncDivaris } from "../actions/booksActions";
import '../styles/Navbar.css';

function Navbar({ role }) {
  const dispatch = useDispatch();

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/books">Kirjat</Link></li>
          <li><Link to="/search">Hae tuotteita</Link></li> 
          {(role === "asiakas") && <li><Link to="/order">Ostoskori</Link></li>}
          {(role === "yllapitaja") && <li><Link to="/addbook">Lisää kirja</Link></li>}
        </ul>
        <button className="button-secondary button-small" onClick={() => dispatch(logout())}>Kirjaudu ulos</button>
      </nav>
    </div>
  );
}

export default Navbar;
