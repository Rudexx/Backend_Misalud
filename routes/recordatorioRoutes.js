const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance

router.post('/register', async (req, res) => {
    const { correo, fecha_inicio, fecha_final, frecuencia, nombre_compuesto} = req.body;
    try {
        const client = await pool.connect();

        // Check if the correo exists in the usuario table first
        const userExists = await client.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
        if (userExists.rowCount === 0) {
            return res.status(404).send('User not found');
        }

        // If the user exists, insert the recordatorio
        const result = await client.query('INSERT INTO recordatorio (correo, fecha_inicio, fecha_final, frecuencia, nombre_compuesto) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
                                          [correo, fecha_inicio, fecha_final, frecuencia, nombre_compuesto]);
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error registering reminder');
        console.error(error);
    } 
});
router.get('/:correo', async (req, res) => {
    const { correo } = req.params; // Get the email from route parameters

    try {
        const client = await pool.connect();

        // Check if the user exists in the usuario table first
        const userExists = await client.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
        if (userExists.rowCount === 0) {
            return res.status(404).send('User not found');
        }

        // If the user exists, fetch their reminders
        const reminders = await client.query('SELECT fecha_inicio, fecha_final, frecuencia, nombre_compuesto FROM recordatorio WHERE correo = $1', [correo]);
        
        res.status(200).json(reminders.rows);
    } catch (error) {
        res.status(500).send('Error retrieving reminders');
        console.error(error);
    }
});



module.exports = router;
