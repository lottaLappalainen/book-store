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
        teosId: "",
    });

    const [isNewBook, setIsNewBook] = useState(true); // determines whether we're adding a new book or selecting an existing one

    const dispatch = useDispatch();
    const tyypit = useSelector((state) => state.types.types); 
    const luokat = useSelector((state) => state.categories.categories);
    const books = useSelector((state) => state.books.books); 

    useEffect(() => {
        // fetch options for types, categories, and books when form mounts
        dispatch(fetchTypes());
        dispatch(fetchCategories());
        dispatch(fetchBooks());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // update form state on input change
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // divariId is hardcoded: D1 for new book, D2 for existing one
        const hardcodedDivariId = isNewBook ? 1 : 2;

        if (isNewBook) {
            // this creates a brand new book entry in both central and D1's DB
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
            // this adds an existing book to D2's stock
            const selectedBook = books.find(b => b.id === parseInt(formData.teosId));
            if (!selectedBook) return alert("Valitsemasi teos ei löytynyt.");
            const hinta = parseFloat(selectedBook.hinta).toFixed(2);

            dispatch(addTeosToD2(
                selectedBook.id,
                hardcodedDivariId,
                hinta
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
                        {/* inputs for adding a brand new book */}
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
                        {/* dropdown for choosing an existing book */}
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
