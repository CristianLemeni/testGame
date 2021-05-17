import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'
import {Loader} from './loader'
import { Background } from './background'
import { PlayerSpaceship } from './playerSpaceship'
import { Spaceship } from './spaceship'
import { TimelineMax, TimelineLite } from "gsap"

export class Init {

    private app!: PIXI.Application
    private loader!: Loader

    public initialWidth: number
    public initialHeight: number

    constructor(){
        this.initialWidth = window.innerWidth
        this.initialHeight = window.innerHeight
    }

    init(pixiApp: PIXI.Application, canvas: HTMLCanvasElement){
        this.app = pixiApp

        this.loader = new Loader()
    }

    loadGraphics(graphics: Array<string>){
        this.loader.loadGraphics(graphics)
    }
    
    startGame(){
        let mainContainer = new PIXI.Container()
        this.app.stage.addChild(mainContainer)
        

       let menu = this.addUI(mainContainer)
       

       document.addEventListener("gameStarted", () => {
            menu.backgroundContainer.visible = false
            let bk = this.addBackground(mainContainer)

            let player = this.addPlayer(mainContainer)

            let missiles = this.loader.getLoaderManager().resources["assets/gameAssets.json"].textures

            document.addEventListener("keypress", (evt) => {
                if(evt.key == " "){
                    //@ts-ignore
                    player.shoot("PlayerProjectile", missiles["spaceRockets_001.png"], 1.5708, 0.1, mainContainer)
                }
            })

            let mainEnemyLoop = new TimelineMax({repeat: -1, repeatDelay: 1.9})

            let allEnenemies: any = []
            let movementTimelines: any = []
            mainEnemyLoop.add(() => {
                let enemy = this.addEnemy(mainContainer)
                enemy.shipContainer.position.set(800 + enemy.shipContainer.width, Math.floor(Math.random() * (600 + 1)))
                allEnenemies.push(enemy)
                let movement = new TimelineMax()
                movement.to(enemy.shipContainer, 10, {x: -enemy.shipContainer.width, ease: "none"}, 0)
                movement.to(enemy.shipContainer, 5, {y: Math.floor(Math.random() * (600 + 1)), ease: "none"}, Math.floor(Math.random() * (3 + 1)))
                movement.eventCallback("onComplete", () => {
                    //@ts-ignore
                    movementTimelines = movementTimelines.filter(item => item !== movement)
                })
                movementTimelines.push(movement)
            }, 0.1)
            let explosionFrames = this.loader.getLoaderManager().resources["assets/fire_explosion.json"].spritesheet?.animations
            let collisionTimeline = new TimelineMax({repeat: -1, paused: true})
            collisionTimeline.add(()=>{
                try{
                    for(let i = 3; i < mainContainer.children.length; i++){
                        if(mainContainer.children[i].name == 'PlayerProjectile'){
                            for(let j = 0; j < allEnenemies.length; j++){
                                if(this.collision(mainContainer.children[i], allEnenemies[j].shipBody)){
                                    this.explosionAnimation(explosionFrames, allEnenemies[j].shipContainer.position, this.app.stage)
                                    mainContainer.removeChild(mainContainer.children[i])
                                    mainContainer.removeChild(allEnenemies[j].shipContainer)
                                    allEnenemies.splice(j, 1)
                                    console.log('enemy has been shot')
                                    collisionTimeline.delay(2)
                                }
                            }
                        }
                        else{
                            if(this.collision(mainContainer.children[i], player.shipBody)){
                                this.explosionAnimation(explosionFrames, player.shipContainer.position, this.app.stage)
                                mainContainer.removeChild(player.shipContainer)
                                console.log('player has been shot')
                                bk.backgroundContainer.destroy()
                                for(let e = 0; e < allEnenemies.length; e++){
                                    allEnenemies[e].shipContainer.destroy()
                                }
                                player.shipContainer.destroy()
                                collisionTimeline.delay(2)
                                document.dispatchEvent(new CustomEvent("gameOver"))
                            }
                        }
                    }
    
                }catch(e){}
                }, 0.1)
            collisionTimeline.play()


            document.addEventListener("gameOver", () => {
                menu.backgroundContainer.visible = true
                mainEnemyLoop.kill()
                collisionTimeline.kill()
                for(let i = 0; i < movementTimelines.length; i++){
                    movementTimelines[i].kill()
                }
            })
       })
                
    }

