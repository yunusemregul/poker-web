var deck = [];
var houses = ["Diamond", "Club", "Heart", "Spades"];
var cardNames = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"]

var cards = [];
var board = [];
var pot = 0;
var chips = 0;

function Card(id, num, house, name)
{
  this.id = id;
  this.num = num;
  this.house = house;
  this.name = name;
}

