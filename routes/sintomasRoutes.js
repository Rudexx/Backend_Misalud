const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance

router.post('/register', async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const client = await pool.connect();

        const result = await client.query('INSERT INTO Sintomas (nombre, descripcion) VALUES ($1, $2) RETURNING *', [nombre, descripcion]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error registering symptom');
        console.error(error);
    }
});

router.get('/:nombre', async (req, res) => {
    const { nombre } = req.params;
    try {
        const client = await pool.connect();

        const result = await client.query('SELECT * FROM Sintomas WHERE nombre = $1', [nombre]);

        if (result.rows.length > 0) {
            const symptomData = result.rows[0];
            res.status(200).json(symptomData);
        } else {
            res.status(404).send('Symptom not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving symptom data');
        console.error(error);
    }
});

router.put('/:nombre', async (req, res) => {
    const { nombre } = req.params;
    const { descripcion } = req.body;

    try {
        const client = await pool.connect();

        const result = await client.query('UPDATE Sintomas SET descripcion = $1 WHERE nombre = $2 RETURNING *', [descripcion, nombre]);

        if (result.rows.length > 0) {
            const updatedSymptom = result.rows[0];
            res.status(200).json(updatedSymptom);
        } else {
            res.status(404).send('Symptom not found');
        }
    } catch (error) {
        res.status(500).send('Error updating symptom');
        console.error(error);
    }
});

router.delete('/:nombre', async (req, res) => {
    const { nombre } = req.params;

    try {
        const client = await pool.connect();

        const result = await client.query('DELETE FROM Sintomas WHERE nombre = $1 RETURNING *', [nombre]);

        if (result.rows.length > 0) {
            const deletedSymptom = result.rows[0];
            res.status(200).json(deletedSymptom);
        } else {
            res.status(404).send('Symptom not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting symptom');
        console.error(error);
    }
});

module.exports = router;
