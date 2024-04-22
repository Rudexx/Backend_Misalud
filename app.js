const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const app = express();

const userRoutes = require('./routes/userRoutes');
const enfermedadRoutes = require('./routes/enfermedadRoutes');
const medicamentRoutes = require('./routes/medicamentoRoute');
const sintomasRoutes = require('./routes/sintomasRoutes');
const diagnosticoRoute = require('./routes/diagnosticoRoute');
const recordatorioRoute = require('./routes/recordatorioRoutes');


// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})


// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/diseases', enfermedadRoutes);
app.use('/api/medicines', medicamentRoutes);
app.use('/api/diagnostics', diagnosticoRoute);
app.use('/api/symptoms', sintomasRoutes);
app.use('/api/reminders', recordatorioRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});