

var formIsValid = false;

var invalidISBN = "This ISBN is not correct"

//To track the x's and v's in the validation
var validatedInputs = [];
var unValidatedInputs = [];

$('#formSubmitBtn').click(function() {

  	var isbn = $("#formISBNid").val();
	var bookInfo = fetch(isbn);    
	// var title = $("#formISBNid").val();
	// var bookInfo = fetchWithTitle(title);
    // if(formIsValid){
	   //  displayOnHTML(daysToRead, bookTitle, bookDescr, bookAuthor, bookImgURL);
	   //  clearForm();
	   //  formIsValid = false;
    // }
    // else{
    // 	//alert("Please correct the errors");
    // }
});

function fetch(isbn) {

  $.ajax({
    method: "GET",
    url: 'https://www.googleapis.com/books/v1/volumes?q='+ isbn,
    dataType: "json",
    success: function(data) {
      console.log(data);
      parse(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("error: " + textStatus);
    }
  }); 
};

function parse(data){

	var books = [];
	for(var i = 0; i < data.items.length; i++){
		if(i == 10){
			break;
		}

		var snippet = "";
		var image = "";

		if(data.items[i].searchInfo == undefined){
			snippet = "no snippet";
		}
		else{
			snippet = data.items[i].searchInfo.textSnippet;
		}

		if(data.items[i].volumeInfo.imageLinks == undefined){
			image = ".jpg";
		}
		else{
			image = data.items[i].volumeInfo.imageLinks.thumbnail;
		}

//Works, but need to add author condition and fix formatting; should go in columns
		var book = {
			bookTitle: data.items[i].volumeInfo.title,
			//bookAuthor: data.items[i].volumeInfo.description,
			bookSnippet: snippet,
			bookAuthor: "author",//data.items[i].volumeInfo.authors[0],
			bookImgURL: image
		}
		books.push(book);
	}

	displayOnHTML(books);
}

function displayOnHTML(books){
	 
	 var bookData = {books};

	 $('#result').empty();
	// turn our "template" into html
	var source = $('#bookMiniDisplay-template').html();

	// compile our template html using handlebars
	var template = Handlebars.compile(source);

	// fill our template with information
	var newHTML = template(bookData);
	// var newHTML = template({bookTitle: bookTitle, bookDescr:bookDescr, bookAuthor: bookAuthor, bookImgURL: bookImgURL});
	// var newHTML = template({bookTitle: bookTitle, bookSnippet: bookSnippet, bookAuthor: bookAuthor, bookImgURL: bookImgURL});
	// append our new html to the page
	$('#result').html(newHTML);
}


function clearForm(){
	$('form').find("input[type=text], textarea").val("");
	$('form').find(".fa-check").removeClass("fa-check-show");
	validatedInputs = [];//reset so that checkmarks can come back up
}

//Add/remove x's and v's for validation
$("input").on("keyup",  function(){

	var input = $(this).val();
	
	//Validation

	var numErrors = $('.fa-times-show').length;
	if(numErrors == 0){
		formIsValid = true;
	}

});

function showCheck(input){
	//If the input has not been validated yet, toggle the class to show the green tick
	if($.inArray(input.id, validatedInputs) == -1){
		$(input).next(".fa-check").toggleClass("fa-check-show");
		validatedInputs.push(input.id);
	}
	//remove x if it exists
	var errorIndex = $.inArray(input.id, unValidatedInputs);
	if(errorIndex > -1){
		$(input).next().next(".fa-times").toggleClass("fa-times-show");
		unValidatedInputs.splice(errorIndex,1);
	}
}

function showError(input, errorMessage){
	//If x hasn't been displayed yet, toggle the class to show the green tick
	if($.inArray(input.id, unValidatedInputs) == -1){
		$(input).next().next(".fa-times").toggleClass("fa-times-show");
		unValidatedInputs.push(input.id);

		//Clear, then add the error message
		$(input).next().next("i").find('span').remove()		
		$(input).next().next("i").append("<span> "+errorMessage+"</span>");
	}
	//remove check if it exists
	var checkIndex = $.inArray(input.id, validatedInputs);
	if(checkIndex > -1){
		$(input).next(".fa-check").toggleClass("fa-check-show");
		validatedInputs.splice(checkIndex,1);
	}
}

function getDaysToRead(numPages, mpd){
	//Assume 1 minute = 2 page
	return daysToRead = (numPages / (mpd*2))
}

// function formatTitleForURL(title){
// 	var titleWords = title.split(" ");
// 	var formattedTitle = "";

// 	for(var i = 0; i < titleWords.length; i++){
// 		formattedTitle += titleWords[i] + "+";
// 	}
// 	return formattedTitle;
// }