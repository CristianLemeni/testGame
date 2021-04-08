import * as gsap from 'gsap'
import * as PIXI from 'pixi.js'
import { Init } from './init'
import {MotionBlurFilter} from '@pixi/filter-motion-blur';


export class Reels {

    stage: PIXI.Container
    reelsContainer: PIXI.Container
    state: string = "normal"
    spinTimeline: gsap.TimelineMax
    reelsJson: any
    ids: any
    idsDict: any

    constructor(stage: PIXI.Container){
        this.stage = stage
        this.reelsContainer = new PIXI.Container()

        this.stage.addChild(this.reelsContainer)

        this.spinTimeline = new gsap.TimelineMax({paused: true, duration: 3})
        this.spinTimeline.eventCallback("onComplete", this.checkForWin,  [this]);
        this.addEvents()

        this.reelsJson = require('C:\\Users\\Cristi\\Documents\\GitHub\\testGame\\public\\assets\\reels.json').reels;

        this.ids = []
        this.idsDict = {}
    }

    initReels(reelsTextures: any, spinBtnTexture: any){
        this.addReels(reelsTextures)
        this.addSpinButton(spinBtnTexture)
    }

    addReels(textures: any){
        let symbWidth = 0
        let y = 0
        let x = 0
        for(let i = 0; i < 5; i++){
            y = 0
            let reelCol = new PIXI.Container()
            this.ids.push([])
            for(let j = 0; j < 3; j++){
                let reelSymbol = new PIXI.Sprite(textures["icon" + this.getIconId(this.reelsJson[i].reel.icons) + ".png"]);

                reelSymbol.position.set(x, y)
                reelCol.addChild(reelSymbol)
            
                
                this.reelsContainer.addChild(reelCol)
                y += reelSymbol.height * 1.15 
                symbWidth = reelSymbol.width
            }
            this.addID.bind(this)
            this.spinTimeline.add(() => {
                //@ts-ignore
                reelCol.filters = [new MotionBlurFilter([1,2], 9)] 
            }, 0)
            this.spinTimeline.fromTo(reelCol.position, 0.5, {y: reelCol.y}, {y: Init.initialHeight + reelCol.height, ease: "back.inOut(1.7)"}, i*0.15)
            this.spinTimeline.add(() => {
                reelCol.position.y = - Init.initialHeight
                for(let r = 0; r < reelCol.children.length; r++){
                    let id = this.getIconId(this.reelsJson[i].reel.icons)
                    this.addID(id, i);
                    (reelCol.children[r] as PIXI.Sprite).texture =  textures["icon" + id + ".png"]
                }
            })
            this.spinTimeline.to(reelCol.position, 0.5, {y: 0, ease: "back.inOut(1.7)"})
            this.spinTimeline.add(() => {
                reelCol.filters = [] 
            })

            reelCol.position.y = 0

            x += symbWidth! * 1.15
        }

       this.resize()
    }

    addSpinButton(texture: any){
        let spinButton = new PIXI.Sprite(texture);
        spinButton.interactive = true
        spinButton.scale.set(0.5)
        spinButton.position.x = this.reelsContainer.children[0].position.x - spinButton.width * 1.5
        spinButton.position.y = this.reelsContainer.children[0].position.y + spinButton.height/6
        this.reelsContainer.addChild(spinButton)
        this.resize()

        spinButton.on("mousedown", function(e: any) {
            let evt = new Event("spinPressed")
            document.dispatchEvent(evt)
        });
    }

    getIconId(arr: any) {
        let parsedArr = arr.split(",")
        let randInt = Math.floor(Math.random() * ((parsedArr.length-1) + 1));
        return parsedArr[randInt].toString()
    }

    resize() {
        this.reelsContainer.scale.set(1);
        this.reelsContainer.scale.set(Math.min(Init.initialWidth * 0.5 / this.reelsContainer.width, Init.initialHeight * 0.5 / this.reelsContainer.height))
        this.reelsContainer.position.set(Init.initialWidth/4, window.innerHeight/3)
    }

    addEvents(){
        document.addEventListener('initResized', () => {
            this.resize()
        })

        document.addEventListener("spinPressed", () => {
            this.spin()
        })
    }

    changeState(newState: string){
        this.state = newState
    }

    spin(){
        this.spinTimeline.restart()
    }

    resetArrs(self: Reels){
        for(let i = 0; i < self.ids.length; i++){
            self.ids[i] = []
        }
        for(let key in self.idsDict){
            self.idsDict[key] = []
        }
    }

    checkForWin(self: Reels){
        let time = 0
        for(let key in self.idsDict){
            let unq = new Set(self.idsDict[key])
            if(unq.size > 2){
                // console.log("WIN", self.idsDict[key])
                // console.log("ID", key)
                // console.log("COLS", unq)
                self.winAnimation(key, unq, self, time)
                time += 0.6
            }
        } 
        self.resetArrs(self)   
    }

    winAnimation(val: any, cols: Set<unknown>, self: Reels, time: number){
        let winTimeline = new gsap.TimelineMax({paused: true})
        let winArr = []
        console.log(cols)
        for(let id of cols){
            for(let i = 0; i < self.ids[id as any].length; i++){
                if(self.ids[id as any][i] == val){
                    winArr.push({id: val, col: id, row: i})
                    winTimeline.to((self.reelsContainer.children[id as any] as PIXI.Container).children[i], 0.1, {x:"+=4", yoyo:true, repeat:5}, time);
                    winTimeline.to((self.reelsContainer.children[id as any] as PIXI.Container).children[i], 0.1, {x:"-=4", yoyo:true, repeat:5}, time);
                }
            }
        }
        winTimeline.play()
        
        
    }

    addID(id: any, reelId: any){
        this.ids[reelId].push(id)
        if(this.idsDict[id]){
            this.idsDict[id].push(reelId)
        } 
        else{
            this.idsDict[id] = [reelId]
        }
    }

}