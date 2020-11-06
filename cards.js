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

function Card(id, num, house, name)
{
  this.id = id;//Probably don't need id
  this.num = num;
  this.house = house;
  this.name = name;
}

function Player(id, name, chips)
{
  this.id = id;
  this.name = name;
  this.chips = chips;
  this.cards = [];//Probably don't need an array for 2 cards we could do player.card1 & card2
  this.score;
  this.highCard;
  this.highPair;
  this.highTripple;
}

exports.Player = Player;

function createDeck()
{
  for (i=0;i < 52;i++) //Create all 52 cards with id, #, house and name
  {
    if (i < 13)
    {
      deck[i] = new Card(i, i+1, houses[0], cardNames[i]);
    }
    if (i > 12 && i < 26)
    {
      deck[i] = new Card(i, i-12, houses[1], cardNames[i-13]);
    }
    if (i > 25 && i < 39)
    {
      deck[i] = new Card(i, i-25, houses[2], cardNames[i-26]);
    }
    if (i > 38)
    {
      deck[i] = new Card(i, i-38, houses[3], cardNames[i-39]);
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

function main()
{
  turn = 0;
  gameOn = true;

  while(gameOn == true) {
    switch(turn) {
      case 0:
      startRound();
      showBoard();
      turn++;
      break;

      case 1:
      drawFlop();
      showBoard();
      turn++;
      break;

      case 2:
      drawTurn();
      showBoard();
      turn++;
      break;

      case 3:
      drawRiver();
      showBoard();
      turn++;
      break;

      case 4:
      countScore();
      turn++;
      break;

      default:
      gameOn = false;
    }
  }
}

function startRound()//Start of a round, give each player two cards, big blind and small blind removed
{
  /*players = serv.connectedPlayers;
  console.log(serv.connectedPlayers);*/
  players[0] = new Player(0,"Pwhy", 500000);
  players[1] = new Player(1,"Charozoid", 666);

  draws = 0;

  createDeck();

  for(var i = 0;i < players.length;i++) {
    players[i].score = 0;
    players[i].highTripple = 0;
    players[i].highPair = 0;
    players[i].highCard = 0;
  }

  for (var i = 0;i < 2; i++)
  {
    for (var j = 0; j < players.length; j++)
    {
      players[i].cards.push(drawCard());
    }
  }
}

//exports.startRound = startRound;


function showBoard()
{
  //console.clear();

  console.log("############### Board ###############");

  if(turn > 0)
  {
      for(var i = 0;i < 3;i++)
        console.log(board[i].name + " of " + board[i].house);
  }

  if(turn > 1)
  {
      console.log(board[3].name + " of " + board[3].house);
  }

  if(turn > 2)
  {
      console.log(board[4].name + " of " + board[4].house);
  }

  console.log("#####################################");
  
  showCard();
}

function drawFlop()//Draw the initial 3 cards
{
  drawCard();//burn a card

  for (i = 0; i < 3; i++)
  {
    board.push(drawCard());
  }
}

function showCard()
{
  console.log("Player 1 has : \n" + players[0].cards[0].name + " of " + players[0].cards[0].house + "\n" + players[0].cards[1].name + " of " + players[0].cards[1].house);
  console.log("#####################################");
  console.log("Player 2 has : \n" + players[1].cards[0].name + " of " + players[1].cards[0].house + "\n" + players[1].cards[1].name + " of " + players[1].cards[1].house);
}


function drawTurn()//4th card
{
  drawCard();

  board.push(drawCard());
}


function drawRiver()//5th card
{
  drawCard();

  board.push(drawCard());
}


function countScore() {

  for(var i = 0;i < players.length;i++) {
    checkPlayerScore(i);
    console.log("Player " + (i + 1) + " : " + players[i].score);
    console.log("highCard " + " : " + players[i].highCard);
    console.log("highPair " + " : " + players[i].highPair);
    console.log("highTripple " + " : " + players[i].highTripple);
  }


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



  console.log(players[winner].name);

}

function checkPlayerScore(playerId) {

  scoreCard = [];

  for(var i = 0;i < 5;i++)
    scoreCard.push(board[i]);

  for(var i = 0;i < 2;i++)
    scoreCard.push(players[playerId].cards[i]);

  scoreCard.sort(function (a , b) {
    return a.num - b.num;
  });

  console.log(scoreCard);


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

              if(scoreCard[i].num == 1)
                players[playerId].highTripple = 14;
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




main();

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