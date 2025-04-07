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
import Search from './components/Search';

function App() {
  const notification = useSelector(state => state.notification);
  const role = useSelector(state => state.user.role);
  const user = useSelector(state => state.user);

  return (
    <div>
      {role !== 'guest' &&  <Navbar role={role} />}
      {notification && <Notification />}
      
      <Routes>
        {role === 'guest' ? (
          <>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/books" />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<SingleBookView />} />
            <Route path="/search" element={<Search role={role}/>} />
            <Route path="/order" element={<Order />} />
            <Route path="/addbook" element={<AddBookForm />} />
            <Route path="*" element={<Navigate to="/books" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
