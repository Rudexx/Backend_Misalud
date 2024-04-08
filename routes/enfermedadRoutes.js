const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance

router.post('/register', async (req, res) => {
    const { nombre_enfermedad, info_enfermedad } = req.body;
    
    try {
      const client = await pool.connect();
      
      const query = `
        INSERT INTO enfermedad (nombre_enfermedad, info_enfermedad)
        VALUES ($1, $2) RETURNING id_enfermedad;
      `;
      
      const result = await client.query(query, [nombre_enfermedad, info_enfermedad]);
      
      res.status(201).json({ 
        message: 'Disease registered successfully', 
        diseaseId: result.rows[0].id_enfermedad // Assuming id_enfermedad is the returning column from INSERT
      });
    } catch (error) {
      console.error('Error registering the disease:', error);
      res.status(500).json({ error: error.message });
    } finally {
      if (client) {
        client.release();
      }
    }
  });

  router.get('/getall', (req, res) => {
    const query = 'SELECT * FROM enfermedad;';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching diseases:', error);
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results);
    });
  });

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let client;
    
    try {
      client = await pool.connect(); // Make sure to get a client from the pool
      const query = 'SELECT * FROM enfermedad WHERE id_enfermedad = $1'; // Use $1 for parameterized query
      const result = await client.query(query, [id]); // Use await with client.query
      
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).send('Disease not found');
      }
    } catch (error) {
      console.error('Error fetching the disease:', error);
      res.status(500).send('Error fetching the disease');
    } finally {
      if (client) {
        client.release(); // Only try to release the client if it's defined
      }
    }
  });
  
  
  

// Endpoint to link a symptom to a disease
router.post('/:idEnfermedad/:idSintoma', (req, res) => {
    const { idEnfermedad, idSintoma } = req.params;

    const query = `
      INSERT INTO enfermedad_sintoma (id_enfermedad, id_sintoma)
      VALUES (?, ?);
    `;
  
    connection.query(query, [idEnfermedad, idSintoma], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ message: 'Symptom linked to disease successfully', results });
    });
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
