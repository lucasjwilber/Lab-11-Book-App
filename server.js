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
  console.log(request.body);
  const searchType = request.body.search[0];
  const searchText = request.body.search[1];
  console.log(searchType, searchText);
  const url = `https://www.googleapis.com/books/v1/volumes?q=in${searchType}+${searchText}`;

  superagent.get(url)
    .then(results => {

      const arrayOfResults = results.body.items.map(book => {
        return new Book(book.volumeInfo);
      }).slice(0, 10);

      response.render('searches/show', {bookList: arrayOfResults,});
    });
}

function Book(obj) {
  this.image = fixUrl(obj.imageLinks.thumbnail) || 'Image not found.';
  this.title = obj.title || 'Title not found.';
  this.author = obj.authors || obj.author || ['Author not found.'];
  this.description = obj.description || 'Description not found.';
}

function fixUrl(url) {
  return url.replace(/^http:/i, 'https:');
}

function handleError(request, response, error) {
  console.error(error);
  response.status(404).render('pages/error');
}


app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
