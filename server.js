'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 3001;
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true, }));
app.use(express.static('public'));

app.get('/', renderHTML);
app.post('/search', handleSearch)
app.get('*', handleError);

function renderHTML(request, response) {
  response.render('pages/index');
}

function handleSearch(request, response) {
  const searchType = request.body[0];
  const searchText = request.body[1];
  const url = `https://www.googleapis.com/books/v1/volumes?q=in${searchType}+${searchText}`;
  superagent.get(url)
    .then(results => {
      // console.log(results.body.items[0].volumeInfo);
      const arrayOfResults = results.body.items.map(book => {
        console.log(book);
        return new Book(book.volumeInfo);
      });
      console.log(arrayOfResults);
      response.status(200).send(arrayOfResults);
    });
}

function Book(obj) {
  this.image = obj.imageLinks.thumbnail || 'Image not found.';
  this.title = obj.title || 'Title not found.';
  this.author = obj.authors || obj.author || ['Author not found.'];
  this.description = obj.description || 'Description not found.';
}

function handleError(request, response, error) {
  console.error(error);
  response.status(404).send('404, page not found.');
}



app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
