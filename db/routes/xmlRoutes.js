import { pool } from "../../backend.js";
import { parseStringPromise } from "xml2js";

export const setupXmlRoutes = (backend) => {
    backend.post("/api/upload-xml", async (req, res) => {
        try {
            console.log("Received request to process XML file.");

            const { xml, divari } = req.body;
            if (!xml || !divari) {
                console.error("No XML data or divari information provided in the request.");
                return res.status(400).json({ error: "No XML data or divari information provided." });
            }

            const { nimi, osoite } = divari;
            if (!nimi || !osoite) {
                console.error("Invalid divari information: missing nimi or osoite.");
                return res.status(400).json({ error: "Invalid divari information: missing nimi or osoite." });
            }

            console.log(`Adding divari: nimi=${nimi}, osoite=${osoite}`);
            const divariQuery = `
                INSERT INTO keskusdivari.Divari (nimi, osoite, omaTietokanta)
                VALUES ($1, $2, false)
                ON CONFLICT (nimi, osoite) DO NOTHING
                RETURNING id;
            `;
            const divariResult = await pool.query(divariQuery, [nimi, osoite]);
            const divariId = divariResult.rows[0]?.id;

            if (!divariId) {
                console.error(`Divari with nimi=${nimi} and osoite=${osoite} already exists.`);
                return res.status(400).json({ error: "Divari already exists." });
            }

            console.log(`Inserted divari with ID ${divariId}. Parsing XML data...`);
            const parsedData = await parseStringPromise(xml, { explicitArray: false });
            console.log("Parsed XML data:", JSON.stringify(parsedData, null, 2));

            if (!parsedData.teokset || !parsedData.teokset.teos) {
                console.error("Invalid XML structure. Missing 'teokset' or 'teos' elements.");
                return res.status(400).json({ error: "Invalid XML structure." });
            }

            const teokset = Array.isArray(parsedData.teokset.teos)
                ? parsedData.teokset.teos
                : [parsedData.teokset.teos];

            console.log(`Found ${teokset.length} 'teos' elements in the XML.`);

            for (const teos of teokset) {
                const { nimi: teosNimi, tekija, isbn } = teos.ttiedot;
                const niteet = Array.isArray(teos.nide) ? teos.nide : [teos.nide];

                const hinta = niteet[0]?.hinta;
                const paino = niteet[0]?.paino;

                if (!hinta || isNaN(parseFloat(hinta))) {
                    console.error(`Invalid or missing hinta for teos: ${JSON.stringify(teos)}`);
                    continue;
                }

                if (!paino || isNaN(parseInt(paino))) {
                    console.error(`Invalid or missing paino for teos: ${JSON.stringify(teos)}`);
                    continue;
                }

                console.log(`Processing teos: nimi=${teosNimi}, tekija=${tekija}, isbn=${isbn}, hinta=${hinta}, paino=${paino}`);

                const teosQuery = `
                    INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino)
                    VALUES ($1, $2, $3, $4, 2025, $5)
                    ON CONFLICT (isbn) DO NOTHING
                    RETURNING id;
                `;
                const teosResult = await pool.query(teosQuery, [isbn, teosNimi, tekija, parseFloat(hinta), parseInt(paino)]);
                const teosId = teosResult.rows[0]?.id;

                if (!teosId) {
                    console.log(`Teos with ISBN ${isbn} already exists in the database.`);
                    continue;
                }

                console.log(`Inserted teos with ID ${teosId} into the database.`);

                for (const nide of niteet) {
                    const { hinta: nideHinta } = nide;
                    console.log(`Processing nide: hinta=${nideHinta || "null"}`);

                    const nideQuery = `
                        INSERT INTO keskusdivari.Nide (teosId, divariId, ostohinta, tila)
                        VALUES ($1, $2, $3, 'vapaa');
                    `;
                    await pool.query(nideQuery, [
                        teosId,
                        divariId,
                        nideHinta ? parseFloat(nideHinta) : parseFloat(hinta),
                    ]);
                    console.log("Inserted nide into the database.");
                }
            }

            console.log("XML data processed successfully.");
            res.status(200).json({ message: "XML data processed successfully" });
        } catch (error) {
            console.error("Error processing XML:", error.message);
            res.status(400).json({ error: error.message });
        }
    });
};