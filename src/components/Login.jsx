import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { setNotification } from '../actions/notificationActions';
import { login } from '../actions/userActions';

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(setNotification({ message: 'Logging in...', requestStatus: 'loading' }));
    //testaa kirjautumista näillä crediteillä
    if (email === "test@example.com" && password === "password") {
      dispatch(login());
      dispatch(setNotification({ message: 'Login successful', requestStatus: 'success' }));
      navigate("/books");
    } else {
      dispatch(setNotification({ message: 'Invalid credentials', requestStatus: 'error' }));
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
