import { Decorator } from "./MODULES/ENTITIES/decorator.js";
import { Player } from "./MODULES/ENTITIES/player.js";
import { Camera } from "./MODULES/camera.js";
import { availablePetals } from "./MODULES/STORAGE/petals.js";
import { PetalBox, PetalBoxPlace } from "./MODULES/UI/petalBox.js";
import { abbreviate, boxBoxCollision, boxCollision, boxCollision2 } from "./SCRIPTS/functions.js";
import { availableMobs } from "./MODULES/STORAGE/mobs.js";
import { QuadTree } from "./MODULES/PHYSICS/quadTree.js";
import { Inventory, InventoryPetalBox } from "./MODULES/UI/inventory.js";

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
let dropHandled = false
let quadTree = new QuadTree()

export let mapSize = 4000,
                    entities = [],
                    mobs = [],
                    allEntities = [],
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
    ["Hellish", "rgb(170, 35, 35)"],
    ["Stellar", "rgb(0, 0, 0)"],
    ["Radiant", "rgb(0, 0, 0)"]
//     ["Eternal", "rgb(255, 255, 255)"],
//     ["Apotheotic", "rgb(216, 23, 153)"],
//     ["Radiant", "rgba(204, 0, 255, 1)"],
//     ["Prismathic", "rgba(255, 187, 199, 1)"],
//     ["Chaos", "rgba(100, 0, 207, 1)"],
//     ["Godly", "rgb(255, 255, 100)"]
]


