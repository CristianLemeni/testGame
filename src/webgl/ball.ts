export class Ball {

    ballContainer: PIXI.Container

    constructor(container: PIXI.Container){
        this.ballContainer = container
    }

    addBall(ballTexture: PIXI.Texture, playerContainer: PIXI.Container){
        let playerBall = PIXI.Sprite.from(ballTexture)
        playerBall.anchor.set(0.5)
        playerBall.position.set(playerContainer.position.x, playerContainer.position.y - playerContainer.height * 2)
        playerBall.scale.set(playerContainer.scale.x)
        this.ballContainer.addChild(playerBall)
    }

    setPosition(x: number, y: number){
        this.ballContainer.position.set(x, y)
    }
}