import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../actions/userActions';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password, navigate));
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="form-grid">
        <h2>Kirjautuminen</h2>
        <input type="email" placeholder="Sähköposti" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Kirjaudutaan..." : "Kirjaudu sisään"}</button>
        <p>Uusi käyttäjä? <a href="/register">Luo tili</a></p>
      </form>
    </div>
  );
}

export default Login;
