'use strict';

$('.selectBook').on('click', bookSelected);

function bookSelected(book) {
  let $selectedBook = ($(this).parent()[0].children);
  let $selectedImage = $selectedBook[0].src;
  let $selectedTitle = $selectedBook[1].textContent;
  let $selectedAuthor = $selectedBook[2].textContent;
  let $selectedDescription = $selectedBook[3].textContent;
  let $selectedISBN = $selectedBook[4].textContent;

  $('#formImage').attr('src', $selectedImage);
  $('#formImageURL').val($selectedImage);
  $('#formTitle').val($selectedTitle);
  $('#formAuthor').val($selectedAuthor);
  $('#formDescription').val($selectedDescription);
  $('#formISBN').val($selectedISBN);

  $('#selectedBookForm').removeClass("hide");
}