var petalBoxes = []
let player = new Player(mapSize/2,mapSize/2, 25, "rgb(255, 255, 0)")
let camera = new Camera(player)
player.innitPetals()
let petalBoxHolders = []
let mobRarities = []
let inventory = new Inventory(20, canvas.height - 80, 90, 90)
inventory.innitPetals(rarities)
for (let i = 0; i < 9; i++) {
    mobRarities.push([i, 1/Math.pow(1.6, i)])
}
function spawnMob() {
    let randomRarity = Math.random()
    let chosenRarity = 0
    mobRarities.forEach((r) => {
        let [rarity, chance] = r
        if (chance >= randomRarity) {
            chosenRarity = rarity
        }
    })
    let randomMob = Math.floor(Math.random()*availableMobs.length)
    let mob = new availableMobs[randomMob].constructor(
        Math.random()*mapSize,
        Math.random()*mapSize,
        chosenRarity+1,
        availableMobs[randomMob].health,
        availableMobs[randomMob].damage,
        availableMobs[randomMob].size
    )
    mob.innitMob()
    mob.rarities = rarities
    mobs.push(mob)
}
function spawnTestMob() {
     let mob = new availableMobs[0].constructor(
        mapSize/2 + 250,
        mapSize/2 + 250,
        9,
        availableMobs[0].health,
        availableMobs[0].damage,
        availableMobs[0].size
    )
    mob.rarities = rarities
    mobs.push(mob)
}
//spawnTestMob()
for (let i = 0; i < player.equippedPetals.length; i++) {
    let petalBoxHolder = new PetalBoxPlace(player)
    petalBoxHolder.id = i+1
    petalBoxHolders.push(petalBoxHolder)
}
player.equippedPetals.forEach((petal) => {
    let randomPetal = 4 + Math.floor(Math.random()*3)//Math.floor(Math.random() * availablePetals.length)
    let newPetal = new availablePetals[randomPetal].constructor(
        player, {
            health: 10,
            damage: 10,
            size: 10
        }
    )
    petal.petal = newPetal
    petal.petal.rarity = petal.rarity
    petal.petal.innit()
    let petalBox = new PetalBox(player)
    petalBox.petal .push(petal.petal, petal.id, petal.rarity)
    petalBox.rarity = petal.rarity
    petalBox.id = petal.id
    let neededBox = petalBoxHolders.find((box) => box.id == petal.id)
    neededBox.box = petalBox
    petalBox.boxOn = neededBox
    if (!entities.includes(newPetal)) {
        entities.push(newPetal)
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
        if (boxCollision2(mx, my, inventory.x, inventory.y, inventory.width, inventory.height) && !inventory.open) {
            canvas.style.cursor = "pointer"
        }
        if (inventory.open && boxCollision(mx, my, inventory.exitBox.position.x, inventory.exitBox.position.y, inventory.exitBox.size)) {
            canvas.style.cursor = "pointer"
        }
        if (inventory.open && boxCollision2(mx, my, inventory.petalFilter.position.x, inventory.petalFilter.position.y, inventory.petalFilter.width, inventory.petalFilter.height)) {
            canvas.style.cursor = "pointer"
        }
    })
})
document.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
        mouseHolding = true
        if (boxCollision2(mx, my, inventory.x, inventory.y, inventory.width, inventory.height) && !inventory.open) {
            inventory.open = true
        }
        if (inventory.open && boxCollision(mx, my, inventory.exitBox.position.x, inventory.exitBox.position.y, inventory.exitBox.size)) {
            inventory.open = false
        }
        
        if (inventory.open && boxCollision2(mx, my, inventory.petalFilter.position.x, inventory.petalFilter.position.y, inventory.petalFilter.width, inventory.petalFilter.height)) {
            inventory.petalFilter.setFilter()
        }
    }
})
document.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
        mouseHolding = false
    }
})
setInterval(() => {
    if (mobs.length < 50) {
        spawnMob()
    }
}, 200)
setInterval(() => {
   allEntities = mobs.concat(player).concat(entities)

    quadTree.reset()
    allEntities.forEach((e) => {
        if (e.type == "petal" && e.dead) return;
        quadTree.insert(e)
    })
    quadTree.update()
    
    quadTree.entityBoundaries.forEach((b) => {
        if (b.collisions.length == 0) return;
        b.collisions.forEach((collision) => {
            let collider1 = collision[0]
            let collider2 = collision[1]

            let angle = Math.atan2(collider2.y - collider1.y, collider2.x - collider1.x)
            if (collider1.type !== "petal" && collider2.type !== "petal") {
                if (collider1.type == "player" && collider2.type == "mob" && collider2.pet) return;
                if (collider2.type == "player" && collider1.type == "mob" && collider1.pet) return;

                collider2.push.x += 1 * Math.cos(angle)
                collider2.push.y += 1 * Math.sin(angle)
                
                collider1.push.x -= 1 * Math.cos(angle)
                collider1.push.y -= 1 * Math.sin(angle)

                if ((collider1.type == "mob" && !collider1.pet) && (collider2.type == "mob" && collider2.pet)) {
                    collider1.health -= collider2.damage
                    collider2.health -= collider1.damage
                    collider2.damageTick = 6
                    collider1.damageTick = 6
                }
            }
            if (collider1.type == "petal" && collider2.type == "mob") {
                if (collider1.type == "petal" && !collider1.dead && !collider2.pet) {
                    collider1.stats.health -= Math.max(0, collider2.damage-collider1.stats.armor)
                }
                if (collider1.type == "mob" && !collider1.pet) {
                    collider1.health -= collider2.stats.damage
                    if (collider2.poison.poison > 0) {
                        collider1.poisonTake(collider2.poison.poison, collider2.poison.tick)
                    }
                }
                if (collider2.type == "petal" && !collider2.dead && !collider1.pet) {
                    collider2.stats.health -= Math.max(0, collider2.damage-collider1.stats.armor)
                }
                if (collider2.type == "mob" && !collider2.pet) {
                    collider2.health -= collider1.stats.damage
                    if (collider1.poison.poison > 0) {
                        collider2.poisonTake(collider1.poison.poison, collider1.poison.tick)
                    }
                }
            }
        })
    })
}, 1000/15)

