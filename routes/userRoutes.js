const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool instance


router.post('/register', async (req, res) => {
    const { username, password, correo, telefono, fecha_nacimiento, profesion } = req.body;
    try {
      const client = await pool.connect();

      const result = await client.query('INSERT INTO Usuario (username, correo, password, telefono, fecha_nacimiento, profesion) VALUES ($1, $2, $3, $4, $5, $6)',
       [username, correo, password, telefono, fecha_nacimiento, profesion]);
      res.send("User registered succesfully");
    } catch (error) {
      res.status(500).send('Error registering user');
      console.error(error);
    }
  });

  router.get('/reminders/:correo', async (req, res) => {
    const { correo } = req.params; // or req.body, if you're using a POST request
    try {
        const client = await pool.connect();

        const result = await client.query('SELECT * FROM recordatorio WHERE correo = $1', [correo]);
        
        if (result.rowCount > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).send('No reminders found for the given user');
        }
    } catch (error) {
        res.status(500).send('Error fetching reminders');
        console.error(error);
    }
});


  router.post('/login', async (req, res) => {
    const {password, correo,} = req.body;
    try {
      const client = await pool.connect();

      const result = await client.query('SELECT password FROM Usuario WHERE correo = $1', [correo]);

      if (result.rows.length > 0 && result.rows[0].password === password) {
          res.status(200).send('Login successful!');
      } else {
          res.status(401).send('Invalid username or password');
      }

    } catch (error) {
      res.status(500).send('Wrong Credentials');
      console.error(error);
    }
  });

  router.get('/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const client = await pool.connect();

        const result = await client.query('SELECT * FROM Usuario WHERE correo = $1', [email]);

        if (result.rows.length > 0) {
            const userData = result.rows[0]; // Assuming email is unique, so we take the first row
            res.status(200).json(userData);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving user data');
        console.error(error);
    }
});

router.put('/:correo', async (req, res) => {
  const { correo } = req.params;
  const { username, password, telefono, fecha_nacimiento, profesion } = req.body;

  try {
      const client = await pool.connect();

      const result = await client.query('UPDATE Usuario SET username = $1, password = $2, telefono = $3, fecha_nacimiento = $4, profesion = $5 WHERE correo = $6 RETURNING *', 
        [username, password, telefono, fecha_nacimiento, profesion, correo]);

      if (result.rows.length > 0) {
          const updatedUser = result.rows[0];
          res.status(200).json(updatedUser);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      res.status(500).send('Error updating user');
      console.error(error);
  }
});

router.delete('/:correo', async (req, res) => {
  const { correo } = req.params;

  try {
      const client = await pool.connect();

      const result = await client.query('DELETE FROM Usuario WHERE correo = $1 RETURNING *', [correo]);

      if (result.rows.length > 0) {
          const deletedUser = result.rows[0];
          res.status(200).json(deletedUser);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      res.status(500).send('Error deleting user');
      console.error(error);
  }
});


module.exports = router;