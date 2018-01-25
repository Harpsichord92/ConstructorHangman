var Letter = function(ltr) {

// Property to store the actual letter
  this.letter = ltr;

// Property/boolean if the letter can be shown
  this.appear = false;

  this.letterRender = function() {

    if(this.letter == ' ') {

      // Makes sure that when the function checks if the word is found doesn't read the blank as false.
      this.appear = true;
      return '  ';
    }

    if(this.appear === false) {
      return ' _ ';
    } 

    else {
      return this.letter;
    }

  };
};

// Export to use in word.js
module.exports = Letter;
