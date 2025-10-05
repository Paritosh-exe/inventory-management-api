const express = require('express');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});


app.use('/api/products', productRoutes);

app.use(errorHandler);

module.exports = app;