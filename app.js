const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const app = express();

const userRoutes = require('./routes/userRoutes');
const enfermedadRoutes = require('./routes/enfermedadRoutes');
const medicamentRoutes = require('./routes/medicamentoRoute');
const sintomasRoutes = require('./routes/sintomasRoutes');
const diagnosticoRoute = require('./routes/diagnosticoRoute');


// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/diseases', enfermedadRoutes);
app.use('/api/medicines', medicamentRoutes);
app.use('/api/diagnostics', diagnosticoRoute);
app.use('/api/symptoms', sintomasRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});