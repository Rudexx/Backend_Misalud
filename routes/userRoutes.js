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

router.get('/:id', (req, res) => {
    // Implementation for getting a specific user
});

router.put('/:id', (req, res) => {
    // Implementation for updating a user
});

router.delete('/:id', (req, res) => {
    // Implementation for deleting a user
});

module.exports = router;
