const pool = require(`./db`);
const fetchReposInfo = require(`./repos`);
const express = require(`express`);
const cors = require(`cors`);
const app = express();
const PORT = 5000;

app.use(cors());

app.get(`/repositories`, async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM repositories`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
    }
});

app.get(`/repositories/:ReposIdOrLanguage`, async (req, res) => {
    const { ReposIdOrLanguage } = req.params;
    console.log(`Запрос на: /repositories/${ReposIdOrLanguage}`);
    let result;
    try {
        if (!isNaN(ReposIdOrLanguage)) {
            result = await pool.query(`SELECT * FROM repositories WHERE id=$1`, [ReposIdOrLanguage]);
        } else {
            result = await pool.query(
                `SELECT * FROM repositories WHERE LOWER(name) LIKE LOWER($1) OR LOWER(language) LIKE LOWER($1)`,
                [`%${ReposIdOrLanguage}%`]
            );
        }
        console.log('Результаты из базы данных:', result.rows);

        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.json({ Message: `Репозиторий не найден` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: 'Ошибка сервера' });
    }
});

let syncInterval;
const startSyncInterval = () => {
    clearInterval(syncInterval);
    syncInterval = setInterval(fetchReposInfo, 5 * 60 * 1000);
    console.log(`синхронизация началась`);
};

app.post(`/sync`, async (req, res) => {
    try {
        startSyncInterval();
        await fetchReposInfo();
        res.json({ Message: `синхронизация началась` });
    } catch (error) {
        console.error(`syncInterval failed` + ` ` + error);
    }
});

startSyncInterval();

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/repositories`);
});