    addBackground(container: PIXI.Container){
        let gameBk = new Background(container)
        let starsTextures = this.loader.getLoaderManager().resources["assets/stars.json"].textures
        let cloudsTextures = this.loader.getLoaderManager().resources["assets/spaceclouds.json"].textures
        if(starsTextures && cloudsTextures){
            gameBk.addBackground(starsTextures["stars.png"])
            gameBk.addParalax(cloudsTextures["purpleCloud.png"])
        }

        return gameBk
    }

    addUI(container: PIXI.Container){
        let mainMenuBk = new Background(container)
        let bkTextures = this.loader.getLoaderManager().resources["assets/menuBK.json"].textures
        let gmTextures = this.loader.getLoaderManager().resources["assets/gameAssets.json"].textures
        let menuBkContainer = new PIXI.Container()
        if(bkTextures && gmTextures){
            mainMenuBk.addBackground(bkTextures["BG.png"]) 
            
            let asteroids = this.addAsteroids(menuBkContainer)
            asteroids!.emit = true

            let exitBtn = new PIXI.Sprite(gmTextures["Exit_BTN.png"])
            exitBtn.interactive = true;
            exitBtn.scale.set(0.75)
            exitBtn.anchor.set(0.5)
            exitBtn.position.set(500, 700)
            exitBtn.buttonMode = true
            menuBkContainer.addChild(exitBtn)

            let logo = new PIXI.Sprite(gmTextures["Header.png"])
            logo.scale.set(0.25)
            logo.anchor.set(0.5)
            logo.position.set(500, 100)
           
            exitBtn.on("mousedown", () => {
                this.exitGame()
            })

            let menuBk = new PIXI.Sprite(gmTextures["Window.png"])
            menuBk.scale.set(0.5)
            menuBk.anchor.set(0.5)
            menuBk.position.set(500, 350)
            menuBkContainer.addChild(menuBk)

            menuBkContainer.addChild(logo)

            mainMenuBk.backgroundContainer.scale.set(0.75)
            let style = {
                "dropShadow": true,
                "dropShadowAngle": 1.1,
                "dropShadowBlur": 5,
                "dropShadowDistance": 3,
                "fill": "#0c6dd4",
                "fontFamily": "Courier New",
                "fontSize": 75,
                "letterSpacing": 1,
                "lineHeight": 1,
                "lineJoin": "round",
                "miterLimit": 1,
                "padding": 1,
                "stroke": "white",
                "strokeThickness": 16,
                "trim": true,
                "leading": 1
            }

            this.addGameBtn('Game 1', style, 225, menuBkContainer)
            this.addGameBtn('Game 2', style, 375, menuBkContainer)
            this.addGameBtn('Game 3', style, 525, menuBkContainer)

            mainMenuBk.backgroundContainer.addChild(menuBkContainer)
            menuBkContainer.alpha = 0
            let spalsh = mainMenuBk.addSplash(gmTextures["Header.png"], {x: 500, y: 350}, 0.5)

            let openTimeline = new TimelineMax()
            openTimeline.to(spalsh, 2, {alpha: 0})
            openTimeline.to(menuBkContainer, 1, {alpha: 1})

        }
        return mainMenuBk
    }

