import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { setNotification } from '../actions/notificationActions';

function Register() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    password: '',
    phone: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("User Registered:", formData);
    dispatch(setNotification({ message: 'Rekisteröinti onnistui, siirry kirjautumiseen', requestStatus: 'success' }));
    navigate("/login");
  };

  return (
    <div>
      <h2>Luo tili</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="name" placeholder="Nimi" value={formData.name} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Osoite" value={formData.address} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Sähköposti" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Salasana" value={formData.password} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Puhelin" value={formData.phone} onChange={handleChange} required />
        <button type="submit">Luo tili</button>
      </form>
      <p>Onko sinulla jo tili? <a href="/login">Kirjaudu sisään tästä</a></p>
    </div>
  );
}

export default Register;
