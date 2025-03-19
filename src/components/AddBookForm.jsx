import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTeosToD1 } from '../actions/booksActions';

const AddBookForm = () => {
    const [formData, setFormData] = useState({
        isbn: '',
        nimi: '',
        tekija: '',
        hinta: '',
        julkaisuvuosi: '', 
        paino: '',
        tyyppiId: '',
        luokkaId: '',
        divariId: '',
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const bookData = {
            ...formData,
            hinta: parseFloat(formData.hinta),
            julkaisuvuosi: parseInt(formData.julkaisuvuosi), 
            paino: parseFloat(formData.paino),
            tyyppiId: formData.tyyppiId ? parseInt(formData.tyyppiId) : null,
            luokkaId: formData.luokkaId ? parseInt(formData.luokkaId) : null,
            divariId: parseInt(formData.divariId),
        };

        dispatch(addTeosToD1(bookData));

        setFormData({
            isbn: '',
            nimi: '',
            tekija: '',
            hinta: '',
            julkaisuvuosi: '', 
            paino: '',
            tyyppiId: '',
            luokkaId: '',
            divariId: '',
        });
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Lisää uusi kirja</h2>
            <form onSubmit={handleSubmit}>
                <input className="w-full p-2 border rounded mb-2" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN (valinnainen)" />
                <input className="w-full p-2 border rounded mb-2" name="nimi" value={formData.nimi} onChange={handleChange} required placeholder="Kirjan nimi" />
                <input className="w-full p-2 border rounded mb-2" name="tekija" value={formData.tekija} onChange={handleChange} required placeholder="Kirjailija" />
                <input className="w-full p-2 border rounded mb-2" name="hinta" value={formData.hinta} onChange={handleChange} required placeholder="Hinta (€)" type="number" step="0.01" />
                <input className="w-full p-2 border rounded mb-2" name="julkaisuvuosi" value={formData.julkaisuvuosi} onChange={handleChange} required placeholder="Julkaisuvuosi" type="number" />
                <input className="w-full p-2 border rounded mb-2" name="paino" value={formData.paino} onChange={handleChange} required placeholder="Paino (g)" type="number" />
                <input className="w-full p-2 border rounded mb-2" name="tyyppiId" value={formData.tyyppiId} onChange={handleChange} placeholder="Tyyppi ID (valinnainen)" />
                <input className="w-full p-2 border rounded mb-2" name="luokkaId" value={formData.luokkaId} onChange={handleChange} placeholder="Luokka ID (valinnainen)" />
                <input className="w-full p-2 border rounded mb-2" name="divariId" value={formData.divariId} onChange={handleChange} required placeholder="Divari ID" type="number" />
                <button className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600" type="submit">
                    Lisää kirja
                </button>
            </form>
        </div>
    );
};

export default AddBookForm;
