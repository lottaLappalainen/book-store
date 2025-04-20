import { pool } from '../../backend.js';

export const syncTeosAndNide = async () => {
    try {
        const { rows: teosSyncRows } = await pool.query(`
            SELECT edellinenSync FROM keskusdivari.SyncStatus WHERE tauluNimi = 'Teos'
        `);
        const teosLastSync = teosSyncRows[0]?.edellinensync || '1970-01-01T00:00:00Z';

        // Fetch new or updated Teos from divari
        const teosResult = await pool.query(`
            SELECT t.*, tt.nimi AS tyyppiNimi, tl.nimi AS luokkaNimi, d.nimi AS divariNimi, d.osoite AS divariOsoite
            FROM (
                SELECT * FROM divari.Teos WHERE updated_at > $1
            ) t
            LEFT JOIN divari.TeosTyyppi tt ON t.tyyppiId = tt.id
            LEFT JOIN divari.TeosLuokka tl ON t.luokkaId = tl.id
            LEFT JOIN divari.DivariInfo d ON t.divariId = d.id
        `, [teosLastSync]);

        await pool.query(`SELECT * FROM divari.Teos WHERE updated_at > $1`, [teosLastSync]);

        for (const teos of teosResult.rows) {
            // Map tyyppiId
            let tyyppiIdKeskus = null;
            if (teos.tyyppiNimi) {
                const { rows: tyyppiRows } = await pool.query(`
                    SELECT id FROM keskusdivari.TeosTyyppi WHERE nimi = $1
                `, [teos.tyyppinimi]);
                
                // Check if tyyppi exists in keskusdivari
                // otherwise, insert (?)
                if (tyyppiRows.length > 0) {
                    tyyppiIdKeskus = tyyppiRows[0].id;
                } else {
                    const { rows: insertTyyppiRows } = await pool.query(`
                        INSERT INTO keskusdivari.TeosTyyppi (nimi) VALUES ($1) RETURNING id
                    `, [teos.tyyppinimi]);
                    tyyppiIdKeskus = insertTyyppiRows[0].id;
                }
            }

            // Map luokkaId
            let luokkaIdKeskus = null;
            if (teos.luokkanimi) {
                const { rows: luokkaRows } = await pool.query(`
                    SELECT id FROM keskusdivari.TeosLuokka WHERE nimi = $1
                `, [teos.luokkanimi]);

                if (luokkaRows.length > 0) {
                    luokkaIdKeskus = luokkaRows[0].id;
                } else {
                    const { rows: insertLuokkaRows } = await pool.query(`
                        INSERT INTO keskusdivari.TeosLuokka (nimi) VALUES ($1) RETURNING id
                    `, [teos.luokkanimi]);
                    luokkaIdKeskus = insertLuokkaRows[0].id;
                }
            }

            // Insert or update Teos in keskusdivari
            await pool.query(`
                INSERT INTO keskusdivari.Teos (isbn, nimi, tekija, hinta, julkaisuvuosi, paino, tyyppiId, luokkaId)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (isbn) DO UPDATE
                SET nimi = EXCLUDED.nimi, tekija = EXCLUDED.tekija, hinta = EXCLUDED.hinta,
                    julkaisuvuosi = EXCLUDED.julkaisuvuosi, paino = EXCLUDED.paino,
                    tyyppiId = EXCLUDED.tyyppiId, luokkaId = EXCLUDED.luokkaId
            `, [teos.isbn, teos.nimi, teos.tekija, teos.hinta, teos.julkaisuvuosi, teos.paino, tyyppiIdKeskus, luokkaIdKeskus]);

            await pool.query(`
                UPDATE keskusdivari.SyncStatus
                SET edellinenSync = CURRENT_TIMESTAMP
                WHERE tauluNimi = $1
            `, ['Teos']);
        }

        const { rows: nideSyncRows } = await pool.query(`
            SELECT edellinenSync FROM keskusdivari.SyncStatus WHERE tauluNimi = 'Nide'
        `);
        const nideLastSync = nideSyncRows[0]?.edellinensync || '1970-01-01T00:00:00Z';

        // Fetch new or updated Nide from divari
        const nideResult = await pool.query(`
            SELECT n.*, t.nimi as teosNimi, t.tekija as teosTekija, d.nimi AS divariNimi, d.osoite AS divariOsoite
            FROM (
                SELECT * FROM divari.Nide WHERE updated_at > $1
            ) n
            LEFT JOIN divari.Teos t ON n.teosId = t.id
            LEFT JOIN divari.DivariInfo d ON t.divariId = d.id
        `, [nideLastSync]);

        for (const nide of nideResult.rows) {
            // Map teosId
            const { rows: teosRows } = await pool.query(`
                SELECT id FROM keskusdivari.Teos WHERE nimi = $1 AND tekija = $2
            `, [nide.teosnimi, nide.teostekija]);
            const teosIdKeskus = teosRows[0]?.id;

            if (!teosIdKeskus) {
                console.error(`Teos with given tekija and nimi not found in keskusdivari.`);
                continue;
            }

            // Map divariId
            const { rows: divariRows } = await pool.query(`
                SELECT id FROM keskusdivari.Divari WHERE nimi = $1 AND osoite = $2
            `, [nide.divarinimi, nide.divariosoite]);
            const divariIdKeskus = divariRows[0]?.id;

            if (!divariIdKeskus) {
                console.error(`Divari with name ${nide.divarinimi} and address ${nide.divariosoite} not found in keskusdivari.`);
                continue;
            }

            // Insert or update Nide in keskusdivari
            await pool.query(`
                INSERT INTO keskusdivari.Nide (teosId, divariId, ostohinta, myyntipvm, tila, tilausId)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [teosIdKeskus, divariIdKeskus, nide.ostohinta, nide.myyntipvm, nide.tila, nide.tilausid]);

            await pool.query(`
                UPDATE keskusdivari.SyncStatus
                SET edellinenSync = CURRENT_TIMESTAMP
                WHERE tauluNimi = $1
            `, ['Nide']);
        }
        console.log('Synchronization complete.');
        return { success: true, message: 'Synchronization complete' };
    } catch (error) {
        console.error('Error during synchronization:', error.message);
        throw error;
    }
};