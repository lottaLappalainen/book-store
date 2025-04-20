import { parseStringPromise } from "xml2js";

export const parseXMLFile = async (file) => {
    const text = await file.text(); // Read the file as text
    const result = await parseStringPromise(text, { explicitArray: false });
    return result;
};