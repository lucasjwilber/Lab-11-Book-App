'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 3001;
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true,}));
app.use(express.static('public'));

app.get('/', renderHTML);
// app.get('/hello', renderHTML);
// app.post('/search')
app.get('*', handleError);

function renderHTML(request, response) {
  response.render('pages/index');
}

function handleError(request, response, error) {
  console.error(error);
  response.status(404).send('404, page not found.');
}



app.listen(PORT, () =>  console.log(`App is listening on port ${PORT}`) );
