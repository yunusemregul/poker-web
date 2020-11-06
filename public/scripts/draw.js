//Create a Pixi Application
let app = new PIXI.Application({ width: 256, height: 256 });
app.renderer.backgroundColor = 0x2b373a;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

$("body").append(app.view);

PIXI.loader.add("assets/table.jpg").add("cards", "assets/cards.json").load(setup);

function createCardFace(x, y) {
  var tex = PIXI.loader.resources["cards"].textures;

  var face = new PIXI.Container();

  var sprite = new PIXI.Sprite(tex["white1.png"]);
  var sprite2 = new PIXI.Sprite(PIXI.Texture.EMPTY);
  var sprite3 = new PIXI.Sprite(PIXI.Texture.EMPTY);
  var sprite4 = new PIXI.Sprite(PIXI.Texture.EMPTY);

  sprite2.y = -120;
  sprite2.x = -80;
  sprite3.y = 70;
  sprite3.x = 40;
  sprite4.y = -70;
  sprite4.x = -100;

  sprite.anchor.set(0.5);
  sprite2.anchor.set(0.5);
  sprite3.anchor.set(0.5);
  face.addChild(sprite);
  face.addChild(sprite2);
  face.addChild(sprite3);
  face.addChild(sprite4);

  face.position.set(x, y);

  face.scale.x = face.scale.y = 0.5;

  return face;
}

function updateFace(face, id, num, suit) {
  num = num + 1;
  suit = suit + 1;
  //console.log(num, suit);
  var tex = PIXI.loader.resources["cards"].textures;

  face.children[1].texture = num > 0 ? tex[(suit % 2) + "_" + num + ".png"] : PIXI.Texture.EMPTY;
  face.children[2].texture = suit !== 0 ? tex[suit + "_big.png"] : PIXI.Texture.EMPTY;
  face.children[3].texture = suit !== 0 ? tex[suit + "_small.png"] : PIXI.Texture.EMPTY;

  face.id = id; //This is used to find the children in app.stage.children
}

function setup() {
  var background = new PIXI.Sprite(PIXI.loader.resources["assets/table.jpg"].texture);
  background.anchor.set(0.5);
  background.position.set(window.innerWidth / 2, window.innerHeight / 2);
  background.scale.set((window.innerHeight / 1240) * 1.5);

  app.stage.addChild(background);
}

var cardFaces = []; //Store the play cards faces in this array

function drawCards() {
  for (i = 0; i < 2; i++) {
    cardFaces[i] = createCardFace(850 + i * 150, 600);
    app.stage.addChild(cardFaces[i]);
    console.log(cardFaces);
  }
}

var boardFaces = []; //Store the board faces in this array

function drawFlop() {
  //Create the 3 flop cards faces
  for (i = 0; i < 3; i++) {
    boardFaces[i] = createCardFace(600 + i * 150, 300);
    app.stage.addChild(boardFaces[i]);
  }
}

function drawTurn() {
  //Create the turn card face
  boardFaces[3] = createCardFace(1050, 300);
  app.stage.addChild(boardFaces[3]);
}

function drawRiver() {
  //Create the river card face
  boardFaces[4] = createCardFace(1200, 300);

  app.stage.addChild(boardFaces[4]);
}
