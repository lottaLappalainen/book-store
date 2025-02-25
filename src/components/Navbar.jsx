import { Link } from 'react-router-dom';

function Navbar({ role }) {
  return (
    <nav>
      <ul>
        <li><Link to="/Books">Books</Link></li>
        {role === 'customer' && <li><Link to="/Order">Order</Link></li>}
        {role === 'admin' && <li><Link to="/AddBook">Add a Book</Link></li>}
      </ul>
    </nav>
  );
}

export default Navbar;
