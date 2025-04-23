
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addDivariToKeskusdivari, addDivariWithOmaTietokanta, processXmlAndAddDivari } from '../actions/divariActions';

const AddDivariForm = () => {
    const [formData, setFormData] = useState({
        nimi: '',
        osoite: '',
        omaTietokanta: false,
    });

    const [xmlFile, setXmlFile] = useState(null);
    const [divariInfo, setDivariInfo] = useState({ nimi: '', osoite: '' });
    const fileInputRef = useRef(null);
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

    const handleAddDivari = (e) => {
        e.preventDefault();
        if (!formData.nimi || !formData.osoite) {
            dispatch(setNotification({ message: 'Anna divarin nimi ja osoite!', requestStatus: 'error' }));
            return;
        }

        if (formData.omaTietokanta) {
            dispatch(addDivariWithOmaTietokanta(formData));
            dispatch(addDivariToKeskusdivari(formData));
        } else {
            dispatch(addDivariToKeskusdivari(formData));
        }

        setFormData({ nimi: '', osoite: '', omaTietokanta: false });
    }

    const handleProcessXML = () => {
        if (!xmlFile) {
            dispatch(setNotification({ message: 'Valitse XML-tiedosto ensin!', requestStatus: 'error' }));
            return;
        }

        if (!divariInfo.nimi || !divariInfo.osoite) {
            dispatch(setNotification({ message: 'Anna divarin nimi ja osoite ennen XML-tiedoston käsittelyä!', requestStatus: 'error' }));
            return;
        }

        // Reset fields after dispatching the action
        setXmlFile(null);
        setDivariInfo({ nimi: '', osoite: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        dispatch(processXmlAndAddDivari(xmlFile, divariInfo));

    };

    return (
        <div>
            <form onSubmit={(e) => e.preventDefault()} className="form-grid">
                <h2 className="text-2xl font-bold mb-4">Lisää uusi divari</h2>
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
                    type="button"
                    onClick={handleAddDivari}
                    className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600"
                >
                    Lisää divari
                </button>
                    <label className="block font-bold text-center text-lg">
                        Tai, lisää divari XML-tiedostosta: </label>
                    <input
                        type="file"
                        accept=".xml"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="w-full p-2 border rounded"
                    />
                    {xmlFile && (
                        <div className="xml-input-container">
                            <input
                                type="text"
                                name="nimi"
                                value={divariInfo.nimi}
                                onChange={handleDivariInfoChange}
                                placeholder="Divarin nimi"
                            />
                            <input
                                type="text"
                                name="osoite"
                                value={divariInfo.osoite}
                                onChange={handleDivariInfoChange}
                                placeholder="Divarin osoite"
                            />
                            <div>
                            <button
                                onClick={handleProcessXML}
                                className={`w-full py-2 px-4 rounded ${
                                    divariInfo.nimi && divariInfo.osoite
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={!divariInfo.nimi || !divariInfo.osoite}
                            >
                                Käsittele XML
                            </button></div>
                        </div>
                    )}
            </form>
        </div>
    );
};

export default AddDivariForm;