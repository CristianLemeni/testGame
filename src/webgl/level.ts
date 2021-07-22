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
        let block = PIXI.Sprite.from(blockTextures[0])
        let blockNumberRow = Math.floor(window.innerWidth / block.width)

        let blockNumberHeight = 6

        let y = 0

        for(let i = 0; i < blockNumberHeight; i++){
            let x = 0
            for(let j = 0; j <= blockNumberRow; j++){
                let blockCont = new PIXI.Container()
                let block = PIXI.Sprite.from(blockTextures[Math.floor(Math.random() * blockTextures.length)])
                blockCont.position.set(x, y)
                blockCont.addChild(block)
                this.levelContainer.addChild(blockCont)
                this.levelBlocks.push(block)
                x += block.width
            }
            y += block.height
        }
        
    }
}