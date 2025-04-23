import { NavLink } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';
import { syncDivaris } from "../actions/booksActions";
import '../styles/Navbar.css';
import { downloadUserOrdersCsv } from "../actions/utilActions";

function Navbar({ role }) {
  const dispatch = useDispatch();

  // used by admin to download a CSV report of user orders
  const handleDownloadOrderReport = async (e) => {
    e.preventDefault();
    await downloadUserOrdersCsv(dispatch);
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <ul className="nav-links">
          <li><NavLink to="/books">Kirjat</NavLink></li>
          <li><NavLink to="/search">Hae tuotteita</NavLink></li> 
          {(role === "asiakas") && <li><NavLink to="/basket">Ostoskori</NavLink></li>}
          
          {/* these links and actions are only for admin users */}
          {(role === "yllapitaja") && <li><NavLink to="/addbook">Lisää kirja</NavLink></li>}
          {(role === "yllapitaja") && <li><NavLink to="/adddivari">Lisää divari</NavLink></li>}
          {role === "yllapitaja" && <button className="button-primary-light button-small" onClick={() => dispatch(syncDivaris())}>Synkkaa divarit</button>}
          {role === "yllapitaja" && <button className="button-primary-light button-small" onClick={handleDownloadOrderReport}>Lataa tilausraportti</button>}
        </ul>
        
        {/* logout is available for all users */}
        <button className="button-secondary button-small" onClick={() => dispatch(logout())}>Kirjaudu ulos</button>
      </nav>
    </div>
  );
}

export default Navbar;
