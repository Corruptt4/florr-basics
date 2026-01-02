import { Decorator } from "./MODULES/ENTITIES/decorator.js";
import { Player } from "./MODULES/ENTITIES/player.js";
import { Camera } from "./MODULES/camera.js";
import { availablePetals } from "./MODULES/STORAGE/petals.js";
import { PetalBox, PetalBoxPlace } from "./MODULES/UI/petalBox.js";
import { boxBoxCollision, boxCollision } from "./SCRIPTS/functions.js";

export const canvas = document.getElementById("canvas"),
                          ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let t = 0
let mx = 0
let my = 0
let mouseHolding = false
let mouseDraggingBox = false;
let mouseDraggingBoxClass = null;

export let mapSize = 5000,
                    entities = [],
                    mobs = [],
                    decors = [],
                    frictionMultiplier = 0.94

export var rarities = [
    ["Common", "rgb(126, 239, 109)"],
    ["Unusual", "rgb(255, 230, 109)"],
    ["Rare", "rgb(77, 82, 227)"],
    ["Epic", "rgb(134, 31, 222)"],
    ["Legendary", "rgb(222, 31, 31)"],
    ["Mythic", "rgb(31, 219, 222)"],
    ["Ultra", "rgb(255, 43, 117)"],
    ["Super", "rgb(43, 255, 163)"],
    ["Unique", "rgb(85,84,84)"],
    ["Zenith", "rgb(255, 255, 170)"],
    ["Cataclysmic", "rgb(170, 35, 35)"],
    ["Eternal", "rgb(255, 255, 255)"],
    ["Amethystic", "rgb(216, 23, 153)"],
    ["Terrestrial", "rgb(255, 125, 0)"],
    ["Celestial", "rgb(150, 75, 88)"],
    ["Extraterrestial", "rgb(235, 105, 0)"],
    ["Stellar", "rgb(0, 0, 0)"]
]
var petalBoxes = []
let player = new Player(mapSize/2, mapSize/2, 25, "rgb(255, 255, 0)")
let camera = new Camera(player)
player.innitPetals()
let petalBoxHolders = []
for (let i = 0; i < player.equippedPetals.length; i++) {
    let petalBoxHolder = new PetalBoxPlace(player)
    petalBoxHolder.id = i+1
    petalBoxHolders.push(petalBoxHolder)
}
player.equippedPetals.forEach((petal) => {
    let randomPetal = Math.floor(Math.random() * availablePetals.length)
    petal.petal = new availablePetals[1].constructor(
        player, {
            health: 10,
            damage: 10,
            size: 10
        }
    )
    petal.petal.rarity = petal.rarity
    petal.petal.innit()
    let petalBox = new PetalBox(player)
    petalBox.petal .push(petal.petal, petal.id, petal.rarity)
    petalBox.rarity = petal.rarity
    petalBox.id = petal.id
    let neededBox = petalBoxHolders.find((box) => box.id == petal.id)
    neededBox.box = petalBox
    petalBox.boxOn = neededBox
    if (!entities.includes(petal.petal)) {
        entities.push(petal.petal)
    }
})
entities.push(player)

let decorator = new Decorator(250, mapSize, "rgb(0, 210, 0)", 20, 30)

decorator.createDecoration(decors)


document.addEventListener("keydown", (e) => {
    player.keyDown[e.keyCode] = true
})

document.addEventListener("keyup", (e) => {
    player.keyDown[e.keyCode] = false
})
document.addEventListener("mousemove", (e) => {
    mx = e.clientX
    my = e.clientY
    canvas.style.cursor = "default"
    petalBoxHolders.forEach((box) => {
        box.box.hovered = false
        if (boxCollision(mx, my, box.x, box.y, box.boxSize) && !mouseDraggingBox) {
            canvas.style.cursor = "pointer"
            box.box.hovered = true
        }
    })
})
document.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
        mouseHolding = true
    }
})
document.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
        mouseHolding = false
    }
})

setInterval(() => {
    camera.moveTo()
    entities.forEach((entity) => {
        entity.update()
    })
    if (mouseDraggingBox && mouseHolding) {
        mouseDraggingBoxClass.x += (mx - mouseDraggingBoxClass.x) * 0.3;
        mouseDraggingBoxClass.y += (my - mouseDraggingBoxClass.y) * 0.3;
    }
   t += 0.025
   let rVal = Math.abs(Math.sin(t)*255)
   let gVal = Math.abs(Math.sin(t + 2*Math.PI/3)*255)
   let bVal = Math.abs(Math.sin(t + 4*Math.PI/3)*255)
    rarities[16][1] = `rgb(${rVal}, ${gVal}, ${bVal})`
}, 1000/60)

function render() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    camera.apply()
    decors.forEach((decor) => {
        decor.draw()
    })

    player.draw()
    ctx.restore()
    petalBoxHolders.forEach((pBox) => {
        pBox.y = canvas.height / 1.12
        pBox.x = canvas.width / 2 + (pBox.boxSize+15)*petalBoxHolders.length/2-((pBox.boxSize+15)*pBox.id)
        pBox.draw()
    })
    
    if (mouseHolding) {
        for (let holder of petalBoxHolders) {
            if (boxCollision(mx, my, holder.x, holder.y, holder.boxSize) && !mouseDraggingBox) {
                holder.draggingBox = true;
                mouseDraggingBox = true;
                holder.box.followMouse = true;
                mouseDraggingBoxClass = holder.box;
                holder.box.x = mx
                holder.box.y = my
                break;
            }
        }
    }
    if (!mouseHolding && mouseDraggingBox) {
        let swapping = false
        for (let targetHolder of petalBoxHolders) {
            if (targetHolder.box === mouseDraggingBoxClass) continue;

            if (boxCollision(mx, my, targetHolder.x, targetHolder.y, targetHolder.boxSize)) {
                const sourceHolder = mouseDraggingBoxClass.boxOn;
                if (!sourceHolder) break;
                targetHolder.box.petal[0].dead = true
                mouseDraggingBoxClass.petal[0].dead = true

                const targetBox = targetHolder.box;
                const oldHolder = mouseDraggingBoxClass.boxOn

                targetHolder.box = mouseDraggingBoxClass;
                mouseDraggingBoxClass.petal[0].id = targetHolder.id
                sourceHolder.box = targetBox;

                mouseDraggingBoxClass.boxOn = targetHolder;
                targetBox.petal[0].id = oldHolder.id
                if (targetBox) targetBox.boxOn = sourceHolder;

                mouseDraggingBoxClass.followMouse = false;
                sourceHolder.draggingBox = false;
                targetHolder.draggingBox = false;
                mouseDraggingBoxClass = null
                mouseDraggingBox = false
                swapping = true
                break;
            } 
        }
        if (!swapping) {
            mouseDraggingBox = false
                mouseDraggingBoxClass.followMouse = false;
                mouseDraggingBoxClass.boxOn.draggingBox = false
                mouseDraggingBoxClass = null
        }
    }
    requestAnimationFrame(render)
}
render()
