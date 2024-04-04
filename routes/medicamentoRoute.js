const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance

router.post('/register', async (req, res) => {
    const { nombre, descripcion, cantidad_disponible } = req.body;
    try {
        const client = await pool.connect();

        const result = await client.query('INSERT INTO Medicamento (nombre, descripcion, cantidad_disponible) VALUES ($1, $2, $3) RETURNING *', 
          [nombre, descripcion, cantidad_disponible]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error registering medication');
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();

        const result = await client.query('SELECT * FROM Medicamento WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            const medicationData = result.rows[0];
            res.status(200).json(medicationData);
        } else {
            res.status(404).send('Medication not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving medication data');
        console.error(error);
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, cantidad_disponible } = req.body;

    try {
        const client = await pool.connect();

        const result = await client.query('UPDATE Medicamento SET nombre = $1, descripcion = $2, cantidad_disponible = $3 WHERE id = $4 RETURNING *', 
          [nombre, descripcion, cantidad_disponible, id]);

        if (result.rows.length > 0) {
            const updatedMedication = result.rows[0];
            res.status(200).json(updatedMedication);
        } else {
            res.status(404).send('Medication not found');
        }
    } catch (error) {
        res.status(500).send('Error updating medication');
        console.error(error);
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const client = await pool.connect();

        const result = await client.query('DELETE FROM Medicamento WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length > 0) {
            const deletedMedication = result.rows[0];
            res.status(200).json(deletedMedication);
        } else {
            res.status(404).send('Medication not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting medication');
        console.error(error);
    }
});

module.exports = router;
