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

SELECT * FROM books; 