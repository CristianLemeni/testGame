import * as PIXI from 'pixi.js'
import { TimelineLite, TimelineMax } from "gsap"

export class Spaceship{

    stage: PIXI.Container
    shipContainer: PIXI.Container

    shipBody?: PIXI.Sprite
    allGuns: Array<PIXI.Sprite>

    initPointX: number
    initPointY: number

    health: number
    speed: number
    fireRate: number

    engines: PIXI.Container
    ammoTypeArr: Array<PIXI.Texture>

    constructor(stage: PIXI.Container){
        this.shipContainer = new PIXI.Container()
        this.stage = stage

        this.stage.addChild(this.shipContainer)

        this.initPointX = 0
        this.initPointY = 0

        this.allGuns = []
        this.ammoTypeArr = []

        this.health = 0
        this.speed = 0
        this.fireRate = 0

        this.engines = new PIXI.Container()
    }

    setStats(health: number, speed: number, fireRate: number){
        this.health = health
        this.speed = speed
        this.fireRate = fireRate
    }

    move(clientX: number, clientY: number){
        let deltaX = clientX - this.initPointX
        let deltaY = clientY - this.initPointY
        let timeline = new TimelineLite()
         //@ts-ignore
        timeline.to(this.shipContainer.position, {x: deltaX, duration: this.speed}, 0)
         //@ts-ignore
        timeline.to(this.shipContainer.position, {y: deltaY, duration: this.speed}, 0)
    }

    addShipBody(type: PIXI.Texture){
        this.shipBody = PIXI.Sprite.from(type)
        this.shipBody.anchor.set(0.5)
        this.shipContainer.addChild(this.shipBody)
    }

    addEngine(engineSprite: PIXI.Texture, position: any, scale: number, rotation: number){
        if(engineSprite){
            let engine = PIXI.Sprite.from(engineSprite)
        engine.anchor.set(0.5)
        engine.scale.set(scale)
        engine.position.set(position.x, position.y)
        engine.rotation = rotation

        this.engines.addChild(engine)


        this.shipContainer.addChild(this.engines)

        this.shipContainer.setChildIndex(this.engines, 0)

        //engine timeline
        let timeline = new TimelineLite({repeat: -1})
         //@ts-ignore
        timeline.to(this.engines.children[0].position, {y: this.engines.children[0].position.y + 1, duration: 0.1}, 0)
         //@ts-ignore
        timeline.to(this.engines.children[0].position, {y: this.engines.children[0].position.y - 1, duration: 0.1}, 0)
        }
    }

    addAmmoType(ammoType: PIXI.Texture){
        this.ammoTypeArr.push(ammoType)
    }
    

}