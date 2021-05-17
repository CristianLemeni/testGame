import { TimelineMax } from 'gsap'
import * as PIXI from 'pixi.js'
import { Init } from './init'


export class Background {

    stage: PIXI.Container
    backgroundContainer: PIXI.Container

    constructor(stage: PIXI.Container){
        this.stage = stage
        this.backgroundContainer = new PIXI.Container()
    }

    addBackground(texture: PIXI.Texture){
        this.stage.addChild(this.backgroundContainer)
        
        let bkSprite = new PIXI.Sprite(texture)
        this.backgroundContainer.addChild(bkSprite)

        return bkSprite
    }

    addSplash(texture: PIXI.Texture, position: any, scale: number){
        let sprite = new PIXI.Sprite(texture)
        sprite.position.set(position.x, position.y)
        sprite.scale.set(scale)
        sprite.anchor.set(0.5)
        this.backgroundContainer.addChild(sprite)
        return sprite
    }

    addParalax(texture: PIXI.Texture){
        for(let j = 0; j < 3; j++){
            let paralax = new TimelineMax({repeat: -1, paused: true})
        
            for(let i = 0; i < 3; i++){
                let sprite = new PIXI.Sprite(texture)
                sprite.anchor.set(0.25)
                this.backgroundContainer.addChild(sprite)

                sprite.position.x = this.backgroundContainer.width

                if(i > 0){
                    sprite.position.x = this.backgroundContainer.children[i-1].position.x + (this.backgroundContainer.children[i-1] as PIXI.Container).width
                }
                paralax.fromTo(sprite, 10*i, {x: this.backgroundContainer.width/4}, {x: -sprite.width, ease:"none"}, j*5)

                            
            }   
            paralax.play()
        }


    }
    

    
}