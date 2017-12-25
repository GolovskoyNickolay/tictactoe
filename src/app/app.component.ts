import {Component, OnInit} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AlertController} from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  mode: string = 'pve';
  turn: string = 'X';
  clickedCell: number;
  showLoader: boolean = false;
  playerOne: string = 'X';
  playerTwo: string = this.playerOne === 'X' ? 'O' : 'X';
  winner: string = '';
  gameBegin: boolean = false;
  board: Array<string> = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  winArrays: number[][] = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],

    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],

    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    //shuffle array
    let counter = this.winArrays.length;
    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = this.winArrays[counter];
      this.winArrays[counter] = this.winArrays[index];
      this.winArrays[index] = temp;
    }
  }

  newGame() {
    this.turn = 'X';
    this.playerOne = 'X';
    this.playerTwo = 'O';
    this.showLoader = true;
    this.gameBegin = false;
    this.winner = '';
    this.board = this.board.map(item => item = '');
    setTimeout(() => {
      this.showLoader = false;
    }, 500)
  }

  choosePlayer(p) {
    this.gameBegin = true;
    if (p === 'O') {
      this.playerOne = p;
      this.playerTwo = 'X';
      this.turn = p;
      this.compLogic();
    }
  }

  userMove(n) {
    if (this.board[n] !== '') {
      return;
    }
    this.clickedCell = n;
    this.board[n] = this.turn;
    this.gameBegin = true;
    this.showLoader = true;
    if (this.mode === 'pve') {
      setTimeout(() => {
        this.compLogic();
        this.showLoader = false;
        this.checkWinner();
      }, 500);
    } else {
      this.showLoader = false;
      this.turn = this.turn === this.playerOne ? this.playerTwo : this.playerOne;
      this.checkWinner();
    }
  }


  compLogic() {
    preventPlayerWin: for (let winArraysItem = 0; winArraysItem < this.winArrays.length; winArraysItem++) {
      let winArray = this.winArrays[winArraysItem];
      let userFillCells = 0;
      let compFillCells = 0;
      let emptyCell: number;
      for (let winCell = 0; winCell < winArray.length; winCell++) {
        if (this.board[winArray[winCell]] === '') {
          emptyCell = winArray[winCell];
        }
        if (this.board[winArray[winCell]] === this.playerOne) {
          userFillCells += 1;
        }
        if (this.board[winArray[winCell]] === this.playerTwo) {
          compFillCells += 1;
        }
        if (compFillCells === 3 && userFillCells === 0) {
          break preventPlayerWin;
        }
        if (userFillCells === 3 && compFillCells === 0 && emptyCell) {
          this.generateClick(emptyCell);
          return;
        }
      }
    }

    nextMoveLoop: for (let winArraysItem = 0; winArraysItem < this.winArrays.length; winArraysItem++) {
      let winArray = this.winArrays[winArraysItem];
      for (let winCell = 0; winCell < winArray.length; winCell++) {
        if (this.board[winArray[winCell]] !== '' && this.board[winArray[winCell]] === this.playerOne) {
          if (winArraysItem === this.winArrays.length - 1) {
            for (let boardItem = 0; boardItem < this.board.length; boardItem++) {
              if (this.board[boardItem] === '') {
                this.generateClick(boardItem);
                break nextMoveLoop;
              }
            }
          }
          break;
        }
        if (winArray.length - 1 === winCell) {
          for (let winCell = 0; winCell < winArray.length; winCell++) {
            if (this.board[winArray[winCell]] == '') {
              this.generateClick(winArray[winCell]);
              break nextMoveLoop;
            }
          }
        }
      }
    }
  }

  generateClick(cell) {
    this.board[cell] = this.playerTwo;
    this.clickedCell = cell;
  }

  checkWinner() {
    for (let winArraysItem = 0; winArraysItem < this.winArrays.length; winArraysItem++) {
      let winArray = this.winArrays[winArraysItem];
      let countX = 0;
      let countO = 0;
      for (let winCell = 0; winCell < winArray.length; winCell++) {
        if (this.board[winArray[winCell]] === 'X') {
          countX += 1;
        }
        if (this.board[winArray[winCell]] === 'O') {
          countO += 1;
        }
        if (countX === 4 || countO === 4) {
          this.winner = countX > countO ? 'X' : 'O';
          this.presentConfirm(`Winner is ${this.winner}`);
          return;
        }
      }
    }

    let lastMove = true;
    this.board.forEach((item, index) => {
      if (item === '') {
        lastMove = false;
      }
      if (lastMove && index === this.board.length - 1) {
        this.presentConfirm('It\'s a draw');
        this.winner = 'Draw';
      }
    });
  }

  presentConfirm(txt) {
    let alert = this.alertCtrl.create({
      title: 'The end',
      message: txt,
      buttons: [
        {
          text: 'New game',
          handler: () => {
            this.newGame();
          }
        }
      ]
    });
    alert.present();
  }
}

