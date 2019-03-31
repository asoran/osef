/// <reference path="pixi.js.d.ts" />

var renderer = PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb});  
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// create a texture from an image path
var texture = PIXI.Texture.fromImage('assets/bunny.png');
var carrotTex = PIXI.Texture.fromImage('assets/carrot.png');

// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprite's anchor point
bunny.anchor.x = 0.5;  
bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
bunny.position.x = 200;  
bunny.position.y = 150;

var background = new PIXI.Graphics();  
background.beginFill(0x123456);  
background.drawRect(0,0,800,600);  
background.endFill();  
stage.addChild(background);

stage.addChild(bunny);

stage.interactive = true;

stage.on("mousedown", function(e){  
  shoot(bunny.rotation, {
    x: bunny.position.x+Math.cos(bunny.rotation)*20,
    y: bunny.position.y+Math.sin(bunny.rotation)*20
  });
})

var bullets: PIXI.Sprite[] = new Array();
var bulletSpeed = 5;

function shoot(rotation: number, startPosition: {x: number, y: number}){  
  var bullet = new PIXI.Sprite(carrotTex);
  bullet.position.x = startPosition.x;
  bullet.position.y = startPosition.y;
  bullet.rotation = rotation;
  stage.addChild(bullet);
  bullets.push(bullet);
}

function rotateToPoint(mx: number, my: number, px: number, py: number){  
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  //var degrees = angle * 180/ Math.PI;
  return angle;
}

// start animating
animate();  
function animate() {  
  requestAnimationFrame(animate);

  // just for fun, let's rotate mr rabbit a little
  bunny.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, bunny.position.x, bunny.position.y);

  for(var b=bullets.length-1;b>=0;b--){
    bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
    bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;

    if(outOfScreen(bullets[b]))
        bullets.splice(b, 1);
  }
  // render the container
  renderer.render(stage);
}

function outOfScreen(obj: PIXI.Sprite){
    if(obj.position.x > 800)
        return true;
    else if(obj.position.x < 0)
        return true;
    else if(obj.position.y < 0)
        return true;
    else if(obj.position.y > 600)
        return true;
    else
        return false;
}

var drag = false;  
createDragAndDropFor(bunny)

function createDragAndDropFor(target: PIXI.Sprite){  
  target.interactive = true;
  target.on("mousedown", function(e){
    drag = true;
  })
  target.on("mouseup", function(e){
    drag = false;
  })
  target.on("mousemove", function(e){
    if(drag){
      target.position.x += e.data.originalEvent.movementX;
      target.position.y += e.data.originalEvent.movementY;
    }
  })
}
