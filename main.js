import { Decorator } from "./MODULES/ENTITIES/decorator.js";
import { Player } from "./MODULES/ENTITIES/player.js";
import { Camera } from "./MODULES/camera.js";

export const canvas = document.getElementById("canvas"),
                          ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export let mapSize = 5000,
                    entities = [],
                    decors = []

let player = new Player(mapSize/2, mapSize/2, 25, "rgb(255, 255, 0)")
let camera = new Camera(player)

let decorator = new Decorator(250, mapSize, "rgb(0, 210, 0)", 20, 30)

decorator.createDecoration(decors)


document.addEventListener("keydown", (e) => {
    player.keyDown[e.keyCode] = true
})

document.addEventListener("keyup", (e) => {
    player.keyDown[e.keyCode] = false
})

setInterval(() => {
    camera.moveTo()
    player.move()
}, 1000/60)

function render() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    camera.apply()
    decors.forEach((decor) => {
        decor.draw()
    })

    player.draw()

    requestAnimationFrame(render)
}
render()