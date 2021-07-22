import * as particles from 'pixi-particles'
import * as PIXI from 'pixi.js'

export class ParticleContainer extends PIXI.Container {

    emitter: particles.Emitter
    container: PIXI.Container

    constructor(properties: any){
        super()
        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.emitter = new particles.Emitter(this.container,
            properties.particlesTextures,
            properties.particlesProperties);
        this.emitter.emit = false;
        this.emitter.autoUpdate = true;
    }

    play(){
        this.emitter.emit = true
    }

    stop(){
        this.emitter.emit = false
    }


}