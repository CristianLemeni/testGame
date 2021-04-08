import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'

export class Init {

    constructor(){}

    init(pixiApp: PIXI.Application, canvas: HTMLCanvasElement){
        this.app = pixiApp
    }
   

    private app!: PIXI.Application

}