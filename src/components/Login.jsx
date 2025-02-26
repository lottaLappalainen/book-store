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
    dispatch(setNotification({ message: 'Kirjaudutaan sisään...', requestStatus: 'loading' }));
    //testaa kirjautumista näillä crediteillä
    if (email === "test@example.com" && password === "password") {
      dispatch(login());
      dispatch(setNotification({ message: 'Kirjautuminen onnistui', requestStatus: 'success' }));
      navigate("/books");
    } else {
      dispatch(setNotification({ message: 'Väärä sähköposti tai salasana', requestStatus: 'error' }));
    }
  };

  return (
    <div>
      <h2>Kirjautuminen</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Sähköposti" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Kirjaudu sisään</button>
      </form>
      <p>Uusi käyttäjä? <a href="/register">Luo tili</a></p>
    </div>
  );
}

export default Login;
