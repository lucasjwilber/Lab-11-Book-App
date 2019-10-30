DROP TABLE IF EXISTS books;
CREATE TABLE IF NOT EXISTS books(
  id SERIAL PRIMARY KEY,
  author varchar(255),
  title varchar(255),
  isbn varchar(255),
  image_url TEXT,
  description TEXT,
  bookshelf varchar(255)
);

INSERT INTO books (author, title, isbn, image_url, description) VALUES (
  'Frank Herbert',
  'Dune',
  'ISBN_13 9780441013593',
  'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
  'sci-fi books'
  );

SELECT * FROM books; 