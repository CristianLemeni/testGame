import * as PIXI from 'pixi.js'
import { TimelineLite, TimelineMax } from "gsap"
import { Spaceship } from './spaceship'

export class PlayerSpaceship extends Spaceship{

    constructor(stage: PIXI.Container){
        super(stage)
        this.addEventListeners()
    }

    addEventListeners(){
        let mouseDown = false
         //movement
         document.addEventListener("pointerdown", (evt)=>{
            this.move(evt.x, evt.y)
            mouseDown = true
        })
        document.addEventListener("pointermove", (evt)=>{
            if(mouseDown){
                this.move(evt.x, evt.y)
            }
        })
        document.addEventListener('pointerup', ()=>{
            mouseDown = false
        })
    }

    shoot(projectileName: string, texture: PIXI.Texture, rotation: number, scale: number, parent: PIXI.Container){
        let shootTimeline = new TimelineMax({paused: true})
        let projectile = new PIXI.Sprite(texture)
        projectile.rotation = rotation
        projectile.scale.set(scale)
        projectile.anchor.set(0.5)
        shootTimeline.add(() => {
            let x = this.shipContainer.position.x + this.shipContainer.width/8
            let y = this.shipContainer.position.y + this.shipContainer.height/8
            projectile.position.set(x, y)
            projectile.name = projectileName;
            parent.addChild(projectile)
        }, 0)
        //@ts-ignore
        shootTimeline.to(projectile.position, {x: (window.innerWidth), duration: this.fireRate, ease: "none"}, 0)
        shootTimeline.eventCallback("onComplete", () => {
            parent.removeChild(projectile)
        })
        shootTimeline.add(() => {
            let evt = new Event("shoot")
            document.dispatchEvent(evt)
        }, 0)

        shootTimeline.play()
    }

}