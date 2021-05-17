//@ts-nocheck
import './style.css'
import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'
import { Init } from './webgl/init';
window.PIXI = PIXI;

export class MainApp {

	private init: Init

	constructor(pixiApp) {
		this.init = new Init(pixiApp);
	}

    load(pixiApp, canvas, assets){
        this.init.init(pixiApp, canvas)
        this.init.loadGraphics(assets)

        document.addEventListener("graphicsLoaded", () => {
           this.init.startGame()
        })
    }
}

let pixiApp, renderer

document.addEventListener("DOMContentLoaded", () => {
	let canvas = document.getElementById("gameCanvas");
	pixiApp = new PIXI.Application();
	canvas.appendChild(pixiApp.view);

	renderer = new PIXI.Renderer({
        view: canvas,
        width: 800,
        height: 600,
        resolution: window.devicePixelRatio,
        autoDensity: true,
    });
    const ticker = new PIXI.Ticker();


    ticker.add(animate);
    ticker.start();

    const graphics = [
        "assets/spaceclouds.json",
        "assets/gameAssets.json",
        "assets/menuBK.json",
        "assets/stars.json",
        "assets/fire_explosion.json",
        "assets/spacebodies.json"
    ]

	let app = new MainApp(pixiApp);
    app.load(pixiApp, canvas, graphics)
})

function animate() {
	renderer.render(pixiApp.stage);
}


