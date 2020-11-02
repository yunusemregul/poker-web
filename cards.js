var deck = [];
var houses = ["Heart", "Spades", "Club", "Diamond"]; //I have to check rules to see if there's a stronger house
var cardNames = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"]

function Card(id, num, house, name)
{
  this.id = id;//Probably don't need id
  this.num = num;
  this.house = house;
  this.name = name;
}

function Player(id, chips)
{
  this.id = id;
  this.chips = chips;
  this.cards = [];//Probably don't need an array for 2 cards we could do player.card1 & card2
}
var draws;
function createDeck()
{
  draws = 0;
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
var drawnCards = []; //I copy drawn cards in this array
createDeck();
function drawCard() //Testing card draws
{
  var draw = Math.floor(Math.random()*52);//Is this truly random
  if (draws == 52)
  {
    console.log("Empty deck");
    return 0;
  }
  if (drawnCards[draw] == undefined)
  { //Check the drawncard array for already drawn cards
    if (deck[draw] == undefined)
    {
     console.log("Trying to draw already drawn card")
     return 0;
    }
    console.log(draw);
    console.log(deck);
    draws++;
	  var card = deck[draw];
	  drawnCards[draw] = card
    deck[draw] = undefined;
    return card;
  }
  else 
  { //If the card is already drawn we start over, need to fix the loop after we draw all cards
	 drawCard();
  }
}

function resetDrawnCards()//Cleans the drawncard array
{
  for (i=0;i<52;i++)
  {
    drawnCards[i] = undefined;
  }
}

var players = [];
var board = [];
function startRound()//Start of a round, give each player two cards, big blind and small blind removed
{
  //createDeck();
  //resetDrawnCards();
  players[0] = new Player(0, 1000);
  players[1] = new Player(1, 1000);

  var len = players.length;
  for (i=0;i < len;i++)
  {
    players[i].cards[0] = drawCard();
    players[i].cards[1] = drawCard();
  }
}

function drawFlop()//Draw the initial 3 cards
{
  var burncard = drawCard();
  for (i=0;i<3;i++)
  {
    var card = drawCard();
    board[i] = card;
    console.log(drawCard());
  }
  //console.log(board);

}
function drawTurn()//4th card
{

}
function drawRiver()//5th card
{

}
function revealCards()
{

}