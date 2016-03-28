

var formIsValid = false;
//From HTML
var bookTitlePlaceholder = "Book Title";
var bookAuthorPlaceholder = "Book Author";
var bookDescrPlaceholder = "Book Description";
var imgURLPlaceholder = "Image URL";
var numPagesPlaceholder = "Number of Pages";
var mpdPlaceholder = "Minutes You Read per Day";

//Error messages
var missingTextMsg = "This field must be filled out"
var notNumericMsg = "Must be a whole number"
var badImageTypeMsg = "This is not a valid image URL, please choose a proper link"

//To track the x's and v's in the validation
var validatedInputs = [];
var unValidatedInputs = [];
var validImageExtensions = ["png","tiff","jpg","jpeg","bmp","svg"];

$('#formSubmitBtn').click(function() {

    var bookTitle = $("#formBookTitleID").val();
    var bookAuthor = $("#formBookAuthorID").val();
    var bookDescr = $("#formBookDescriptionID").val();
    var bookImgURL = $("#formImageURLID").val();
    var bookNumPages = $("#formNumPagesID").val();
    var bookMPD = $("#formMPDID").val();

    var daysToRead = getDaysToRead(bookNumPages, bookMPD);
    
    if(formIsValid){
	    displayOnHTML(daysToRead, bookTitle, bookDescr, bookAuthor, bookImgURL);
	    clearForm();
	    formIsValid = false;
    }
    else{
    	alert("Please correct the errors");
    }
});

function clearForm(){
	$('form').find("input[type=text], textarea").val("");
	$('form').find(".fa-check").removeClass("fa-check-show");
	validatedInputs = [];//reset so that checkmarks can come back up
}

//Add/remove x's and v's for validation
$("input").on("keyup",  function(){

	var placeholder = this.placeholder;	//the placeholder text used as an identifier
	var input = $(this).val();
	
	if(placeholder == bookTitlePlaceholder || placeholder == bookDescrPlaceholder || placeholder == bookAuthorPlaceholder){
		
		if(input.length < 1){
			showError(this, missingTextMsg);
		}
		else{
			showCheck(this);
		}
	}

	if(placeholder == mpdPlaceholder || placeholder == numPagesPlaceholder){
		if(Math.floor(input) == input && $.isNumeric(input)){
			showCheck(this);
		}
		else{
			showError(this, notNumericMsg);
		}
	}

	if(placeholder == imgURLPlaceholder){
		var afterPeriods = input.split(".");
		var extension = afterPeriods.pop();

		if(afterPeriods.length > 0 && $.inArray(extension, validImageExtensions) > -1){
			showCheck(this);
		}
		else{
			showError(this,badImageTypeMsg);
		}
	}

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

function displayOnHTML(daysToRead, bookTitle, bookDescr, bookAuthor, bookImgURL){
	 $('#result').empty();
	// turn our "template" into html
	var source = $('#bookDisplay-template').html();

	// compile our template html using handlebars
	var template = Handlebars.compile(source);

	// fill our template with information
	var newHTML = template({daysToRead: daysToRead, bookTitle: bookTitle, bookDescr:bookDescr, bookAuthor: bookAuthor, bookImgURL: bookImgURL});

	// append our new html to the page
	$('#result').html(newHTML);
}

function getDaysToRead(numPages, mpd){
	//Assume 1 minute = 2 page
	return daysToRead = (numPages / (mpd*2))
}