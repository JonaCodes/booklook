

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

function formatTitleForURL(title){
	var titleWords = title.split(" ");
	var formattedTitle = "";

	for(var i = 0; i < titleWords.length; i++){
		formattedTitle += titleWords[i] + "+";
	}
	return formattedTitle;
}

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

function parse(data){

	var title = data.items[0].volumeInfo.title;
	var descr = data.items[0].volumeInfo.description;
	var author = data.items[0].volumeInfo.authors[0];
	var imgURL = data.items[0].volumeInfo.imageLinks.thumbnail;
	displayOnHTML(title, descr, author,imgURL);
}

function displayOnHTML(bookTitle, bookDescr, bookAuthor, bookImgURL){
	 $('#result').empty();
	// turn our "template" into html
	var source = $('#bookDisplay-template').html();

	// compile our template html using handlebars
	var template = Handlebars.compile(source);

	// fill our template with information
	var newHTML = template({bookTitle: bookTitle, bookDescr:bookDescr, bookAuthor: bookAuthor, bookImgURL: bookImgURL});

	// append our new html to the page
	$('#result').html(newHTML);
}

function getDaysToRead(numPages, mpd){
	//Assume 1 minute = 2 page
	return daysToRead = (numPages / (mpd*2))
}