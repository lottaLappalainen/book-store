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

            const parsedData = await parseStringPromise(xml, { explicitArray: false });

            if (!parsedData.teokset || !parsedData.teokset.teos) {
                console.error("Invalid XML structure. Missing 'teokset' or 'teos' elements.");
                return res.status(400).json({ error: "Invalid XML structure." });
            }

            const teokset = Array.isArray(parsedData.teokset.teos)
                ? parsedData.teokset.teos
                : [parsedData.teokset.teos];

            for (const teos of teokset) {
                const { nimi: teosNimi, tekija, isbn } = teos.ttiedot;
                const niteet = Array.isArray(teos.nide) ? teos.nide : [teos.nide];

                const hinta = niteet[0]?.hinta;
                let paino = niteet[0]?.paino;

                // Because paino is optional, let's find the first non-null value
                // if paino is not provided in the first nide
                if (!paino || isNaN(parseInt(paino))) {
                  for(const nide of niteet) {
                      if (nide.paino) {
                          paino = nide.paino;
                          break;
                      }
                  }
                }

                if (!hinta || isNaN(parseFloat(hinta))) {
                    console.log(`Invalid or missing hinta for teos: ${JSON.stringify(teos)}`);
                    continue;
                }

                // If we found no paino, let's set it to 500
                if (!paino || isNaN(parseInt(paino))) {
                    paino = 500;
                }

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

                for (const nide of niteet) {
                    const { hinta: nideHinta } = nide;

                    const nideQuery = `
                        INSERT INTO keskusdivari.Nide (teosId, divariId, ostohinta, tila)
                        VALUES ($1, $2, $3, 'vapaa');
                    `;
                    await pool.query(nideQuery, [
                        teosId,
                        divariId,
                        nideHinta ? parseFloat(nideHinta) : parseFloat(hinta),
                    ]);
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