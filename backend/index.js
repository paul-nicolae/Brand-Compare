const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// configure .env
require('dotenv').config();

const app = express();

app.use(cors());

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// initialize routes
app.use('/requests', require('./routes/get_brands'))

const PORT = process.env.PORT;
app.listen(PORT, function() {
    console.log(`It's alive on http://localhost:${PORT}/`);
});