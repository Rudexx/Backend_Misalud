const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance

router.post('/register', async (req, res) => {
    const { usuario_id, titulo, descripcion, fecha } = req.body;
    try {
        const client = await pool.connect();

        const result = await client.query('INSERT INTO Recordatorio (usuario_id, titulo, descripcion, fecha) VALUES ($1, $2, $3, $4) RETURNING *', 
          [usuario_id, titulo, descripcion, fecha]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error registering reminder');
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();

        const result = await client.query('SELECT * FROM Recordatorio WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            const reminderData = result.rows[0];
            res.status(200).json(reminderData);
        } else {
            res.status(404).send('Reminder not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving reminder data');
        console.error(error);
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fecha } = req.body;

    try {
        const client = await pool.connect();

        const result = await client.query('UPDATE Recordatorio SET titulo = $1, descripcion = $2, fecha = $3 WHERE id = $4 RETURNING *', 
          [titulo, descripcion, fecha, id]);

        if (result.rows.length > 0) {
            const updatedReminder = result.rows[0];
            res.status(200).json(updatedReminder);
        } else {
            res.status(404).send('Reminder not found');
        }
    } catch (error) {
        res.status(500).send('Error updating reminder');
        console.error(error);
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await pool.connect();

        const result = await client.query('DELETE FROM Recordatorio WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length > 0) {
            const deletedReminder = result.rows[0];
            res.status(200).json(deletedReminder);
        } else {
            res.status(404).send('Reminder not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting reminder');
        console.error(error);
    }
});

module.exports = router;
