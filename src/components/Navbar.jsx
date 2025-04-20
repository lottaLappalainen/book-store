import { NavLink } from "react-router-dom";
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
          <li><NavLink to="/books">Kirjat</NavLink></li>
          <li><NavLink to="/search">Hae tuotteita</NavLink></li> 
          {(role === "asiakas") && <li><NavLink to="/basket">Ostoskori</NavLink></li>}
          {(role === "yllapitaja") && <li><NavLink to="/addbook">Lisää kirja</NavLink></li>}
          {(role === "yllapitaja") && <li><NavLink to="/adddivari">Lisää divari</NavLink></li>}
          {role === "yllapitaja" && <button className="button-secondary button-small" onClick={() => dispatch(syncDivaris())}>Synkkaa divarit</button>}
        </ul>
        <button className="button-secondary button-small" onClick={() => dispatch(logout())}>Kirjaudu ulos</button>
      </nav>
    </div>
  );
}

export default Navbar;
