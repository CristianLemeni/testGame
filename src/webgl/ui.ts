export class UI {

    uiContainer: PIXI.Container

    textStyle = {
        "dropShadow": true,
        "dropShadowAngle": 1.1,
        "dropShadowBlur": 5,
        "dropShadowDistance": 3,
        "fill": "#0c6dd4",
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

    scoreCount!: PIXI.Text

    constructor(container: PIXI.Container){
        this.uiContainer = container
    }

    addUIElements(){
        let scoreCont = new PIXI.Container()
        let healthCont = new PIXI.Container()

        this.scoreCount = new PIXI.Text("0", this.textStyle);
        let healthCount = new PIXI.Text("100%", this.textStyle); 

        let score = new PIXI.Text("Score", this.textStyle);
        let health = new PIXI.Text("Health", this.textStyle);

        this.scoreCount.position.x += score.width + 10
        healthCount.position.x += health.width + 10

        scoreCont.addChild(this.scoreCount)
        healthCont.addChild(healthCount) 
        scoreCont.addChild(score)
        healthCont.addChild(health) 

        this.uiContainer.addChild(scoreCont)
        this.uiContainer.addChild(healthCont)        

        scoreCont.position.set(0, window.innerHeight - scoreCont.height)
        healthCont.position.set(window.innerWidth - healthCont.width, window.innerHeight - healthCont.height)
    }

    updateScore(){
        document!.getElementById("gameCanvas")!.addEventListener("ScoreUpdate", (evt) => {
            this.scoreCount.text = (parseInt(this.scoreCount.text) + parseInt((evt as CustomEvent).detail)).toString()
        })

        document!.getElementById("gameCanvas")!.addEventListener("RestartGame", (evt) => {
            this.scoreCount.text = "0"
        })
    }
}