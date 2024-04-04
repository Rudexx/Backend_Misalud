const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance

router.post('/register', async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const client = await pool.connect();

        const result = await client.query('INSERT INTO Diagnostico (nombre, descripcion) VALUES ($1, $2) RETURNING *', 
          [nombre, descripcion]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error registering diagnosis');
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();

        const result = await client.query('SELECT * FROM Diagnostico WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            const diagnosisData = result.rows[0];
            res.status(200).json(diagnosisData);
        } else {
            res.status(404).send('Diagnosis not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving diagnosis data');
        console.error(error);
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const client = await pool.connect();

        const result = await client.query('UPDATE Diagnostico SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *', 
          [nombre, descripcion, id]);

        if (result.rows.length > 0) {
            const updatedDiagnosis = result.rows[0];
            res.status(200).json(updatedDiagnosis);
        } else {
            res.status(404).send('Diagnosis not found');
        }
    } catch (error) {
        res.status(500).send('Error updating diagnosis');
        console.error(error);
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await pool.connect();

        const result = await client.query('DELETE FROM Diagnostico WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length > 0) {
            const deletedDiagnosis = result.rows[0];
            res.status(200).json(deletedDiagnosis);
        } else {
            res.status(404).send('Diagnosis not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting diagnosis');
        console.error(error);
    }
});

module.exports = router;
