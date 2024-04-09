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
router.post('/:idEnfermedad/:idSintoma', async (req, res) => {
  const { idEnfermedad, idSintoma } = req.params;
  client = await pool.connect(); 
  const query = `
    INSERT INTO enfermedad_sintoma (id_enfermedad, id_sintoma)
    VALUES ($1, $2);
  `;
  
  client.query(query, [idEnfermedad, idSintoma], (error, results) => {
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

// Endpoint to get all symptoms for a specific disease by disease ID
router.get('/:idEnfermedad/symptoms', async (req, res) => {
  const { idEnfermedad } = req.params;

  try {
    // Obtain a client from the pool
    const client = await pool.connect();
    // Construct the query to get all symptoms for a given disease ID
    // This involves a JOIN operation between the sintoma and enfermedad_sintoma tables
    const query = `
      SELECT s.*
      FROM sintoma s
      JOIN enfermedad_sintoma es ON s.id_sintoma = es.id_sintoma
      WHERE es.id_enfermedad = $1;
    `;
      // Validate that idEnfermedad is an integer
    if (!Number.isInteger(Number(idEnfermedad))) {
      return res.status(400).send('idEnfermedad must be an integer');
    }
    // Execute the query
    const result = await client.query(query, [idEnfermedad]);

    // Check if any symptoms were found
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'No symptoms found for the specified disease' });
    }
  } catch (error) {
    console.error('Error retrieving symptoms for the disease:', error);
    res.status(500).json({ error: 'Error executing the query' });
  }
});

module.exports = router;
