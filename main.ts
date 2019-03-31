/// <reference path="pixi.js.d.ts" />

var bullets: PIXI.Sprite[] = new Array<PIXI.Sprite>();
var bulletSpeed = 5;
var drag = false;

class Player {
    sprite: PIXI.Sprite; // son sprite
    att: PIXI.Texture; // sont shoot sprite

    constructor(sprite: PIXI.Sprite, att: PIXI.Texture, x: number, y: number) {
        this.sprite = sprite;
        this.att = att;

        this.sprite.position.x = x;
        this.sprite.position.y = y;
    }
}

class Ressources {
    private static loader = new PIXI.loaders.Loader();
    static textures: Map<String, PIXI.Texture> = new Map<String, PIXI.Texture>();

    static addTexture(name: String, t: PIXI.Texture) {
        Ressources.textures.set(name, t);
    }

    static loadRessources() {
        Ressources.loader
            .add('bunny', 'assets/bunny.png')
            .add('carrot', 'assets/carrot.png')
            .add('bunnyFire', 'assets/bunnyFire.png')
            .add('carrotFire', 'assets/carrotFire.png');

        console.log('Loading ressources...');
        
        Ressources.loader.onComplete.add(
            (loader: any, resources: any) => {
                console.log('Ressource loaded :D');
                Ressources.addTexture('bunny', resources.bunny.textue);
                Ressources.addTexture('carrot', resources.carrot.textue);
                Ressources.addTexture('bunnyFire', resources.bunnyFire.textue);
                Ressources.addTexture('carrotFire', resources.carrotFire.textue);

                Game.init();
            }
        );

        Ressources.loader.onProgress.add((a: any, b: any) => {
            console.log('Loading a file UwU');
            console.log(a);
            console.log(b);
        });

        Ressources.loader.onError.add((a: any, b: any) => {
            console.log('ERROR a file UwU');
            console.log(a);
            console.log(b);
        });

        Ressources.loader.onLoad.add((a: any, b: any) => {
            console.log('LOAD a file UwU');
            console.log(a);
            console.log(b);
        });
    }
}

class Game {

    static start() {
        console.log("Starting the game...");
        Ressources.loadRessources();
    }

    static renderer = PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb});  
    // create the root of the scene graph
    static stage = new PIXI.Container();

    static bunny: Player;
    static bunnyFire: Player;

    static init() {
        Game.stage.interactive = true;

        Game.stage.on("mousedown", function(e) {  
            shoot(Game.bunny);
        });

        Game.bunny = new Player(
            new PIXI.Sprite(Ressources.textures.get('bunny')),
            Ressources.textures.get('carrot'),
            200,
            150
        );
        Game.bunny.sprite.anchor.x = 0.5;
        Game.bunny.sprite.anchor.y = 0.5;
        createDragAndDropFor(Game.bunny.sprite);

        Game.bunnyFire = new Player(
            new PIXI.Sprite(Ressources.textures.get('bunnyFire')),
            Ressources.textures.get('carrotFire'),
            20,
            20
        );
        Game.bunnyFire.sprite.anchor.x = 0.5;
        Game.bunnyFire.sprite.anchor.y = 0.5;

        Game.bunnyFire.sprite.on('click', (event) => {
            alert("coucou");
        });

        var background = new PIXI.Graphics();  
        background.beginFill(0x123456);  
        background.drawRect(0,0,800,600);  
        background.endFill();
        Game.stage.addChild(background);

        Game.addPlayerToStage(Game.bunny);
        Game.addPlayerToStage(Game.bunnyFire);

        document.body.appendChild(Game.renderer.view);
        Game.animate();
    }

    static addPlayerToStage(p: Player) {
        Game.stage.addChild(p.sprite);
    }

    static animate() {
        requestAnimationFrame(Game.animate);

        // just for fun, let's rotate mr rabbit a little
        Game.bunny.sprite.rotation = rotateToPoint(
            Game.renderer.plugins.interaction.mouse.global.x,
            Game.renderer.plugins.interaction.mouse.global.y,
            Game.bunny.sprite.position.x,
            Game.bunny.sprite.position.y);

        for(let b = bullets.length-1; b >= 0; --b) {
            bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
            bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;
        
            if(outOfScreen(bullets[b])) {
                bullets[b].destroy();
                bullets.splice(b, 1);
            }
        }

        // render the container
        Game.renderer.render(Game.stage);
    }
}

function shoot(p: Player){
    const rotation = p.sprite.rotation;
    const startPosition = {
        x: p.sprite.position.x + Math.cos(p.sprite.rotation) * 20,
        y: p.sprite.position.y + Math.sin(p.sprite.rotation) * 20
    };

    let bullet = new PIXI.Sprite(p.att);

    bullet.position.x = startPosition.x;
    bullet.position.y = startPosition.y;
    bullet.rotation = rotation;

    Game.stage.addChild(bullet);
    bullets.push(bullet);
}

function rotateToPoint(mx: number, my: number, px: number, py: number){  
    var dist_Y = my - py;
    var dist_X = mx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle;
}

function outOfScreen(obj: PIXI.Sprite){
  // return obj.position.x > 800 || obj.position.x < 0 || obj.position.y < 0 || obj.position.y > 600;
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

function createDragAndDropFor(target: PIXI.Sprite){  
    target.interactive = true;

    target.on("mousedown", function(e){
        drag = true;
    });

    target.on("mouseup", function(e){
        drag = false;
    });

    target.on("mousemove", function(e){
        if(drag){
            target.position.x += (e.data.originalEvent as (MouseEvent)).x;
            target.position.y += (e.data.originalEvent as (MouseEvent)).y;
        }
    });
}

Game.start();