import { TimelineMax } from "gsap"
import PixiFps from "pixi-fps";

export class UI {

    uiContainer: PIXI.Container

    textStyle = {
        "dropShadow": true,
        "dropShadowAngle": 1.1,
        "dropShadowBlur": 5,
        "dropShadowDistance": 3,
        "fill": "#d4160c",
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
    ui: PIXI.Container
    imageArr: Array<PIXI.Texture>

    lastPosX = 0
    buffer = 20
    positions: number = 3


    constructor(container: PIXI.Container, imgArr: Array<PIXI.Texture>){
        this.uiContainer = container

        this.ui = new PIXI.Container()
        this.imageArr = imgArr
        this.uiContainer.addChild(this.ui)

        this.ui.position.set(window.innerWidth/4, window.innerHeight/4)
    }

    addText(msg: string){
        let text = new PIXI.Text(msg, this.textStyle)
        this.ui.addChild(text)
        text.position.x = this.lastPosX
        this.lastPosX += text.width + this.buffer
    }

    addImage(texture: PIXI.Texture){
        let image = PIXI.Sprite.from(texture)
        this.ui.addChild(image)
        image.position.x = this.lastPosX
        this.lastPosX += image.width + this.buffer
    }

    formMessage(){
        this.ui.removeChildren()
        for(let i = 0; i < this.positions; i++){
            let pos = Math.round(Math.random()) * 2 - 1
            if(pos > 0){
                this.textStyle.fontSize = Math.floor(Math.random() * (75 - 10 + 1)) + 10;
                this.addText(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5).toString())
            }
            else{
                this.addImage(this.imageArr[Math.floor(Math.random() * (this.imageArr.length))])
            }
        }
        this.lastPosX = 0
    }

    startMessageBoard(){
        let timeline = new TimelineMax({repeat:-1})

        timeline.add(() => {
            this.formMessage()
        }, "+2")
    }

    addFpsCounter(){
        const fpsCounter = new PixiFps();
        fpsCounter.position.set(0, 0)
        this.uiContainer.addChild(fpsCounter);
    }
    


}