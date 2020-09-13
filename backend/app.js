
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const taskService = require('./service/task.service');
const authService = require('./service/auth.service');

const app = express();
mongoose.connect('mongodb://localhost/deneme', { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true, } )
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Connection failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/v1/task',taskService);
app.use('/api/v1/auth',authService);


module.exports = app;