    addPlayer(container: PIXI.Container){
        let ship = new PlayerSpaceship(container)
        let shipTexture = this.loader.getLoaderManager().resources["assets/gameAssets.json"].textures
        if(shipTexture){
            ship.addShipBody(shipTexture["playerShip.png"])
            ship.setStats(1, 0.5, 3)
            ship.addAmmoType(shipTexture["spaceRockets_001.png"])
            ship.addEngine(shipTexture["spaceEffects_003.png"], {x: -ship.shipContainer.width/3, y: 0}, 3, 4.71239)
        }
        ship.shipContainer.scale.set(0.75)
        container.addChild(ship.shipContainer)

        return ship
    }

    addEnemy(container: PIXI.Container){
        let ship = new Spaceship(container)
        let shipTexture = this.loader.getLoaderManager().resources["assets/gameAssets.json"].textures
        if(shipTexture){
            ship.addShipBody(shipTexture["enemyShip.png"])
            ship.addEngine(shipTexture["spaceEffects_002.png"], {x: ship.shipContainer.width/2.5, y: 0}, 3, 1.5708)
        }
        ship.shipContainer.scale.set(0.75)
        container.addChild(ship.shipContainer)

        return ship
    }

    collision(a: any, b: any) {
        let ab = a.getBounds();
        let bb = b.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    addGameBtn(text: string, style: any, positionY: number, parentContainer: PIXI.Container){
        let startGame = new PIXI.Text(text, style);
        startGame.anchor.set(0.5)
        startGame.position.set(500, positionY)
        startGame.buttonMode = true
        startGame.interactive = true
        startGame.on("mousedown", () => {
            document.dispatchEvent(new Event("gameStarted"))
        })
        parentContainer.addChild(startGame)
    }

    exitGame(){
        //@ts-ignore
        window.open("https://www.youtube.com/").focus();
    }

    explosionAnimation(explosionFrames: any, position: any, container: PIXI.Container){
        let animatedSprite = new PIXI.AnimatedSprite(explosionFrames["e"]);
        container.addChild(animatedSprite)
        animatedSprite.position.set(position.x, position.y)
        animatedSprite.anchor.set(0.5)
        animatedSprite.scale.set(0.5)
        animatedSprite.loop = false
        animatedSprite.play()
        
        animatedSprite.onComplete = () => {
            container.removeChild(animatedSprite)
        }
        
    }

    addAsteroids(parent: PIXI.Container){
        let container = new PIXI.Container();
        parent.addChild(container);
        let textures = this.loader.getLoaderManager().resources["assets/spacebodies.json"].textures
        if(textures){
            let emitter = new particles.Emitter(container,
                [textures["asteroid.png"], textures["smallAsteroid.png"],textures["smallAsteroid2.png"], textures["smallAsteroid3.png"], textures["smallAsteroid4.png"]],
                {
                    "alpha": {
                        "start": 1,
                        "end": 1
                    },
                    "scale": {
                        "start": 0.5,
                        "end": 0.5,
                        "minimumScaleMultiplier": 1
                    },
                    "color": {
                        "start": "#ffffff",
                        "end": "#ffffff"
                    },
                    "speed": {
                        "start": 50,
                        "end": 100,
                        "minimumSpeedMultiplier": 1
                    },
                    "acceleration": {
                        "x": 0,
                        "y": 0
                    },
                    "maxSpeed": 0,
                    "startRotation": {
                        "min": 0,
                        "max": 180
                    },
                    "noRotation": false,
                    "rotationSpeed": {
                        "min": 0,
                        "max": 25
                    },
                    "lifetime": {
                        "min": 30,
                        "max": 30
                    },
                    "blendMode": "normal",
                    "frequency": 1,
                    "emitterLifetime": -1,
                    "maxParticles": 100,
                    "pos": {
                        "x": 0,
                        "y": 0
                    },
                    "addAtBack": false,
                    "spawnType": "rect",
                    "spawnRect": {
                        "x": -80,
                        "y": -50,
                        "w": 50,
                        "h": 50
                    }
                }
            );

            emitter.emit = false;
            emitter.autoUpdate = true;

            return emitter
        }
    }


}