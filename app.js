const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();
const routes = require('./routes');

app.use(routes);

async function startApp() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  // подключение к бд
  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
  // запуск сервера
}

startApp();
