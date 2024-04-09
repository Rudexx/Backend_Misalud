const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance

router.post('/register', async (req, res) => {
    const { nombre, descripcion, dosis, tipo_frec_recomendada, frec_recomendada, enf_id } = req.body;
    
    try {
      const client = await pool.connect();
      
      // You might want to add validation to ensure that enf_id corresponds to an existing disease.
      // This could involve a SELECT query to check the existence of enf_id in the enfermedad table.
  
      const query = `
        INSERT INTO Medicamento (nombre, descripcion, dosis, tipo_frec_recomendada, frec_recomendada, enf_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING med_id;
      `;
      const result = await client.query(query, [nombre, descripcion, dosis, tipo_frec_recomendada, frec_recomendada, enf_id]);
      res.status(201).json({ 
        message: 'Medication registered successfully', 
        medicationId: result.rows[0].med_id
      });
    } catch (error) {
      console.error('Error registering medication:', error);
      res.status(500).json({ error: 'Error executing the query' });
    } finally {
      client.release();
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
