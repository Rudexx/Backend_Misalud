const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance

router.post('/register', async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const client = await pool.connect();

        const result = await client.query('INSERT INTO Enfermedad (nombre, descripcion) VALUES ($1, $2) RETURNING *', [nombre, descripcion]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error registering disease');
        console.error(error);
    }
});

router.get('/:nombre', async (req, res) => {
    const { nombre } = req.params;
    try {
        const client = await pool.connect();

        const result = await client.query('SELECT * FROM Enfermedad WHERE nombre = $1', [nombre]);

        if (result.rows.length > 0) {
            const diseaseData = result.rows[0];
            res.status(200).json(diseaseData);
        } else {
            res.status(404).send('Disease not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving disease data');
        console.error(error);
    }
});

router.put('/:nombre', async (req, res) => {
    const { nombre } = req.params;
    const { descripcion } = req.body;

    try {
        const client = await pool.connect();

        const result = await client.query('UPDATE Enfermedad SET descripcion = $1 WHERE nombre = $2 RETURNING *', [descripcion, nombre]);

        if (result.rows.length > 0) {
            const updatedDisease = result.rows[0];
            res.status(200).json(updatedDisease);
        } else {
            res.status(404).send('Disease not found');
        }
    } catch (error) {
        res.status(500).send('Error updating disease');
        console.error(error);
    }
});

router.delete('/:nombre', async (req, res) => {
    const { nombre } = req.params;

    try {
        const client = await pool.connect();

        const result = await client.query('DELETE FROM Enfermedad WHERE nombre = $1 RETURNING *', [nombre]);

        if (result.rows.length > 0) {
            const deletedDisease = result.rows[0];
            res.status(200).json(deletedDisease);
        } else {
            res.status(404).send('Disease not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting disease');
        console.error(error);
    }
});

module.exports = router;
