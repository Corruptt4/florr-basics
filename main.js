import { Decorator } from "./MODULES/ENTITIES/decorator.js";
import { Player } from "./MODULES/ENTITIES/player.js";
import { Camera } from "./MODULES/camera.js";
import { availablePetals } from "./MODULES/STORAGE/petals.js";
import { EmptySlot, PetalBox, PetalBoxPlace } from "./MODULES/UI/petalBox.js";
import { abbreviate, boxBoxCollision, boxCollision, boxCollision2 } from "./SCRIPTS/functions.js";
import { availableMobs } from "./MODULES/STORAGE/mobs.js";
import { QuadTree, Rect } from "./MODULES/PHYSICS/quadTree.js";
import { Inventory, InventoryPetalBox } from "./MODULES/UI/inventory.js";
import { Petal, PlaceholderPetal } from "./MODULES/ENTITIES/petal.js";
import { SpatialHash } from "./MODULES/PHYSICS/spatialHash.js";

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

export let mapSize = 4000,
                    entities = [],
                    mobs = [],
                    allEntities = [],
                    decors = [],
                    frictionMultiplier = 0.94
let inventoryPetalToSlot = []

let spatialHash = new SpatialHash(32, mapSize)
spatialHash.innitGrid()

let rect = new Rect(0, 0, mapSize, mapSize)
let quadTree = new QuadTree(rect)
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
    ["Radiant", "rgb(0, 0, 0)"],
    ["Ancient", "rgb(175, 122, 0)"]
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
let decorator = new Decorator(0, mapSize, )
player.innitPetals()
let petalBoxHolders = []
let mobRarities = []
let inventory = new Inventory(20, canvas.height - 80, 90, 90)
inventory.innitPetals(rarities)
for (let i = 0; i < 11; i++) {
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
    petalBoxHolder.innit()
    petalBoxHolders.push(petalBoxHolder)
}
player.equippedPetals.forEach((petal) => {
    let randomPetal = 0
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
    petalBox.rarities = rarities
    petalBox.id = petal.id
    let neededBox = petalBoxHolders.find((box) => box.id == petal.id)
    neededBox.box = petalBox
    petalBox.boxOn = neededBox
    if (!entities.includes(newPetal)) {
        entities.push(newPetal)
    }
})
entities.push(player)


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
        if (!box.box.draggable) return;
        box.box.hovered = false
        if (boxCollision(mx, my, box.x, box.y, box.boxSize) && !mouseDraggingBox) {
            canvas.style.cursor = "pointer"
            box.box.hovered = true
        }
    })
    
    if (boxCollision2(mx, my, inventory.x, inventory.y, inventory.width, inventory.height) && !inventory.open) {
        canvas.style.cursor = "pointer"
    }
    if (inventory.open && boxCollision(mx, my, inventory.exitBox.position.x, inventory.exitBox.position.y, inventory.exitBox.size)) {
        canvas.style.cursor = "pointer"
    }
    if (inventory.open && boxCollision2(mx, my, inventory.petalFilter.position.x, inventory.petalFilter.position.y, inventory.petalFilter.width, inventory.petalFilter.height)) {
        canvas.style.cursor = "pointer"
    }
    

    if (inventory.open) {
        inventory.visibleSlots.forEach((slot) => {
            if (boxCollision(mx, my, slot.x, slot.y, slot.boxSize)) {
                canvas.style.cursor = "pointer"
            }
        })
    }
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
        if (inventory.open) {
            for (let invSlot of inventory.visibleSlots) {
                if (boxCollision(mx, my, invSlot.x, invSlot.y, invSlot.boxSize)) {
                    let editSlot = inventory.petals.filter((petal) => invSlot.petal == petal.petal)
                    editSlot = editSlot.filter((petal) => (invSlot.petal.rarity-1) == petal.actualRarity)
                    console.log(invSlot.petal.rarity)
                    editSlot = editSlot[0]
                    console.log(editSlot)
                    const clonedPetal = structuredClone(invSlot.petal);
                    Object.setPrototypeOf(
                        clonedPetal,
                        Object.getPrototypeOf(invSlot.petal)
                    );

                    clonedPetal.host = player;
                    clonedPetal.innit();
                    let slotToDrag = new PetalBox(player)
                    slotToDrag.petal = [clonedPetal];
                    inventoryPetalToSlot.push(slotToDrag)
                    mouseDraggingBox = true
                    slotToDrag.rarities = rarities
                    slotToDrag.draggingBox = true
                    slotToDrag.comesFromInventory = true
                    mouseDraggingBoxClass = slotToDrag
                    editSlot.amount -= 1
                    break;
                }
            }
        }
        for (let holder of petalBoxHolders) {
            if (!holder.box.draggable) continue;
            if (boxCollision(mx, my, holder.x, holder.y, holder.boxSize) && !mouseDraggingBox && holder.box != null) {
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
})
document.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
        mouseHolding = false
    }
})
setInterval(() => {
    if (mobs.length < 250) {
        spawnMob()
    }
}, 500)
setInterval(() => {
    allEntities = mobs.concat(player).concat(entities)
    spatialHash.clearCellEntities()
    for (let entity of allEntities) {
        if (
            (entity.x - entity.size > mapSize) ||
            (entity.x + entity.size < 0) ||
            (entity.y - entity.size > mapSize) ||
            (entity.y + entity.size < 0)
        ) {
            continue;
        }
        spatialHash.addEntity(entity)
    }
    spatialHash.update()

    spatialHash.collisions.forEach((collision) => {
        let collider1 = collision[0]
        let collider2 = collision[1]

        let angle = Math.atan2(collider2.y - collider1.y, collider2.x - collider1.x)
        if (collider1.type !== "petal" && collider2.type !== "petal") {
            if (collider1.type == "player" && collider2.type == "mob" && collider2.pet) return;
            if (collider2.type == "player" && collider1.type == "mob" && collider1.pet) return;
            collider2.push.x += 8*Math.max(1, (collider1.mass/collider2.mass)) * Math.cos(angle)
            collider2.push.y += 8*Math.max(1, (collider1.mass/collider2.mass)) * Math.sin(angle)
            
            collider1.push.x -= 8*Math.max(1, (collider2.mass/collider1.mass)) * Math.cos(angle)
            collider1.push.y -= 8*Math.max(1, (collider2.mass/collider1.mass)) * Math.sin(angle)
            if ((collider1.type == "mob" && !collider1.pet) && (collider2.type == "mob" && collider2.pet)) {
                collider1.health -= collider2.damage
                collider2.health -= collider1.damage
                collider2.damageTick = 6
                collider1.damageTick = 6
            }
            if ((collider2.type == "mob" && !collider2.pet) && (collider1.type == "mob" && collider1.pet)) {
                collider1.health -= collider2.damage
                collider2.health -= collider1.damage
                collider2.damageTick = 6
                collider1.damageTick = 6
            }
        }
        if ((collider1.type == "petal" && collider2.type == "mob") || (collider1.type == "mob" && collider2.type == "petal")) {
            let petal = collider1.type == "petal" ? collider1 : collider2
            let mob = collider1.type == "mob" ? collider1 : collider2
            if (!petal.dead && !mob.pet) {
                petal.stats.health -= Math.max(0, mob.damage - petal.stats.armor);
            }
            if (!mob.pet && !petal.dead) {
                mob.health -= petal.stats.damage;
                mob.damageTick = 6;

                if (petal.poison.poison > 0) {
                    mob.poisonTake(petal.poison.poison, petal.poison.tick);
                }
            }
        }
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
    if (mouseDraggingBox && mouseHolding && mouseDraggingBoxClass != null) {
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
    decorator.makeGrid()
    mobs.forEach((mob) => {
        mob.draw()
        mob.drawRarity()
    })
    player.draw()
    ctx.restore()
    petalBoxHolders.forEach((pBox) => {
        pBox.y = canvas.height - pBox.boxSize - 38
        pBox.x = canvas.width / 2 - (pBox.boxSize+15)*petalBoxHolders.length/2+((pBox.boxSize+15)*pBox.id)
        pBox.draw()
    })
    inventoryPetalToSlot.forEach((slot) => {
        slot.draw()
        slot.petal[0].drawOnBox(slot, 18)
    })
    inventory.x = 20
    inventory.y = canvas.height - inventory.height - 37
    inventory.draw()
    if (!mouseHolding && mouseDraggingBox) {
        let swapping = false
        for (let targetHolder of petalBoxHolders) {
            if (targetHolder.box === mouseDraggingBoxClass) continue;
            if (
                targetHolder.box instanceof EmptySlot &&
                boxCollision(mx, my, targetHolder.x, targetHolder.y, targetHolder.boxSize) && 
                !mouseDraggingBoxClass.comesFromInventory
            ) {
                const originHolder = mouseDraggingBoxClass.boxOn;
                const temp = originHolder.box;
                originHolder.box = targetHolder.box;
                targetHolder.box = temp;

                originHolder.box.boxOn = originHolder;
                targetHolder.box.boxOn = targetHolder;
                const sourceSlot = player.equippedPetals.find(s => s.id === originHolder.id);
                const targetSlot = player.equippedPetals.find(s => s.id === targetHolder.id);

                [sourceSlot.petal, targetSlot.petal] =
                [targetSlot.petal, sourceSlot.petal];
                if (sourceSlot.petal?.[0]) sourceSlot.petal[0].id = sourceSlot.id;
                if (targetSlot.petal?.[0]) targetSlot.petal[0].id = targetSlot.id;
                mouseDraggingBox = false;
                mouseDraggingBoxClass.followMouse = false;
                originHolder.draggingBox = false;
                targetHolder.draggingBox = false;
                swapping = true;
                break;
            }

            if (boxCollision(mx, my, targetHolder.x, targetHolder.y, targetHolder.boxSize) && !targetHolder.box.isEmpty && !mouseDraggingBoxClass.comesFromInventory) {
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
                mouseDraggingBoxClass.boxOn = targetHolder;
                sourceHolder.box = targetBox;

                [specificPetalSlot.petal, specificPetalSlot2.petal] = [specificPetalSlot2.petal, specificPetalSlot.petal];
                [specificPetalSlot.rarity, specificPetalSlot2.rarity] = [specificPetalSlot2.rarity, specificPetalSlot.rarity];

                specificPetalSlot.petal.id = specificPetalSlot.id;
                specificPetalSlot2.petal.id = specificPetalSlot2.id;
                if (targetBox) targetBox.boxOn = sourceHolder;

                mouseDraggingBoxClass.followMouse = false;
                sourceHolder.draggingBox = false;
                targetHolder.draggingBox = false;
                mouseDraggingBoxClass = null
                mouseDraggingBox = false
                swapping = true
                break;
            } 
            
            if (
                !swapping &&
                mouseDraggingBoxClass.comesFromInventory &&
                boxCollision(mx, my, targetHolder.x, targetHolder.y, targetHolder.boxSize) &&
                targetHolder.box instanceof EmptySlot
            ) {
                targetHolder.box = mouseDraggingBoxClass;
                mouseDraggingBoxClass.boxOn = targetHolder;
                mouseDraggingBoxClass.rarities = rarities;

                const slot = player.equippedPetals.find(
                    slot => slot.id === targetHolder.id
                );

                const petal = mouseDraggingBoxClass.petal[0];

                slot.petal = petal;
                slot.rarity = petal.rarity;
                petal.id = slot.id; 
                petal.host = player;
                inventoryPetalToSlot.splice(
                    inventoryPetalToSlot.indexOf(mouseDraggingBoxClass),
                    1
                );
                entities.push(petal)

                mouseDraggingBoxClass.followMouse = false;
                mouseDraggingBoxClass.comesFromInventory = false;
                targetHolder.draggingBox = false;
                mouseDraggingBox = false;

                swapping = true;
                break;
            }

        }
        if (!swapping && !mouseDraggingBoxClass.comesFromInventory) {
            if (!boxCollision(
                mx, 
                my, 
                mouseDraggingBoxClass.boxOn.x, 
                mouseDraggingBoxClass.boxOn.y, 
                mouseDraggingBoxClass.boxOn.boxSize
            )) {
                mouseDraggingBox = false
                mouseDraggingBoxClass.followMouse = false;
                mouseDraggingBoxClass.boxOn.draggingBox = false;
                let petal = mouseDraggingBoxClass.petal[0]
                petal.dead = true
                petal.summons.forEach((summon) => {
                    summon.health = 0
                })
                petal.summons = []
                let slot = player.equippedPetals.find(slot => slot.id === mouseDraggingBoxClass.boxOn.id)
                let selfBox = petalBoxHolders[petalBoxHolders.indexOf(mouseDraggingBoxClass.boxOn)]
                slot.petal = new PlaceholderPetal()
                mouseDraggingBox = false
                inventory.petalsToParse.push(petal)
                entities.splice(entities.indexOf(petal), 1)
                player.petalsOrbiting.splice(player.petalsOrbiting.indexOf(petal), 1)
                selfBox.box = new EmptySlot(selfBox)
            } else {
                mouseDraggingBox = false
                mouseDraggingBoxClass.followMouse = false;
                mouseDraggingBoxClass.boxOn.draggingBox = false
                mouseDraggingBoxClass = null
            }
        }
    }
    requestAnimationFrame(render)
}
render()
