//Create a Pixi Application
let app = new PIXI.Application({ width: 256, height: 256 });
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

$("body").append(app.view);

var stage = new PIXI.Container();

PIXI.loader.add("images/table.jpg").load(setup);

function setup() {
  var background = new PIXI.Sprite(PIXI.loader.resources["images/table.jpg"].texture);
  background.anchor.set(0.5);
  background.position.set(window.innerWidth / 2, window.innerHeight / 2);
  background.scale.set(window.innerHeight/1240 * 1.5);
  app.stage.addChild(background);
}
