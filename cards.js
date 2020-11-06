const serv = require("./server.js")
const table = require("./table.js")

var deck = [];
var houses = ["Heart", "Spades", "Club", "Diamond"]; //I have to check rules to see if there's a stronger house
var cardNames = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"]


var draws; //Number of card drawn this game
var draw; //Actual drawn card
var card; //Card while drawing -- return a value cause we cant return the other since it changes
var turn;//0-2 for turn  0 - flop | 1 - turn | 2 - river
var players = [];
var board = [];
var gameOn;
var scoreCard;
var winner;
exports.winner = winner;

function Card(id, num, house, name)
{
  this.id = id;//Probably don't need id
  this.num = num;
  this.house = house;
  this.name = name;
}

function Player(id, name, chips, socket)
{
  this.id = id;
  this.name = name;
  this.chips = chips;
  this.cards = [];//Probably don't need an array for 2 cards we could do player.card1 & card2
  this.score;
  this.highCard;
  this.highPair;
  this.highTripple;
  this.cards = []; //Probably don't need an array for 2 cards we could do player.card1 & card2
  this.socket = socket;
  this.fold = false;

  this.removeChips = (amount) => {
    if (this.chips - amount < 0){
      console.log("Not enough chips");
      return false;
    }
    this.chips = this.chips - amount;
    return true;
  }
  this.addChips = (amount) => {
    this.chips = this.chips + amount;
  }
  this.updateChips = () => {
    serv.io.to(this.id).emit("update_chips", this.chips);
  }
  this.sendCards = () => {
    for (i = 0; i < 2; i++)
    {
      serv.io.to(this.id).emit("cards_send", this.cards[i].id, this.cards[i].num, this.cards[i].house);      
    }
  }
}

exports.Player = Player;

function createDeck()
{
  deck = [];
  for (i=0;i < 52;i++) //Create all 52 cards with id, #, house and name
  {
    if (i < 13)
    {
      deck[i] = new Card(i, i+1, 0, cardNames[i]);
    }
    if (i > 12 && i < 26)
    {
      deck[i] = new Card(i, i-12, 1, cardNames[i-13]);
    }
    if (i > 25 && i < 39)
    {
      deck[i] = new Card(i, i-25, 2, cardNames[i-26]);
    }
    if (i > 38)
    {
      deck[i] = new Card(i, i-38, 3, cardNames[i-39]);
    }
  }
}

function drawCard() //Testing card draws
{
  draw = Math.floor(Math.random()*52);//Is this truly random

  while (deck[draw] == undefined) //If the card is already drawn change the random number
  {
    if (draws == 52) //If the total amount of draws is 52 then the deck is empty
    {
      console.log("Empty deck");
      return 0;
    }
    draw = Math.floor(Math.random()*52);
  }
  card = deck[draw];
  deck[draw] = undefined; //Set the card in the deck as undefined to indicate it has been drawn
  draws++;
  return card;
}
exports.drawCard = drawCard;

function startRound()//Start of a round, give each player two cards, big blind and small blind removed
{

  players = serv.connectedPlayers;
  table.pot = 0;
  table.playersInPlay = players.length;
  board = [];
  table.phases = 0;
  draws = 0;

  createDeck();

  for (var i = 0;i < players.length; i++)
  {
    players[i].score = 0;
    players[i].highTripple = 0;
    players[i].highPair = 0;
    players[i].highCard = 0;
    players[i].fold = false;
    players[i].cards = [];//Reset cards after each round start
    for (var j = 0; j < 2; j++)
    {
      players[i].cards.push(drawCard());     
    }
    players[i].sendCards();
  }
}
exports.startRound = startRound;

function drawFlop()//Draw the initial 3 cards
{
  drawCard();//burn a card

  for (i = 0; i < 3; i++)
  {
    board.push(drawCard());
  }
}

exports.drawFlop = drawFlop;

function sendFlop(){ //Send the flop to all players
  for (i = 0; i<3; i++){
    serv.io.sockets.emit("flop_send", board[i].id, board[i].num, board[i].house);
  }
}

exports.sendFlop = sendFlop;

function drawTurn()//4th card
{
  drawCard();

  board.push(drawCard());
}
exports.drawTurn = drawTurn;

function sendTurn(){ //Send the flop to all players
  serv.io.sockets.emit("turn_send", board[3].id, board[3].num, board[3].house);
}
exports.sendTurn = sendTurn;

function drawRiver()//5th card
{
  drawCard();

  board.push(drawCard());
  console.log(board);
}
exports.drawRiver = drawRiver;

function sendRiver(){ //Send the flop to all players
  serv.io.sockets.emit("river_send", board[4].id, board[4].num, board[4].house);
}
exports.sendRiver = sendRiver;

function countScore() {
  winner = 0;

  for (var i = 0;i < players.length;i++) {
    if(players[i].score > players[winner].score)
      winner = i;

    if(players[i].score == players[winner].score){
      switch(players[i].score) {
        case 0:
        if(players[i].highCard > players[winner].highCard)
          winner = i;
        break;

        case 1:
        if(players[i].highPair > players[winner].highPair)
          winner = i;
        break;

        case 2:
        if(players[i].highPair > players[winner].highPair)
          winner = i;
        break;

        case 3:
        if(players[i].highTripple > players[winner].highTripple)
          winner = i;
        break;

        case 4:
        if(players[i].highCard > players[winner].highCard)
          winner = i;
        break;

        case 5:
        if(players[i].highCard > players[winner].highCard)
          winner = i;
        break;

        case 6:
        if(players[i].highTripple > players[winner].highTripple)
          winner = i;

        if(players[i].highTripple == players[winner].highTripple)
          if(players[i].highPair > players[winner].highPair)
            winner = i;
        break;

        case 7:
        if(players[i].highPair > players[winner].highPair)
          winner = i;
        break;

        case 8:
        if(players[i].highCard > players[winner].highCard)
          winner = i;
        break;
      }
    }
  }
  return players[winner];
}

