'use strict';

$('#editBookButton').on('click', editBookDetails);

function editBookDetails() {

  console.log($(this));

  let $selectedBook = ($(this).parent()[0].children);
  console.log($selectedBook);
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

$('#bookSubmitButton').on('click', bookSubmit);

function bookSubmit(event) {
  $('#selectedBookForm').addClass("hide");
}