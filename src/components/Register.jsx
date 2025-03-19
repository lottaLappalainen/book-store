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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://tie-tkannat.it.tuni.fi:8069/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nimi: formData.name,
          osoite: formData.address,
          sposti: formData.email,
          salasana: formData.password,
          puh: formData.phone,
          rooli: 'asiakas'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User Registered:", result);
        dispatch(setNotification({ message: 'Rekisteröinti onnistui, siirry kirjautumiseen', requestStatus: 'success' }));
        navigate("/login");
      } else {
        const error = await response.json();
        dispatch(setNotification({ message: 'Error: ' + error.message, requestStatus: 'error' }));
      }
    } catch (error) {
      dispatch(setNotification({ message: 'Error: ' + error.message, requestStatus: 'error' }));
    }

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
