// Packages
//=============================================================
var inquirer = require('inquirer');
var isLetter = require('is-letter');

// Grab Exports
//=============================================================
var Word = require('./word.js');
var Game = require('./game.js');

// Hangman graphic
var hangManDisplay = Game.newWord.hangman;

// Set the maxListener
require('events').EventEmitter.prototype._maxListeners = 100;

// Game Functions & Logic
//=============================================================
var hangman = {
  wordBank: Game.newWord.wordList,
  guessesRemaining: 10,

  // Empty array to hold letters guessed by user. And checks if the user guessed the letter already
  guessedLetters: [],

  // Index to display graphic
  display: 0,
  currentWord: null,

  // Asks user if they are ready to play
  startGame: function() {
    var that = this;

    // Clears guessedLetters before a new game starts if it's not already empty.
    if(this.guessedLetters.length > 0){
      this.guessedLetters = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Ready to play?"
    }]).then(function(answer) {
      if(answer.play){
        that.newGame();
      } 

      else {
        console.log("Fine, I didn't want to play anyway...");
      }
    })},

  // If they want to play starts new game.
  newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Okay! Here we go!");
      console.log('*****************');

      // Generates random number based on the wordBank
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLets();

      // Displays current word as blanks.
      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } 

    else {
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
  resetGuessesRemaining: function() {
    this.guessesRemaining = 10;
  },
  keepPromptingUser : function(){
    var that = this;

    // Asks player for a letter
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Choose a letter:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {

      // toUpperCase because words in word bank are all caps
      var letterReturned = (ltr.chosenLtr).toUpperCase();

      // Adds to the guessedLetters array if it isn't already there
      var guessedAlready = false;
        for(var i = 0; i<that.guessedLetters.length; i++) {
          if(letterReturned === that.guessedLetters[i]) {
            guessedAlready = true;
          }
        }

        // If the letter wasn't guessed already run through entire function, else reprompt user
        if(guessedAlready === false){
          that.guessedLetters.push(letterReturned);

          var found = that.currentWord.checkIfLetterFound(letterReturned);

          // If none were found tell user they were wrong
          if(found === 0){
            console.log('Nope! You guessed wrong.');
            that.guessesRemaining--;
            that.display++;
            console.log('Guesses remaining: ' + that.guessesRemaining);
            console.log(hangManDisplay[(that.display)-1]);

            console.log('\n*******************');
            console.log(that.currentWord.wordRender());
            console.log('\n*******************');

            console.log("Letters guessed: " + that.guessedLetters);
          } 

          else {
            console.log('Yes! You guessed right!');

              // Checks to see if user won
              if(that.currentWord.didWeFindTheWord() === true){
                console.log(that.currentWord.wordRender());
                console.log('Congratulations! You won the game!!!');
              } 

              else {
                //  Display the user how many guesses remaining
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currentWord.wordRender());
                console.log('\n*******************');
                console.log("Letters guessed: " + that.guessedLetters);
              }
          }

          if(that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
            that.keepPromptingUser();
          }

          else if (that.guessesRemaining === 0) {
            console.log('Game over!');
            console.log('The word you were guessing was: ' + that.currentWord.word);
          }

        } 
        else {
            console.log("You've guessed that letter already. Try again.")
            that.keepPromptingUser();
          }
    });
  }
}


// Main Function
//==========================================================
hangman.startGame();