exports.countScore = countScore;
function checkPlayerScore(playerId) {

  scoreCard = [];

  for(var i = 0;i < 5;i++)
    scoreCard.push(board[i]);

  for(var i = 0;i < 2;i++)
    scoreCard.push(players[playerId].cards[i]);

  scoreCard.sort(function (a , b) {
    return a.num - b.num;
  });

  //console.log(scoreCard);

  //highCard
  for(var i = 0;i < 7;i++) {
    if(scoreCard[i].num > players[playerId].highCard) {
      players[playerId].highCard = scoreCard[i].num;

      if(scoreCard[i].num == 1)
        players[playerId].highCard = 14;
    }
  }


  //tripple
    for(var i = 0;i < 5;i++)
      for(var j = i + 1;j < 6;j++)
        if(scoreCard[i].num == scoreCard[j].num)
          for(var k = j + 1;k < 7;k++)
            if(scoreCard[i].num == scoreCard[k].num) {
              players[playerId].score = 3;
              players[playerId].highTripple = scoreCard[i].num;
            }

  //pair
  for(var i = 0;i < 6;i++)
    for(var j = i + 1;j < 7;j++)
      if(scoreCard[i].num == scoreCard[j].num && scoreCard[i].num != players[playerId].highTripple) {

        if(scoreCard[i].num > players[playerId].highPair)
          players[playerId].highPair = scoreCard[i].num;

        if(scoreCard[i].num == 1)
          players[playerId].highPair = 14;

        if(players[playerId].score < 2)
          players[playerId].score++;

        if(players[playerId].score == 3)
          players[playerId].score = 6;
      }    

  if(players[playerId].highPair == 1)
    players[playerId].highPair == 14;

  if(players[playerId].highTripple == 1)
    players[playerId].highTripple == 14;

  //four of a kind
  var four = 0;

  for(var i = 0;i < 4;i++) {
    for(var j = i + 1;j < 7;j++) {
      if(scoreCard[i] == scoreCard[j])
        four++;
    }

    if(four == 4) {
      players[playerId].score = 7;

      players[playerId].highPair = scoreCard[i].num;

      if(scoreCard[i].num == 1)
        players[playerId].highPair = 14;
    }

    else
      four = 0;
  }
  
    

  //straight
  var straight = 0;
  var addedCard = 0;

  for(var i = 0;i < 7;i++) {
    if(scoreCard[i].num == 1){
      scoreCard.push(new Card(0,14,0,0));
      addedCard++;
    }
  }

  for(var i = 0;i < 3 + addedCard;i++){
    if(scoreCard[i].num + 1 == scoreCard[i + 1].num)
      straight = 1;


      while(straight > 0) {
        for(var j = 0;j < 4;j++) {
          if(scoreCard[i + j].num + 1 == scoreCard[i + j + 1].num) {
            straight++;
            if(straight == 5 && players[playerId].score < 5) {
              players[playerId].highCard = scoreCard[i + j + 1].num;
              players[playerId].score = 4;
              straight = 0;
            }
          }

          else if(scoreCard[i + j].num != scoreCard[i + j + 1].num)
            straight = 0;
        }

        if(straight < 5)
            straight = 0;
      }
    }

    if(addedCard > 0) {
      for(var i = 7;i < 7 + addedCard;i++)
        scoreCard[i] = undefined;
    }

  //flush
  var flushCard = [];
  var flush = 0;

  for(var i = 0;i < 3;i++) {

    if(flush < 4) {
      flushCard.push(scoreCard[i]);

      for(var j = i + 1;j < 7;j++) {
        if(scoreCard[i].house == scoreCard[j].house) {
          flush++;
          flushCard.push(scoreCard[j]);
        }
      }
    }

    if(flush >= 4 && players[playerId].score < 5)
      players[playerId].score = 5;

    if(flush < 4) {
          flush = 0;
          flushCard = [];
    }

  }


  //straight flush
  straight = 0;

  if(flush == 4) {

    players[playerId].highCard = 0;

    for(var i = 0;i < flushCard.length;i++) {
      if(flushCard[i].num == 1){
        flushCard.push(new Card(0,14,0,0));
      }

        if(flushCard[i].num > players[playerId].highCard)
          players[playerId].highCard = flushCard[i].num;
    }

    for(var i = 0;i < flushCard.length - 1;i++)
      if(flushCard[i].num + 1 == flushCard[i + 1].num)
        straight++;


    if(straight > 3)
      players[playerId].score = 8
  }
}
exports.checkPlayerScore = checkPlayerScore;
/*
Six of Spades
Jack of Spades
Ten of Club
Five of Heart
Ace of Diamond
#####################################
Player 1 has :
Three of Club
Six of Diamond
#####################################
Player 2 has :
Ace of Club
Seven of Spades
*/