const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = require('./router');

app.use('/', express.static(path.join(__dirname, 'frontend')));
app.use('/api/', router);

module.exports = app;