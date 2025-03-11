import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';

function Navbar({ role }) {
  const dispatch = useDispatch();

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/books">Kirjat</Link></li>
        <li><Link to="/search">Hae tuotteita</Link></li> 
        {role === "asiakas" && <li><Link to="/order">Ostoskori</Link></li>}
        {role === "yllapitaja" && <li><Link to="/addbook">Lisää kirja</Link></li>}
      </ul>
      <button onClick={() => dispatch(logout())}>Kirjaudu ulos</button>
    </nav>
  );
}

export default Navbar;
