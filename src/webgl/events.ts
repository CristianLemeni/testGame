export class Events {

    constructor(){

    }

    playerEvents(){
        document.addEventListener("keydown", this.move)

        document.addEventListener('keyup', this.stopMoving)

        document!.getElementById("gameCanvas")!.addEventListener("PlayerDead", () => {
            document!.getElementById("gameCanvas")!.dispatchEvent(new Event("RestartGame"))
        })
    }

    blockEvents(){
        document!.getElementById("gameCanvas")!.addEventListener("BlockHit", (evt) => {
            if((evt as CustomEvent).detail == "element_blue_rectangle_glossy.png"){
                document!.getElementById("gameCanvas")!.dispatchEvent(new CustomEvent("ScoreUpdate", {detail: "10"}))
            }
            else if((evt as CustomEvent).detail == "element_green_rectangle_glossy.png"){
                document!.getElementById("gameCanvas")!.dispatchEvent(new CustomEvent("ScoreUpdate", {detail: "20"}))
            }
            else if((evt as CustomEvent).detail == "element_red_rectangle_glossy.png"){
                document!.getElementById("gameCanvas")!.dispatchEvent(new CustomEvent("ScoreUpdate", {detail: "30"}))
            }
            else if((evt as CustomEvent).detail == "element_yellow_rectangle_glossy.png"){
                document!.getElementById("gameCanvas")!.dispatchEvent(new CustomEvent("ScoreUpdate", {detail: "40"}))
            }
        })
        
    }

    move(evt: KeyboardEvent){
        if(evt.code == "KeyA"){
            document!.getElementById("gameCanvas")!.dispatchEvent(new Event("PlayerMoveLeft"))
        }
        if(evt.code == "KeyD"){
            document!.getElementById("gameCanvas")!.dispatchEvent(new Event("PlayerMoveRight"))
        }
    }

    stopMoving(evt: KeyboardEvent){
        if(evt.code == "KeyA"){
            document!.getElementById("gameCanvas")!.dispatchEvent(new Event("PlayerStopLeft"))
        }
        if(evt.code == "KeyD"){
            document!.getElementById("gameCanvas")!.dispatchEvent(new Event("PlayerStopRight"))
        }
    }

}