import { Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Notification from './components/Notification';
import Books from './components/Books';
import SingleBookView from './components/SingleBookView';
import Order from './components/Order';
import AddBookForm from './components/AddBookForm';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notification = useSelector(state => state.notification);

  return (
    <div>
      {isAuthenticated && <Navbar role="customer" onSearch={setSearchQuery} />}
      
      {notification && <Notification />}
      
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
            <Route path="/books" element={<Books searchQuery={searchQuery} />} />
            <Route path="/books/:id" element={<SingleBookView />} />
            <Route path="/order" element={<Order />} />
            <Route path="/addbook" element={<AddBookForm />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
