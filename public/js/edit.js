'use strict';

$('#editBookButton').on('click', editBookDetails);
$('#bookSubmitButton').on('submit', bookSubmit);
$('bookDeleteButton').on('click', bookDelete);

function editBookDetails() {

  console.log($(this));

  let $selectedBook = ($(this).parent()[0].children);
  console.log($selectedBook);
  let $selectedImage = $selectedBook[0].src;
  let $selectedTitle = $selectedBook[1].textContent;
  let $selectedAuthor = $selectedBook[2].textContent;
  let $selectedDescription = $selectedBook[3].textContent;
  let $selectedISBN = $selectedBook[4].textContent;
  let $selectedBookshelf = $selectedBook[5].textContent;


  $('#formImage').attr('src', $selectedImage);
  $('#formImageURL').val($selectedImage);
  $('#formTitle').val($selectedTitle);
  $('#formAuthor').val($selectedAuthor);
  $('#formDescription').val($selectedDescription);
  $('#formISBN').val($selectedISBN);
  $('#formBookShelf').val($selectedBookshelf);

  $('#selectedBookForm').removeClass("hide");
}


function bookSubmit(event) {
  $('#selectedBookForm').addClass("hide");
}

function bookDelete () {

}
