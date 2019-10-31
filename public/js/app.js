'use strict';

$('.selectBook').on('click', bookSelected);

function bookSelected() {

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

$('#bookSubmitButton').on('click', bookSubmit);

function bookSubmit(event) {
  $('#selectedBookForm').addClass("hide");
}


let color = 0;
let color2 = 180;
//resize-rainbow;
setInterval(function () {
  if (color >= 360) { color = 0; }
  if (color2 >= 360) { color2 = 0; }
  color += 1;
  color2 += 1;
  $('body').css('background-color', `hsl(${color}, 100%, 50%)`);
  $('article').css('background-color', `hsl(${color2}, 100%, 50%)`);
}, 5);
