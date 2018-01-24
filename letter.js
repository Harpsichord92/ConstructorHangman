// Controls whether letter appears as "_" or as actual letter.
// Passes letter into game.js


var letter = function(let){
	this.charac = let;
	this.appear = false;
	this.letterRender = function(){
		return !(this.appear) ? "_" : this.charac;
	};
};

// Export the Constructor
module.exports = letter;