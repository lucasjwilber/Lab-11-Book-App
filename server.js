'use strict';

require('dotenv').config();

//Require all libriares
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 3001;
const app = express();

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (error) => console.error(error));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true, }));
app.use(express.static('public'));

//Method Override Function
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

//All paths on the site
app.get('/', renderHome);
app.post('/search', handleSearch);
app.get('/search', displaySearchBox);
app.get('/:id', displayDetailView);
app.post('/saveBook', addBookToDB);
app.put('/saveBook', updateBook);
app.delete('/saveBook', deleteBook);

//Catch all to 404 unwanted paths
app.get('*', handleError);


function displaySearchBox(request, response) {
  response.render('pages/searches/new');
}

//Save a new book to the database
function addBookToDB(request, response) {

  let obj = request.body;

  let sql = `INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
  let safeValues = [obj.author, obj.title, obj.isbn, obj.image_url, obj.description, obj.bookshelf];

  client.query(sql, safeValues)
    .then(results => {
      response.redirect(`/${results.rows[0].id}`);
    })
    .catch(error => {
      console.error(error);
    });
}

//Display the selected book in more detail
function displayDetailView(request, response) {

  console.log('running displayDetailView()');

  let bookID = request.params.id;

  let sql = `SELECT * FROM books WHERE id=$1;`;
  let safeValue = [bookID];

  let bookInfo;

  client.query(sql, safeValue)
    .then(result => {
      bookInfo = result.rows[0];

      // response.render('pages/books/show', { book: bookInfo, override: true, });

    })
    .catch(error => {
      queryError(error);
    });
  client.query('SELECT DISTINCT bookshelf FROM books;')
    .then(results => {
      let bookShelves = results.rows;
      response.render('pages/books/show', { book: bookInfo, bookShelves: bookShelves, override: true, });
    });

}

//Display the home page for the website
function renderHome(request, response) {
  let sql = `SELECT * FROM books;`;
  client.query(sql)
    .then(results => {
      response.render('pages/index', { bookList: results.rows, });
    })
    .catch(error => console.error(error));
}

//Take in the the information to search for and make the API call before rendering to the results page
function handleSearch(request, response) {
  const searchType = request.body.search[0];
  const searchText = request.body.search[1];
  const url = `https://www.googleapis.com/books/v1/volumes?q=in${searchType}+${searchText}`;

  superagent.get(url)
    .then(results => {

      const arrayOfResults = results.body.items.map(book => {
        return new Book(book.volumeInfo);
      }).slice(0, 10);

      client.query('SELECT DISTINCT bookshelf FROM books;')
        .then(results => {
          let bookShelves = results.rows;
          response.render('pages/searches/results', { bookList: arrayOfResults, bookShelves: bookShelves, override: false, });
        });
    })


    .catch(error => {
      console.error(error);
      response.status(500).render('pages/error');
    });
}


//Update the book selected in the details page and rerender the page with the new information
function updateBook(request, response) {

  console.log(request.body);
  let obj = request.body;
  let sql = `UPDATE books SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7 RETURNING id;`;

  //if the bookshelf input tag was used that gets saved, otherwise whatever option was selected
  let bookshelf = obj.bookshelf.length > 0 ? obj.bookshelf : obj.selectedBookshelf;
  let safeValues = [obj.author, obj.title, obj.isbn, obj.image_url, obj.description, bookshelf, obj.id];

  client.query(sql, safeValues)
    .then(results => {
      response.redirect(`/${results.rows[0].id}`);
    })
    .catch(error => {
      queryError(error, response);
    });
}

//Reomve the given book from the database
function deleteBook(request, response) {

  let bookID = [request.body.id];
  let sql = `DELETE FROM books WHERE id=$1;`;

  client.query(sql, bookID)
    .then(() => {
      response.redirect('/');

    })
    .catch(error => {
      queryError(error, response);

    });
}

//Constructore function for parcing the API information and making a new book object
function Book(obj) {

  this.author = obj.authors || obj.author || ['Author not found.'];

  this.title = obj.title || 'Title not found.';

  let isbn;
  if (obj.industryIdentifiers) isbn = obj.industryIdentifiers[0];
  this.isbn = isbn ? `${isbn.type} ${isbn.identifier}` : 'ISBN not found';

  if (!obj.imageLinks) { console.log(obj); }
  this.image_url = obj.imageLinks ? fixUrl(obj.imageLinks.thumbnail) : 'Image not found.';

  this.description = obj.description || 'Description not found.';
}

//Replace Http with Https
function fixUrl(url) {
  return url.replace(/^http:/i, 'https:');
}

//Any 404 route will be sent through this function
function handleError(request, response, error) {
  console.error(error);
  response.status(404).render('pages/error');
}

//Any Error while runnung a query will be sent through this function
function queryError(error, response) {
  console.error(error);
  response.render('pages.error').status(503);
}

//If a database is found start the server
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Connected to DB, app is listening on port ${PORT}`));
  })
  .catch((error) => {
    console.error(error);
    console.log('failed to connect to db');
  });