setInterval(() => {
    camera.moveTo()
    entities.forEach((entity) => {
        entity.update()
        if (entity.type == "petal") {
            if (entity.stats.health <= 0)  {
                entity.dead = true
            }
        }
    })
    mobs.forEach((mob) => {
        mob.update(player)
        if (mob.pet) {
            mob.givenTargets = mobs.filter((givenMob) => !givenMob.pet)
        }
        if (mob.health <= 0) {
            for (let otherMob in mobs) {
                if (otherMob !== mob) {
                    if (otherMob.target == mob) {
                        otherMob.target = null
                    } 
                }
            }
            mobs.splice(mobs.indexOf(mob), 1)
            if (mob.pet) {
                mob.hostPetal.summons.splice(mob.hostPetal.summons.indexOf(mob), 1)
            }
         }
    })
    if (mouseDraggingBox && mouseHolding) {
        mouseDraggingBoxClass.x += (mx - mouseDraggingBoxClass.x) * 0.3;
        mouseDraggingBoxClass.y += (my - mouseDraggingBoxClass.y) * 0.3;
    }
    inventory.update()
    t += 0.025
    let catarValue = Math.abs(Math.sin(t)*50+150)
    let strVal = Math.abs(Math.sin(t)*255)
    let stgVal = Math.abs(Math.sin(t + 2*Math.PI/3)*255)
    let stbVal = Math.abs(Math.sin(t + 4*Math.PI/3)*255)
    let stellarRarity = rarities.find((r) => r[0].toLocaleLowerCase() === "stellar")
    let radiantRarity = rarities.find((r) => r[0].toLocaleLowerCase() === "radiant")
    let cataRarity = rarities.find((r) => r[0].toLocaleLowerCase() === "hellish")
    let rRad = Math.floor(127.5 * (Math.sin(t) + 1));
    let gRad = Math.floor(127.5 * (Math.sin(t + (2 * Math.PI / 3)) + 1));
    let bRad = Math.floor(127.5 * (Math.sin(t + (4 * Math.PI / 3)) + 1));
    stellarRarity[1] = `rgb(${strVal}, ${stgVal}, ${stbVal})`
    cataRarity[1] = `rgb(${catarValue}, 0, 0)`
    radiantRarity[1] = `rgb(${rRad}, ${gRad}, ${bRad})`
    if (mouseHolding && !mouseDraggingBox) {
        dropHandled = false;
    }
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
    mobs.forEach((mob) => {
        mob.draw()
        mob.drawRarity()
    })
    player.draw()
    ctx.restore()
    petalBoxHolders.forEach((pBox) => {
        pBox.y = canvas.height / 1.12
        pBox.x = canvas.width / 2 + (pBox.boxSize+15)*petalBoxHolders.length/2-((pBox.boxSize+15)*pBox.id)
        pBox.draw()
    })
    inventory.x = 20
    inventory.y = canvas.height - inventory.height - 25
    inventory.draw()
    
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
                const targetHolderId = targetHolder.id;
                const sourceHolderId = sourceHolder.id;

                const draggedBox = mouseDraggingBoxClass;
                const targetBox  = targetHolder.box;

                const draggedPetal = draggedBox.petal[0];
                const targetPetal  = targetBox.petal[0];

                const specificPetalSlot = player.equippedPetals.find(p => p.id === sourceHolderId);
                const specificPetalSlot2 = player.equippedPetals.find(p => p.id === targetHolderId);
                if (!sourceHolder) break;
                targetHolder.box.petal[0].dead = true
                mouseDraggingBoxClass.petal[0].dead = true
                if (targetHolder.box.petal[0].summons.length > 0) {
                    targetHolder.box.petal[0].summons.forEach((summon) => {
                        summon.health = 0
                    })
                    targetHolder.box.petal[0].summons = []
                }
                if (mouseDraggingBoxClass.petal[0].summons.length > 0) {
                    mouseDraggingBoxClass.petal[0].summons.forEach((summon) => {
                        summon.health = 0
                    })
                    mouseDraggingBoxClass.petal[0].summons = []
                }

                targetHolder.box = mouseDraggingBoxClass;
                specificPetalSlot.rarity = targetPetal.rarity
                specificPetalSlot.petal = targetPetal
                mouseDraggingBoxClass.petal[0].id = specificPetalSlot.id
                sourceHolder.box = targetBox;

                mouseDraggingBoxClass.boxOn = targetHolder;
                specificPetalSlot2.rarity = draggedPetal.rarity
                specificPetalSlot2.petal = draggedPetal
                targetBox.petal[0].id = specificPetalSlot2.id
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
