'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 3001;
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true,}));
app.use(express.static('public'));

app.get('/', (request, response) => response.send('app is up'));
app.get('/hello', renderHTML);


function renderHTML(request, response) {
  response.render('pages/index');
}





app.listen(PORT, () =>  console.log(`App is listening on port ${PORT}`) );
