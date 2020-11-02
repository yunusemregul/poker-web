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
createDeck();
function drawCard() //Testing card draws
{
  var draw = Math.floor(Math.random()*52);//Is this truly random

  while (deck[draw] == undefined) //If the card is already drawn change the random number
  {
    if (draws == 52) //If the total amount of draws is 52 then the deck is empty
    {
      console.log("Empty deck");
      return 0;
    }
    draw = Math.floor(Math.random()*52);
  }
  var card = deck[draw];
  deck[draw] = undefined; //Set the card in the deck as undefined
  draws++;
  return card;
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
  for (i = 0;i < len; i++)
  {
    players[i].card1 = drawCard();
    players[i].card2 = drawCard();
  }
  console.log(players);
  //drawFlop();
}

function drawFlop()//Draw the initial 3 cards
{
  var burncard = drawCard();
  while (board.length < 3)
  {
    var card = drawCard();
    if (checkDrawnCard(card))
    {
      board.push(card);
    }
  }
  console.log(players);
  console.log(board);
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