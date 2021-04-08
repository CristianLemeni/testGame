//@ts-nocheck
import './style.css'
import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'
import { Init } from './webgl/init';


export class MainApp {

	private init: Init

	constructor(pixiApp) {
		this.init = new Init(pixiApp);
	}
}

let stage, renderer

document.addEventListener("DOMContentLoaded", () => {
	let canvas = document.getElementById("gameCanvas");
	const pixiApp = new PIXI.Application();
	canvas.appendChild(pixiApp.view);

	renderer = new PIXI.Renderer({
        view: canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio,
        autoDensity: true
    });
    stage = new PIXI.Container();
    const ticker = new PIXI.Ticker();


    ticker.add(animate);
    ticker.start();

	var app = new MainApp(pixiApp);
})

function animate() {
	renderer.render(stage);
}

