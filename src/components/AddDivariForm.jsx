import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { processXmlAndAddDivari } from '../actions/divariActions';

const AddDivariForm = () => {
    const [formData, setFormData] = useState({
        nimi: '',
        osoite: '',
        omaTietokanta: false,
    });

    const [xmlFile, setXmlFile] = useState(null);
    const [divariInfo, setDivariInfo] = useState({ nimi: '', osoite: '' });
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setXmlFile(file);
        }
    };

    const handleDivariInfoChange = (e) => {
        const { name, value } = e.target;
        setDivariInfo({ ...divariInfo, [name]: value });
    };

    const handleProcessXML = () => {
        if (!xmlFile) {
            dispatch(setNotification({ message: 'Valitse XML-tiedosto ensin!', requestStatus: 'error' }));
            return;
        }

        if (!divariInfo.nimi || !divariInfo.osoite) {
            dispatch(setNotification({ message: 'Anna divarin nimi ja osoite ennen XML-tiedoston käsittelyä!', requestStatus: 'error' }));
            return;
        }

        dispatch(processXmlAndAddDivari(xmlFile, divariInfo));

        // Reset fields after dispatching the action
        setXmlFile(null);
        setDivariInfo({ nimi: '', osoite: '' });
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Lisää uusi divari</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    name="nimi"
                    value={formData.nimi}
                    onChange={handleChange}
                    required
                    placeholder="Divarin nimi"
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    name="osoite"
                    value={formData.osoite}
                    onChange={handleChange}
                    required
                    placeholder="Divarin osoite"
                    className="w-full p-2 border rounded mb-2"
                />
                <div className="mb-4">
                    <label className="mr-2">Onko divarilla oma tietokanta?</label>
                    <input
                        type="checkbox"
                        name="omaTietokanta"
                        checked={formData.omaTietokanta}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600"
                >
                    Lisää divari
                </button>
            </form>
            <div className="mt-4">
                <label className="block mb-2 font-bold">Lisää divari XML-tiedostosta:</label>
                <input
                    type="file"
                    accept=".xml"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                />
                {xmlFile && (
                    <div className="mt-4">
                        <input
                            type="text"
                            name="nimi"
                            value={divariInfo.nimi}
                            onChange={handleDivariInfoChange}
                            placeholder="Divarin nimi"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="text"
                            name="osoite"
                            value={divariInfo.osoite}
                            onChange={handleDivariInfoChange}
                            placeholder="Divarin osoite"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <button
                            onClick={handleProcessXML}
                            className={`w-full py-2 px-4 rounded mt-2 ${
                                divariInfo.nimi && divariInfo.osoite
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!divariInfo.nimi || !divariInfo.osoite}
                        >
                            Käsittele XML
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddDivariForm;