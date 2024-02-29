
  class Setup {
  static playerone = document.getElementById('usernameone');
  static playertwo = document.getElementById('usernametwo');
  static playercolor = document.getElementById('firstcolor');
  static playercolortwo = document.getElementById('secondcolor');
  static sbutton = document.getElementById('sbutton');
  static info = document.getElementById('board');

  constructor() {
    //This is the start button.
    //This activates the game......
    this.button = document.getElementById('sbutton');
    this.button.addEventListener('click', this.buttoncheck.bind(this));
    
  }

  phaseone() {
    const minChar = 3;
    const maxChar = 10;

    if (Setup.playerone.value.length < minChar || Setup.playerone.value.length > maxChar) {
      console.log('Unfortunately, the username is not allowed');
    } else {
      const playeroneinput = Setup.playerone.value;
      return playeroneinput;
    }
  }
//Hiddes the first page...
  buttoncheck(event) {
    Setup.hideElement(Setup.playerone);
    Setup.hideElement(Setup.playertwo);
    Setup.hideElement(Setup.playercolor);
    Setup.hideElement(Setup.playercolortwo);
    Setup.hideElement(Setup.sbutton);
  }
 
  static hideElement(element) {
    if (element) {
      element.style.display = 'none';
    }
  }
}
//This Class is creating the board...
class Game {
  constructor() {
    this.width = 7;
    this.height = 6;
    this.currPlayer = 1;
    this.board = [];
    this.boardElement = null;
    this.rebutton = 0;
   
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
      
    }
  }

  makeHtmlBoard() {
    const board = document.createElement('table');
    board.setAttribute('id','board');

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', (event) => this.handleClick(event));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }

    this.boardElement = board;
    //create a class that will pull from another class information and display onto the current Game class.
    const userone = Setup.playerone.value;
    const usertwo = Setup.playertwo.value;
    const userOneColor = Setup.playercolor;
    const userTwoColor = Setup.playercolortwo;
    //Create a div that will have teh userone and user two and inputs.
    const displayNameOne = document.createElement('div');
    const displayNameTwo = document.createElement('div');
    const colorDisplayOne = document.createElement('lable');
    const colorDisplayTwo = document.createElement('label');
    //Create an id to i have a way to style them in css.
    displayNameOne.setAttribute('id','displayNameOne');
    displayNameTwo.setAttribute('id','displayNameTwo');
    colorDisplayOne.setAttribute('id','colorone');
    colorDisplayTwo.setAttribute('id','colortwo');
    //I could do .id but I want to be proffesional...
    //Assing userone, usertwo and the innertext.
    displayNameOne.innerHTML = userone;
    displayNameTwo.innerHTML = usertwo;
    colorDisplayOne.innerhtml = userOneColor;
    colorDisplayTwo.innerhtml = userTwoColor;
 
    //Append Setup.makeHtmlBoard.appendChild(displayNameOne)
    this.boardElement.appendChild(displayNameOne);
    this.boardElement.appendChild(displayNameTwo);
    this.boardElement.appendChild(colorDisplayOne);
    this.boardElement.appendChild(colorDisplayTwo);
    //Creating a class inside this in order for the alerts to be displayed accuratly working.
    //quick test, create a element that will disapper when you click the button but will create a new one.
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

    endGame(msg) {
      const uAlert = document.createElement('div');
      uAlert.classList = 'msgInfo';
      uAlert.innerHTML = msg;
      this.boardElement.appendChild(uAlert);
      const restartButton = document.createElement('button');
      restartButton.id = 'restart';
      restartButton.innerHTML = 'New Game!';
      restartButton.addEventListener('click', () => this.resetGame());
      this.boardElement.appendChild(restartButton);
    }
    resetGame() {
      this.currPlayer = 1;
      this.board = [];
      if (this.boardElement) {
        this.boardElement.remove(); 
      }
      this.makeBoard(); 
      this.makeHtmlBoard();
      document.body.appendChild(this.boardElement);
    } 
//Keep track of the amount of games placed.

  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    //First lets make this an actual div instead of an alert this way the consumer is actually feels haveif they fixed something.
    if(this.checkForWin(this.currPlayer)){
      if(this.currPlayer === 1) {
        return this.endGame(`${displayNameOne.innerHTML} Won!`);
      }
      if (this.checkForWin(this.currPlayer)){
        if(this.currPlayer === 2){
          return this.endGame(`${displayNameTwo.innerHTML} Won!`);
        }
      }
    }
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    /*I will make a if statement that what ever the outcome the chart will become empty. */
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }
//create class called Double check. This will check if the num is 1 then i will return the players name as displayed. if the player is 2 then i will displayt that one. simple
  checkForWin() {
    const self = this;
    function _win(cells) {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < self.height &&
          x >= 0 &&
          x < self.width &&
          self.board[y][x] === self.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}


const setupGame = new Setup();
const connectFourGame = new Game();


setupGame.button.addEventListener('click', () => {
  const playerOne = setupGame.phaseone();
  connectFourGame.makeBoard();
  connectFourGame.makeHtmlBoard();
  document.body.appendChild(connectFourGame.boardElement);
});

setupGame.button.addEventListener('click', () => {
  const playerOne = setupGame.phaseone();
  connectFourGame.resetGame(); 
  document.body.appendChild(connectFourGame.boardElement);
});


