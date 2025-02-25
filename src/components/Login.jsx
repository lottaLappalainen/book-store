import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { setNotification } from '../actions/notificationActions';

function Login({ setIsAuthenticated }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(setNotification({ message: 'Logging in...', requestStatus: 'loading' }));
    //filler login logic
    if (email === "test@example.com" && password === "password") {
      setIsAuthenticated(true);
      dispatch(setNotification({ message: 'Login successful', requestStatus: 'success' }));
      navigate("/books"); 
    } else {
      dispatch(setNotification({ message: 'An error occurred while logging in. Please try again later.', requestStatus: 'error' }));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>New user? <a href="/register">Click here to register</a></p>
    </div>
  );
}

export default Login;
