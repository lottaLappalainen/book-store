import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeosToD1, addTeosToD2, fetchBooks } from "../actions/booksActions";
import { fetchTypes } from "../actions/typesActions";
import { fetchCategories } from "../actions/categoriesActions";

const AddBookForm = () => {
    const [formData, setFormData] = useState({
        isbn: "",
        nimi: "",
        tekija: "",
        hinta: "",
        julkaisuvuosi: "",
        paino: "",
        tyyppiId: "",
        luokkaId: "",
        ostohinta: "",
        teosId: "",
    });

    const [isNewBook, setIsNewBook] = useState(true);

    const dispatch = useDispatch();
    const tyypit = useSelector((state) => state.types.types);
    const luokat = useSelector((state) => state.categories.categories);
    const books = useSelector((state) => state.books.books);

    useEffect(() => {
        dispatch(fetchTypes());
        dispatch(fetchCategories());
        dispatch(fetchBooks());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const hardcodedDivariId = isNewBook ? 1 : 2;

        if (isNewBook) {
            dispatch(addTeosToD1({
                isbn: formData.isbn || null,
                nimi: formData.nimi,
                tekija: formData.tekija,
                hinta: parseFloat(formData.hinta).toFixed(2),
                julkaisuvuosi: parseInt(formData.julkaisuvuosi),
                paino: parseInt(formData.paino),
                tyyppiId: formData.tyyppiId ? parseInt(formData.tyyppiId) : null,
                luokkaId: formData.luokkaId ? parseInt(formData.luokkaId) : null,
                divariId: hardcodedDivariId,
            }));
        } else {
            dispatch(addTeosToD2(
                parseInt(formData.teosId),
                hardcodedDivariId,
                parseFloat(formData.ostohinta).toFixed(2)
            ));
        }

        setFormData({
            isbn: "",
            nimi: "",
            tekija: "",
            hinta: "",
            julkaisuvuosi: "",
            paino: "",
            tyyppiId: "",
            luokkaId: "",
            ostohinta: "",
            teosId: "",
        });
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} className="form-grid">
                <h2 className="text-2xl font-bold mb-4">
                    {isNewBook ? "Lisää uusi kirja" : "Lisää olemassa oleva kirja"}
                </h2>
                <div className="mb-4">
                    <label className="mr-2">Lisätäänkö uusi kirja?</label>
                    <input type="checkbox" checked={isNewBook} onChange={() => setIsNewBook(!isNewBook)} />
                </div>
                {isNewBook ? (
                    <>
                        <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN (valinnainen)" className="w-full p-2 border rounded mb-2" />
                        <input name="nimi" value={formData.nimi} onChange={handleChange} required placeholder="Kirjan nimi" className="w-full p-2 border rounded mb-2" />
                        <input name="tekija" value={formData.tekija} onChange={handleChange} required placeholder="Kirjailija" className="w-full p-2 border rounded mb-2" />
                        <input name="hinta" value={formData.hinta} onChange={handleChange} required placeholder="Hinta (€)" className="w-full p-2 border rounded mb-2" />
                        <input name="julkaisuvuosi" value={formData.julkaisuvuosi} onChange={handleChange} required placeholder="Julkaisuvuosi" className="w-full p-2 border rounded mb-2" />
                        <input name="paino" value={formData.paino} onChange={handleChange} required placeholder="Paino (g)" className="w-full p-2 border rounded mb-2" />

                        <select name="tyyppiId" value={formData.tyyppiId} onChange={handleChange} className="w-full p-2 border rounded mb-2">
                            <option value="">Valitse tyyppi</option>
                            {tyypit.map((tyyppi) => (
                                <option key={tyyppi.id} value={tyyppi.id}>{tyyppi.nimi}</option>
                            ))}
                        </select>

                        <select name="luokkaId" value={formData.luokkaId} onChange={handleChange} className="w-full p-2 border rounded mb-2">
                            <option value="">Valitse luokka</option>
                            {luokat.map((luokka) => (
                                <option key={luokka.id} value={luokka.id}>{luokka.nimi}</option>
                            ))}
                        </select>
                    </>
                ) : (
                    <>
                        <select name="teosId" value={formData.teosId} onChange={handleChange} className="w-full p-2 border rounded mb-2">
                            <option value="">Valitse teos</option>
                            {[...books]
                            .filter(book => book?.nimi && book?.tekija)
                            .sort((a, b) => a.nimi.localeCompare(b.nimi))
                            .map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.nimi} - {book.tekija}
                                </option>
                            ))}
                        </select>
                        <input name="ostohinta" value={formData.ostohinta} onChange={handleChange} required placeholder="Ostohinta (€)" className="w-full p-2 border rounded mb-2" />
                    </>
                )}

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600">
                    Lisää kirja
                </button>
            </form>
        </div>
    );
};

export default AddBookForm;
