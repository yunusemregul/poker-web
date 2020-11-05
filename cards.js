var deck = [];
var houses = ["Heart", "Spades", "Club", "Diamond"]; //I have to check rules to see if there's a stronger house
var cardNames = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"]


var draws; //Number of card drawn this game
var draw; //Actual drawn card
var card; //Card while drawing -- return a value cause we cant return the other since it changes
var turn;//0-2 for turn  0 - flop | 1 - turn | 2 - river
var players = [];
var board = [];

function Card(id, num, house, name)
{
  this.id = id; //Probably don't need id
  this.num = num;
  this.house = house;
  this.name = name;
}

function Player(id, name, chips)
{
  this.id = id;
  this.name = name;
  this.chips = chips;
  this.cards = []; //Probably don't need an array for 2 cards we could do player.card1 & card2

  this.removeChips = (amount) => {
    this.chips = this.chips - amount;
  }
  this.addChips = (amount) => {
    this.chips = this.chips + amount;
  }
}

exports.Player = Player;

function createDeck()
{
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

const serv = require("./server.js")  

function sendCardsToSocket(socket, cards){
  for (i = 0; i<2; i++){
    socket.emit("sendCards", cards[i].id, cards[i].num, cards[i].house);   
  }
}

function sendFlop(socket){
  for (i = 0; i<3; i++){
    socket.emit("sendFlop", board[i].id, board[i].num, board[i].house);
  }
}

exports.sendFlop = sendFlop;
exports.sendCardsToSocket = sendCardsToSocket;

function startRound()//Start of a round, give each player two cards, big blind and small blind removed
{
  var len;
  players = serv.connectedPlayers;
  console.log(serv.connectedPlayers);
  len = players.length;
  draws = 0;
  turn = 0;

  createDeck();

  for (var i = 0;i < len; i++)
  {
    for (var j = 0; j < 2; j++)
    {
      players[i].cards.push(drawCard());
    }
  }

  //bet();
}

exports.startRound = startRound;


function bet()
{
  console.clear();
  console.log(board);

  //betting occuring here


  switch(turn) {
    case 0:
    drawFlop();
    break;

    case 1:
    drawTurn();
    break;

    case 2:
    drawRiver();
    break;

    default:
    console.log("An error as occured");
  }
}

function drawFlop()//Draw the initial 3 cards
{
  drawCard();//burn a card

  for (i = 0; i < 3; i++)
  {
    board.push(drawCard());
  }
  turn++;
  //bet();
}

exports.drawFlop = drawFlop;

function drawTurn()//4th card
{
  drawCard();

  board.push(drawCard());
  turn++;
  //bet();
}


function drawRiver()//5th card
{
  drawCard();

  board.push(drawCard());
  turn++;
  //bet();
}


function revealCards()
{

}
