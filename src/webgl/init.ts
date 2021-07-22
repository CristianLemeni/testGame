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

        this.startGameplayLoop(this.level, mainContainer)
    }

    addLevel(container: PIXI.Container){
        let level = new Level(container)
        level.addBackground(this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["Sky.png"])
        let blockTextures = [this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["element_blue_rectangle_glossy.png"],
                            this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["element_green_rectangle_glossy.png"],
                            this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["element_red_rectangle_glossy.png"],
                            this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["element_yellow_rectangle_glossy.png"],
                            this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["element_grey_rectangle_glossy.png"],
                            this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["element_purple_rectangle_glossy.png"]]
        level.addLevelBlocks(blockTextures)
        level.addFire(this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["firebolt.png"])
        return level
    }

    addUI(container: PIXI.Container){
        let imgTextures = [this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["cool.png"],
                            this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["funny.png"],
                            this.loader.getLoaderManager().resources["assets/assets2.json"].textures!["calm.png"]]
        let ui = new UI(container, imgTextures)
        ui.startMessageBoard()
        ui.addFpsCounter()
    }

    startGameplayLoop(level: Level, mainContainer: PIXI.Container){
        let mainTimeline = new TimelineMax()
        let secondStack = new PIXI.Container()
        secondStack.position.set(480, 514.4)
        mainContainer.addChild(secondStack)
        for(let i = 0; i < level.levelBlocks.length; i++){
            mainTimeline.add(() => {
                secondStack.addChild(level.levelBlocks[i])
            })
            mainTimeline.add(level.moveBlock(level.levelBlocks[i], level.levelBlocks[i].position.x + level.levelBlocks[i].width, secondStack))
        }
        
    }



}