import * as PIXI from 'pixi.js'
import gsap from 'gsap/all'

export class Player {


    playerContainer: PIXI.Container

    constructor(container: PIXI.Container, playerTexture: PIXI.Texture){
        this.playerContainer = container
        this.addSprite(playerTexture)
    }

    addSprite(playerTexture: PIXI.Texture){
        let playerSprite = PIXI.Sprite.from(playerTexture)
        playerSprite.anchor.set(0.5)
        this.playerContainer.addChild(playerSprite)
    }

    setScale(scale: number){
        this.playerContainer.scale.set(scale)
    }

    setPosition(x: number, y: number){
        this.playerContainer.position.set(x, y)
    }


    moveEvents(){
        document!.getElementById("gameCanvas")!.addEventListener("PlayerMoveLeft", () => {
            gsap.to(this.playerContainer.position, {x: this.playerContainer.position.x - 30, duration: 0, ease: "ease.none"})
        })
        document!.getElementById("gameCanvas")!.addEventListener("PlayerMoveRight", () => {
            gsap.to(this.playerContainer.position, {x: this.playerContainer.position.x + 30, duration: 0, ease: "ease.none"})
        })
    }
}