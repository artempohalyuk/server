const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const data = require('./routes/data');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middlewares/authentication');
const handleResponse = require('./middlewares/responseHandler');

const app = express();
const corsOptions = {
  origin: ['http://auth.microfrontend.com', 'http://main.microfrontend.com'],
  credentials: true,
};

app.use(bodyParser.json({ type: '*/*' }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(handleResponse)
app.use('/api/auth', auth);
app.use(verifyToken);
app.use('/api', data);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Маршрут не знайдено' });
});

// Запустити сервер на певному порті
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

mongoose.connect('mongodb://127.0.0.1:27017/microfrontend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));