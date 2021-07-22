import { TimelineMax } from "gsap"
import { ParticleContainer } from "./particleContainer"


export class Level {

    levelContainer: PIXI.Container
    levelBlocks: Array<PIXI.Sprite>
    constructor(container: PIXI.Container,){
        this.levelContainer = container
        this.levelBlocks = []
    }


    addBackground(texture: PIXI.Texture){
        let bkSprite = PIXI.Sprite.from(texture)
        bkSprite.width = window.innerWidth
        bkSprite.height = window.innerHeight
        this.levelContainer.addChild(bkSprite)
    }

    addLevelBlocks(blockTextures: Array<PIXI.Texture>){
        let x = 500
        let y = 500
        let spriteNumb = 5
        for(let i = 0; i < spriteNumb; i++){
            let blockCont = new PIXI.Container()
            let block = PIXI.Sprite.from(blockTextures[Math.floor(Math.random() * blockTextures.length)])
            blockCont.position.set(x, y)
            blockCont.addChild(block)
            this.levelContainer.addChild(blockCont)
            this.levelBlocks.push(block)
            x -= 0.1
            y += 0.1
        }
        this.levelBlocks.reverse()
    }

    moveBlock(cont: PIXI.Container, x: number, newParent: PIXI.Container){
        let moveTimeline = new TimelineMax()

        moveTimeline.to(cont.position, 2, {x: -x - 10})
        return moveTimeline
    }

    addFire(textureArr: PIXI.Texture){
        let prop = {
            particlesProperties: {
                "alpha": {
                    "start": 0.62,
                    "end": 0
                },
                "scale": {
                    "start": 0.25,
                    "end": 0.75,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#fff191",
                    "end": "#ff622c"
                },
                "speed": {
                    "start": 500,
                    "end": 500,
                    "minimumSpeedMultiplier": 1
                },
                "acceleration": {
                    "x": 0,
                    "y": 0
                },
                "maxSpeed": 0,
                "startRotation": {
                    "min": 265,
                    "max": 275
                },
                "noRotation": false,
                "rotationSpeed": {
                    "min": 50,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.1,
                    "max": 0.75
                },
                "blendMode": "normal",
                "frequency": 0.001,
                "emitterLifetime": -1,
                "maxParticles": 10,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "circle",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 10
                }
            },
            particlesTextures: textureArr
        }

        let fire = new ParticleContainer(prop)
        fire.position.set(window.innerWidth/2, window.innerHeight)
        this.levelContainer.addChild(fire)
        fire.play()
    }
}