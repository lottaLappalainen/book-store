import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Books from './components/Books';
import Order from './components/Order';
import AddBook from './components/AddBook';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      {isAuthenticated && <Navbar role="customer" />} {/*hardcoded role, change to admin to see add book*/}

      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/books" />} />
            <Route path="/books" element={<Books />} />
            <Route path="/order" element={<Order />} />
            <Route path="/addbook" element={<AddBook />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
