
//check whether or not namespace exist
var MyApp = MyApp || {};

//create my app namespace
var MyApp = (function(){

  //commas and fullStops counter on form submit
  var commasTotal,fullStopsTotal;

  //private method - it shows customise error messages
  var _validationError = function (errorMessage) {
     $(".validation-message").html("<span class="+'error-message'+">" + errorMessage + "</span>").fadeIn();
  };

  //private method - checks both words and chars left
  //returns an object with info about the textarea value passed as argument
  var _checkAppCounters = function(val){
        return {
            charactersNoSpaces : val.replace(/\s+/g, '').length,
            characters         : val.length,
            lines              : val.split(/\r*\n/).length,
            commas             : val.split(",").length-1,
            fullStop           : val.split(".").length-1
        }
  };

  //private method - checks typed characters and runs textarea validation 
  var _checkRemainingCharsWords = function () {

    var $targetBox = $('.counter-summary');

    //listens to key event on "keyup"
    $('#textarea-content').on('keyup', function(e){

      //regex to allow only alphabetical chars and chars like ',. and line break
      var regExNumbers = /^[a-zA-Z ',.\n]+$/; 
      var strTest = regExNumbers.test(this.value);

      //checks value existence
      if(this.value){

        //checks if the char is valid - return value true
        if(strTest){
    
          //access object to get counter info
          var c = _checkAppCounters(this.value);

          commasTotal = c.commas;
          fullStopsTotal = c.fullStop;

          //shows the counters result on user type
          $targetBox.html(
              "<span>Characters (no spaces): "+ c.charactersNoSpaces + "</span>" +
              "<span>Characters (and spaces): "+ c.characters + "</span>" +
              "<span>Lines: "+ c.lines + "</span>"     
          );

          $(".validation-message").fadeOut();
        }
        else{
          //it handles the wrong chars inserted
          var errorMessage = "Character not allowed. Only alphabetic characters, commas, fullstop and apostrophe are allowed."
          
          var regExExclusion = /[^a-zA-Z ',.\n]+/g;
          
          //it removes the wrong chars inserted
          this.value = this.value.replace(regExExclusion,'');

          //show validation error message
          _validationError(errorMessage);

          return false;
        }
      }
        
    });  

   
  };

  //private method - create table dinamically
  var _showContentInPage = function(sameElementsArray,initial){

    var sameWordCounter = 1;

    $(".table-box").show();
    
    //create table structure for each array of elements
    var tableElement = $("<table class="+'table-box__content'+"><thead><tr><th>"+initial+"</td></tr></thead><tbody></tbody></table>");
    $(".table-box").append(tableElement);

    //loop through each array of elements and injuct the HTML in the DOM
    for(var i=0; i<sameElementsArray.length; i++){

      //counts the same words
      if(sameElementsArray[i] === sameElementsArray[i+1]){
        sameWordCounter++
        sameElementsArray.splice(i,1);
        i--;
      }
      else{
        //group same words if exist
        if(sameWordCounter > 1){
          var elementToAppend = $('<tr><td>'+ sameElementsArray[i] + ' (' + sameWordCounter + ')' +'</td></tr>');
          sameWordCounter = 1;
        }
        //show single word instead
        else{
          var elementToAppend = $('<tr><td>'+ sameElementsArray[i] +'</td></tr>');
        }
        elementToAppend.appendTo(tableElement);
      }

    }
    
  }

  //private method - clean up array before iterating it
  var _cleanUpArray = function(){

    //regex to remove commas and full stops from inserted string
    var regex = /[.,]/g;

    //push textarea data into an array, trim space, lower case string, add comma as separator and sort it alphabetically
    var textareaContent = $('#textarea-content').val().toLowerCase().replace(regex,' ').trim().split(" ").sort();
    
    //remove any aphostrope occurence from beginning of each word in array
    for (var i=0; i<textareaContent.length; i++) 
    {
      if(textareaContent[i].charAt(0) === "'"){
          textareaContent[i] = textareaContent[i].replace(/'/g, "");     
      }
    }

    //remove empty array empty cells
    textareaContent = $.grep(textareaContent,function(n){
      return n;
    });

    //remove aphostropy char array cells
    var removeItem = "'";
    textareaContent = $.grep(textareaContent,function(n){
      return n != removeItem;
    });

    return textareaContent;
  }



  //private method - shows textarea data in table
  var _processResponse = function(textareaContent){

    //clean table in the DOM before showing data again
    $(".table-box").empty();

    var elementSelected, firstCharElementSelected,nextCharElementSelected;

    //loop through the array to find similar words and add them in the table
    for (var i=0; i<textareaContent.length; i++) 
    {
        var sameElementsArray = [];

        //get first element
        elementSelected = textareaContent[i];

        //get first element first char
        firstCharElementSelected = elementSelected.charAt(0);

        //add element to its own array
        sameElementsArray.push(textareaContent[i]);

        //loop through the same array to find element with same initial and add in the same array
        for (var x=1; x<textareaContent.length; x++) 
        {
          //get next element
          var nextElement = textareaContent[x];

          //get next element first char
          nextCharElementSelected = nextElement.charAt(0);

          //if they have the same initial add it in the same array
          if(firstCharElementSelected === nextCharElementSelected){
          
            sameElementsArray.push(textareaContent[x]);

            //remove the element from the array and re-index the 'for loop' index
            textareaContent.splice(x,1);
            x--;
          }
        }

        textareaContent.splice(i,1);
        i--;

        //add dinamically element to table
        _showContentInPage(sameElementsArray,firstCharElementSelected);
    }
  };

  //public method - handles the words validations
  var stringValidation = function () {
     _checkRemainingCharsWords();
  };

  //public method - handles the form submit
  var submitEvent = function () {
      //listens to button click and get the textarea data
      $('.form__button').click(function() {

          //clean up array from commas, spaces and full stops
          var textareaContent = _cleanUpArray();
          var wordsTotal = textareaContent.length;

          //process response and show results if words number is between 5 and 500
          if(wordsTotal >= 5 && wordsTotal <= 500){
            _processResponse(textareaContent); 

            //inject totla words, commas and full stops
            $(".counter-summary").prepend("<span>Words: "+wordsTotal+ "</span>" + 
              "<span>Full stops: " + fullStopsTotal + "</span>"+
              "<span>Commas: "+commasTotal+ "</span>");
          }
          else{
            var errorMessage = "The amount of words you can insert is between 5 and 500."
           _validationError(errorMessage);
          }     
      });
  };

  return {
      stringValidation: stringValidation,
      submitEvent : submitEvent
  };

})();

MyApp.stringValidation();
MyApp.submitEvent();

 