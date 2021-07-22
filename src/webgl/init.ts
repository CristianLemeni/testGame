import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'
import {Loader} from './loader'
import { TimelineMax, TimelineLite } from "gsap"
import { Player } from './player'
import { Level } from './level'
import { UI } from './ui'
import { Events } from './events'
import { Ball } from './ball'

export class Init {

    private app!: PIXI.Application
    private loader!: Loader

    public initialWidth: number
    public initialHeight: number

    player!: Player
    ball!: Ball
    level!: Level

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
        
       
        this.level = this.addLevel(mainContainer)
        this.addUI(mainContainer)
        this.player = this.addPlayer(mainContainer)
        this.ball = this.addBall(mainContainer, this.player.playerContainer)
        this.addEvents()

        this.startGameplayLoop(this.ball, this.player, this.level)

    }

    addLevel(container: PIXI.Container){
        let level = new Level(container)
        level.addBackground(this.loader.getLoaderManager().resources["assets/assets.json"].textures!["Sky.png"])
        let blockTextures = [this.loader.getLoaderManager().resources["assets/assets.json"].textures!["element_blue_rectangle_glossy.png"],
                            this.loader.getLoaderManager().resources["assets/assets.json"].textures!["element_green_rectangle_glossy.png"],
                            this.loader.getLoaderManager().resources["assets/assets.json"].textures!["element_red_rectangle_glossy.png"],
                            this.loader.getLoaderManager().resources["assets/assets.json"].textures!["element_yellow_rectangle_glossy.png"]]
        level.addLevelBlocks(blockTextures)

        return level
    }

    addUI(container: PIXI.Container){
        let ui = new UI(container)
        ui.addUIElements()
        ui.updateScore()
    }

    addPlayer(container: PIXI.Container){
        let player = new Player(new PIXI.Container(), this.loader.getLoaderManager().resources["assets/assets.json"].textures!["paddleBlu.png"])
        player.setScale(2)
        player.setPosition(window.innerWidth/2, window.innerHeight - player.playerContainer.height*4)
        player.moveEvents()
        container.addChild(player.playerContainer)
        return player
    }

    addEvents(){
        let evt = new Events()
        evt.playerEvents()
        evt.blockEvents()
    }

    addBall(container: PIXI.Container, playerContainer: PIXI.Container){
        let ball = new Ball(new PIXI.Container())
        ball.addBall(this.loader.getLoaderManager().resources["assets/assets.json"].textures!["ballBlue.png"], playerContainer)
        container.addChild(ball.ballContainer)
        return ball
    }

    changeColor(currentColor: string, block: PIXI.Sprite, blocksArr: Array<PIXI.Sprite>, index: number){
        if(currentColor == "element_blue_rectangle_glossy.png"){
            blocksArr.splice(index, 1)
            block.visible = false
        }
        else if(currentColor == "element_green_rectangle_glossy.png"){
            let newBlock = PIXI.Sprite.from(this.loader.getLoaderManager().resources["assets/assets.json"].textures!["element_blue_rectangle_glossy.png"])
            block.parent.addChild(newBlock)
            newBlock.position.set(block.position.x, block.position.y)
            blocksArr.push(newBlock)
            block.visible = false
        }
        else if(currentColor == "element_red_rectangle_glossy.png"){
            let newBlock = PIXI.Sprite.from(this.loader.getLoaderManager().resources["assets/assets.json"].textures!["element_green_rectangle_glossy.png"])
            block.parent.addChild(newBlock)
            newBlock.position.set(block.position.x, block.position.y)
            blocksArr.push(newBlock)
            blocksArr.splice(index, 1)
            block.visible = false
        }
        else if(currentColor == "element_yellow_rectangle_glossy.png"){
            let newBlock = PIXI.Sprite.from(this.loader.getLoaderManager().resources["assets/assets.json"].textures!["element_red_rectangle_glossy.png"])
            block.parent.addChild(newBlock)
            newBlock.position.set(block.position.x, block.position.y)
            blocksArr.push(newBlock)
            blocksArr.splice(index, 1)
            block.visible = false
        }
        document!.getElementById("gameCanvas")!.dispatchEvent(new CustomEvent("BlockHit", {detail: currentColor}))
    }


    detectCollision(a: any, b: any) {
        let ab = a.getBounds();
        let bb = b.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    startGameplayLoop(ball: Ball, player: Player, level: Level){
        let mainTimeline = new TimelineMax({repeat: -1})

        let ballTimeline = new TimelineMax()
        let ballTimeline2: TimelineMax, ballTimeline3: TimelineMax

        ballTimeline.to(ball.ballContainer.position, 1, {y: window.innerHeight, ease: "ease.none"})
        let isHit = false
        
        mainTimeline.eventCallback("onUpdate", () => {
            if(this.detectCollision(ball.ballContainer, player.playerContainer)){
                //collide with player
                ballTimeline.pause()
            
                ballTimeline2 = new TimelineMax()
                ballTimeline2.to(ball.ballContainer.position, 5, {y: -window.innerHeight, ease: "ease.none"})
                isHit = true
            }
            for(let i = 0; i < level.levelBlocks.length;i++){
                if(level.levelBlocks[i].visible == true && this.detectCollision(ball.ballContainer, level.levelBlocks[i]) && isHit){
                    console.log("block collide")
                    //collide with block
                    ballTimeline.pause()
                    
                    ballTimeline3 = new TimelineMax()
                    let x = Math.random() < 0.5 ? -1 : 1
                    ballTimeline3.to(ball.ballContainer.position, 5, {y: window.innerHeight, x: window.innerWidth/2 * x, ease: "ease.none"})
                    mainTimeline.delay(2)
                    this.changeColor(level.levelBlocks[i].texture.textureCacheIds[0], level.levelBlocks[i], level.levelBlocks, i)
                    isHit = false
                    break
                }
            }

            if(ball.ballContainer.position.y >= window.innerHeight/2){
                document!.getElementById("gameCanvas")!.dispatchEvent(new Event("PlayerDead"))
                player.setPosition(window.innerWidth/2, window.innerHeight - player.playerContainer.height*4)
                ball.setPosition(0, 0)
                ballTimeline.fromTo(ball.ballContainer.position, 1, {y: 0}, {y: window.innerHeight, ease: "ease.none"})
                ballTimeline.play()
            }
        })
    }



}