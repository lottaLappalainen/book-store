import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../actions/userActions';
import '../styles/Starterpage.css';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData, navigate));
  };

  return (
    <div className="starter-page">
      <form onSubmit={handleRegister} className="form-grid">
        <h2>Luo tili</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="text" name="name" placeholder="Nimi" value={formData.name} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Osoite" value={formData.address} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Sähköposti" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Salasana" value={formData.password} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Puhelin" value={formData.phone} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? "Rekisteröidään..." : "Luo tili"}</button>
        <p>Onko sinulla jo tili? <a href="/login">Kirjaudu sisään tästä</a></p>
      </form>
    </div>
  );
}

export default Register;
