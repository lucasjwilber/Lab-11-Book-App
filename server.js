'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 3001;
const app = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (error) => console.error(error));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true, }));
app.use(express.static('public'));

app.get('/', renderHTML);
app.post('/search', handleSearch)
app.get('/search', displaySearchBox);
app.get('/book/:id', displayDetailView);
app.post('/saveBook', addBookToDB)
app.get('*', handleError);


function displaySearchBox(request, response) {
  response.render('pages/searches/new');
}


function addBookToDB(request, response) {

  let obj = request.body;
  let sql = `INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;

  let safeValues = [obj.author, obj.title, obj.isbn, obj.image_url, obj.description, obj.bookshelf];

  client.query(sql, safeValues)
    .then(results => {
      // client.query('select * from books')
      //   .then(results => console.log("db results: ", results.rows));
      // console.log(results.rows);
      response.redirect(`/book/${results.rows[0].id}`);
    })
    .catch(error => {
      console.error(error);
    });
}



function displayDetailView(request, response) {

  let bookID = request.params.id;

  let sql = `SELECT * FROM books WHERE id=$1;`;
  let safeValue = [bookID];

  client.query(sql, safeValue)
    .then(result => {
      let bookInfo = result.rows[0];
      response.render('pages/books/show', { book: bookInfo, });
    });
}






function renderHTML(request, response) {
  let sql = `SELECT * FROM books;`;
  client.query(sql)
    .then(results => {
      response.render('pages/index', { bookList: results.rows, });
    })
    .catch(error => console.error(error));
  // response.render('pages/index');
}

function handleSearch(request, response) {
  const searchType = request.body.search[0];
  const searchText = request.body.search[1];
  const url = `https://www.googleapis.com/books/v1/volumes?q=in${searchType}+${searchText}`;

  superagent.get(url)
    .then(results => {

      const arrayOfResults = results.body.items.map(book => {
        return new Book(book.volumeInfo);
      }).slice(0, 10);

      response.render('pages/searches/show', { bookList: arrayOfResults, });

    })
    .catch(error => {
      console.error(error);
      response.status(500).render('pages/error');
    });
}

function Book(obj) {
  this.author = obj.authors || obj.author || ['Author not found.'];
  this.title = obj.title || 'Title not found.';
  let isbn = obj.industryIdentifiers[0];
  this.isbn = isbn ? `${isbn.type} ${isbn.identifier}` : 'ISBN not found';
  if (!obj.imageLinks) { console.log(obj); }
  this.image_url = obj.imageLinks ? fixUrl(obj.imageLinks.thumbnail) : 'Image not found.';
  this.description = obj.description || 'Description not found.';
}

function fixUrl(url) {
  return url.replace(/^http:/i, 'https:');
}

function handleError(request, response, error) {
  console.error(error);
  response.status(404).render('pages/error');
}


client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Connected to DB, app is listening on port ${PORT}`));
  })
  .catch((error) => {
    console.error(error);
    console.log('failed to connect to db');
  });
