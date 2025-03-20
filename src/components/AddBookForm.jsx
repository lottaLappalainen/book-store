import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTeosToD1 } from '../actions/booksActions';
import { fetchTypes } from '../actions/typesActions';
import { fetchCategories } from '../actions/categoriesActions';

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
    const tyypit = useSelector((state) => state.types.types);
    const luokat = useSelector((state) => state.categories.categories);

    useEffect(() => {
        dispatch(fetchTypes());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "hinta") {
            const formattedValue = value.replace(/[^0-9.]/g, ''); 
            if (/^\d+(\.\d{0,2})?$/.test(formattedValue) || formattedValue === "") {
                setFormData({ ...formData, [name]: formattedValue });
            }
            return;
        }

        if (name === "julkaisuvuosi" || name === "paino" || name === "divariId") {
            const intValue = value.replace(/\D/g, ''); 
            setFormData({ ...formData, [name]: intValue });
            return;
        }

        if (name === "tyyppiId" && value && !tyypit.some(t => t.id.toString() === value)) {
            return;
        }
        if (name === "luokkaId" && value && !luokat.some(l => l.id.toString() === value)) {
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const bookData = {
            ...formData,
            hinta: parseFloat(formData.hinta).toFixed(2), // Varmistetaan että hinnalla on 2 decimaalia
            julkaisuvuosi: parseInt(formData.julkaisuvuosi),
            paino: parseInt(formData.paino),
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
                <input className="w-full p-2 border rounded mb-2" name="hinta" value={formData.hinta} onChange={handleChange} required placeholder="Hinta (€)" type="text" />
                <input className="w-full p-2 border rounded mb-2" name="julkaisuvuosi" value={formData.julkaisuvuosi} onChange={handleChange} required placeholder="Julkaisuvuosi" type="text" />
                <input className="w-full p-2 border rounded mb-2" name="paino" value={formData.paino} onChange={handleChange} required placeholder="Paino (g)" type="text" />
                
                <select className="w-full p-2 border rounded mb-2" name="tyyppiId" value={formData.tyyppiId} onChange={handleChange}>
                    <option value="">Valitse tyyppi (valinnainen)</option>
                    {tyypit.map((tyyppi) => (
                        <option key={tyyppi.id} value={tyyppi.id}>{tyyppi.nimi}</option>
                    ))}
                </select>

                <select className="w-full p-2 border rounded mb-2" name="luokkaId" value={formData.luokkaId} onChange={handleChange}>
                    <option value="">Valitse luokka (valinnainen)</option>
                    {luokat.map((luokka) => (
                        <option key={luokka.id} value={luokka.id}>{luokka.nimi}</option>
                    ))}
                </select>

                <input className="w-full p-2 border rounded mb-2" name="divariId" value={formData.divariId} onChange={handleChange} required placeholder="Divari ID" type="text" />
                
                <button className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600" type="submit">
                    Lisää kirja
                </button>
            </form>
        </div>
    );
};

export default AddBookForm;
