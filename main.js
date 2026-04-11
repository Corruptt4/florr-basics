import { Decorator } from "./MODULES/ENTITIES/decorator.js";
import { Player } from "./MODULES/ENTITIES/player.js";
import { Camera } from "./MODULES/camera.js";
import { availablePetals, findPetal } from "./MODULES/STORAGE/petals.js";
import { EmptySlot, PetalBox, PetalBoxPlace } from "./MODULES/UI/petalBox.js";
import { abbreviate, boxBoxCollision, boxCollision, boxCollision2, degreesToRads } from "./SCRIPTS/functions.js";
import { availableMobs } from "./MODULES/STORAGE/mobs.js";
import { QuadTree, Rect } from "./MODULES/PHYSICS/quadTree.js";
import { Inventory, InventoryPetalBox } from "./MODULES/UI/inventory.js";
import { Petal, PlaceholderPetal } from "./MODULES/ENTITIES/petal.js";
import { SpatialHash } from "./MODULES/PHYSICS/spatialHash.js";
import { WaveMode } from "./MODULES/GAME/waveHandler.js";
import { MobBox } from "./MODULES/UI/mobBox.js";
import { Drop } from "./MODULES/ENTITIES/drop.js";

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

let mobRockBoxVar = []
let rockMobShape = 20
for (let i = 0; i < rockMobShape; i++) {
    mobRockBoxVar.push(1 + 0.15+Math.random()*(-0.30))
}

export let mapSize = 2000,
                    entities = [],
                    mobs = [],
                    summons = [],
                    allEntities = [],
                    decors = [],
                    mobBoxes = [],
                    petals = [],
                    drops = [],
                    frictionMultiplier = 0.95
export let sizeFactor = 1

let inventoryPetalToSlot = []
let sameMobBoxes = [] // only applies to same name boxes.
let sameSummonBoxes = []
let summonBoxes = []

let spatialHash = new SpatialHash(16, mapSize)
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
    ["Ancient", "rgb(175, 122, 0)"],
    ["Eternal", "rgb(255, 255, 255)"],
    ["Apotheotic", "rgb(216, 23, 153)"],
    ["Amethyst", "rgba(204, 0, 255, 1)"],
    ["Prismathic", "rgba(255, 187, 199, 1)"],
    ["Chaos", "rgba(100, 0, 207)"],
    ["Godly", "rgb(255, 255, 100)"],
    ["Divinity", "rgb(100, 0, 255)"],
    ["Universal", "rgb(200, 105, 125)"],
    ["Megaversal", "rgb(172, 200, 199)"],
    ["Infinity", "rgb(255, 188, 100)"],
    ["Dimensional", "rgb(92, 100, 160)"],
    ["Multidimensional", "rgb(170, 100, 200)"]
]


var petalBoxes = []
let player = new Player(100, 100, 25, "rgb(255,231,99)")
let camera = new Camera(player)
let decorator = new Decorator(0, mapSize, )
player.innitPetals()
let petalBoxHolders = []
let mobRarities = []
let wave = new WaveMode(1, rarities)
let inventory = new Inventory(20, canvas.height - 80, 90, 90)
inventory.innitPetals(rarities)
function spawnTestMob() {
     let mob = new availableMobs[0].constructor(
        mapSize/2 + 250,
        mapSize/2 + 250,
        rarities.length,
        availableMobs[0].health,
        availableMobs[0].damage,
        0.3
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
    if (!petals.includes(newPetal)) {
        petals.push(newPetal)
    }
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
        if (inventory.open) {
            for (let invSlot of inventory.visibleSlots) {
                if (boxCollision(mx, my, invSlot.x, invSlot.y, invSlot.boxSize) && invSlot.amount > 0) {
                    let editSlot = inventory.shownPetals.filter((petal) => invSlot.petal.name == petal.petal.name)
                    editSlot = editSlot.filter((petal) => (invSlot.rarity) == petal.actualRarity)
                    editSlot = editSlot[0]
                    const clonedPetal = structuredClone(editSlot.petal);
                    Object.setPrototypeOf(
                        clonedPetal,
                        Object.getPrototypeOf(editSlot.petal)
                    );
                    clonedPetal.host = player;
                    clonedPetal.stats = structuredClone(editSlot.petal.stats)
                    clonedPetal.rarity = editSlot.actualRarity
                    clonedPetal.innit()
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
window.addEventListener("wheel", (e) => {
    if (boxCollision2(mx, my, inventory.x, inventory.y, inventory.width, inventory.height) && inventory.open) {
        inventory.toScrollTarget += e.deltaY
    }
})
setInterval(() => {
    allEntities = mobs.concat(player).concat(entities).concat(summons).concat(drops)
    spatialHash.clearCellEntities()
    for (let entity of allEntities) {
        if (
            (entity.x - entity.size > mapSize) ||
            (entity.x + entity.size < 0) ||
            (entity.y - entity.size > mapSize) ||
            (entity.y + entity.size < 0) ||
            (entity.type === "petal" && entity.dead)
        ) {
            continue;
        }
        spatialHash.addEntity(entity)
    }
    spatialHash.update()

    spatialHash.collisions.forEach((collision) => {
        let collider1 = collision[0]
        let collider2 = collision[1]

        if ((collider1.type == "player" && collider2.type == "drop") || (collider1.type == "drop" && collider2.type == "player")) {
            let drop = collider1.type == "drop" ? collider1 : collider2
            if (drop.collected) return;
            let petal = new drop.petal.constructor(
                drop.petal.host,
                drop.petal.stats
            )
            petal.rarity = drop.rarity
            for (let i = 0; i < drop.amount; i++) {
                inventory.petalsToParse.push(petal)
            }
            drop.collected = true
            drops.splice(drops.indexOf(drop), 1)
        }
        let angle = Math.atan2(collider2.y - collider1.y, collider2.x - collider1.x)
        if (collider1.type !== "petal" && collider2.type !== "petal" && collider1.type !== "drop" && collider2.type !== "drop") {
            if (collider1.type == "player" && collider2.type == "mob" && collider2.pet) return;
            if (collider2.type == "player" && collider1.type == "mob" && collider1.pet) return;
            let invMass1 = 1 / collider1.mass
            let invMass2 = 1 / collider2.mass
            let totalInvMass = invMass1 + invMass2
            let p1 = invMass1 / totalInvMass
            let p2 = invMass2 / totalInvMass
            let strength1 = Math.min(p1, 1)
            let strength2 = Math.min(p2, 1)
            let pushPower = 1
            collider2.push.x += pushPower * strength2 * Math.cos(angle)
            collider2.push.y += pushPower * strength2 * Math.sin(angle)
            
            collider1.push.x -= pushPower * strength1 * Math.cos(angle)
            collider1.push.y -= pushPower * strength1 * Math.sin(angle)
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
    wave.update()
}, 1000/60)
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
    mobs.concat(summons).forEach((mob) => {
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
            if (mob.bubbleBurst.power > 0) {
                for (let entity of allEntities) {
                    if (entity !== mob && entity.type !== "petal" && !entity.pet && entity.type != "drop") {
                        let dx = mob.x-entity.x
                        let dy = mob.y-entity.y
                        let dist = dx*dx+dy*dy
                        let angle = Math.atan2(dy, dx)
                        if (mob.pet) {
                            if (entity.type !== "player") {
                                if (Math.sqrt(dist) <= (mob.size*mob.bubbleBurst.burstRange)) {
                                    entity.health -= mob.damage*mob.bubbleBurst.damageMulti
                                    entity.velocity.x -= (mob.bubbleBurst.power/(entity.mass**0.8)/(Math.sqrt(dist)/75))*Math.cos(angle)
                                    entity.velocity.y -= (mob.bubbleBurst.power/(entity.mass**0.8)/(Math.sqrt(dist)/75))*Math.sin(angle)
                                }
                            }
                        }
                        if (!mob.pet) {
                            if (Math.sqrt(dist) <= 600) {
                                entity.velocity.x -= (((entity.type == "player" ? mob.bubbleBurst.power**0.6 : mob.bubbleBurst.power))/(entity.mass)/(Math.sqrt(dist)/75))*Math.cos(angle)
                                entity.velocity.y -= (((entity.type == "player" ? mob.bubbleBurst.power**0.6 : mob.bubbleBurst.power))/(entity.mass)/(Math.sqrt(dist)/75))*Math.sin(angle)
                            }
                        }
                    }
                }
            }
            if (!mob.pet) {
                if (mob.actualDrops.length > 0) {
                    let totalDrops = []
                    let totalWeight = 0

                    mob.actualDrops.forEach((drops) => {
                        drops.forEach(([petal, rarity, chance]) => {
                            if (Math.random() < chance) {
                                let drop = new Drop(mob.x, mob.y, petal, 1)
                                drop.rarity = rarity
                                totalDrops.push(drop)
                            }
                        })
                    })
                    if (totalDrops.length == 1) {
                        drops.push(totalDrops[0])
                    } else if (totalDrops.length > 1) {
                        totalDrops.forEach((drop, i) => {
                            let angle = (360/totalDrops.length)*i
                            drop.x = mob.x + Math.cos(degreesToRads(angle))*80
                            drop.y = mob.y + Math.sin(degreesToRads(angle))*80
                            drops.push(drop)
                        })
                    }
                }
                mobs.splice(mobs.indexOf(mob), 1)
            } else {
                summons.splice(mobs.indexOf(mob), 1)
            }
            if (mob.pet) {
                mob.hostPetal.summons.splice(mob.hostPetal.summons.indexOf(mob), 1)
            }
         }
    })
    if (mouseDraggingBox && mouseHolding && mouseDraggingBoxClass != null) {
        mouseDraggingBoxClass.x += (mx - mouseDraggingBoxClass.x) * 0.3;
        mouseDraggingBoxClass.y += (my - mouseDraggingBoxClass.y) * 0.3;
    }
    drops.forEach((drop) => {
        drop.update()
    })
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
    petals = []
    summons = []
    player.equippedPetals.forEach((p) => {
        if (p.petal instanceof Petal) {
            if (!petals.includes(p.petal)) {
                petals.push(p.petal)
            }
        }
    })
    petals.forEach((petal) => {
        petal.summons.forEach((s) => {
            if (!summons.includes(s)) {
                summons.push(s)
            }
        })
    })
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    camera.apply()
    decorator.makeGrid()
    decorator.makeBoundaries()
    // spatialHash.draw()
    mobs.concat(summons).forEach((mob) => {
        mob.draw()
        mob.drawRarity()
    })
    drops.forEach((drop) => {
        drop.draw()
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
    inventory.visibleSlots.forEach((box) => {
        if (boxCollision(mx, my, box.x, box.y, box.boxSize)) {
            canvas.style.cursor = "pointer"
            box.hovered = true
        } else {
            box.hovered = false
        }
    })
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
                player.allPetals.splice(player.allPetals.indexOf(petal), 1)
                selfBox.box = new EmptySlot(selfBox)
            } else {
                mouseDraggingBox = false
                mouseDraggingBoxClass.followMouse = false;
                mouseDraggingBoxClass.boxOn.draggingBox = false
                mouseDraggingBoxClass = null
            }
        }
    }
    
    summonBoxes = []
    summons.forEach((summon) => {
        let summonBox = new MobBox(50, 80, 55, summon)
        summonBox.innitClone()
        summonBoxes.push(summonBox)
    })
    
    for (let i = 0; i < summonBoxes.length; i++) {
        let s1 = summonBoxes[i]
        for (let j = i+1; j < summonBoxes.length; j++) {
            let s2 = summonBoxes[j]
            if (s1.mob.name == s2.mob.name && s1.mob.rarity == s2.mob.rarity) {
                s1.amount += 1
                summonBoxes.splice(j, 1)
                j--
            }
        }
    }
    sameSummonBoxes = []
    while (summonBoxes.length > 0) {
        let s1 = summonBoxes.shift()
        let row = [s1]
        for (let i = summonBoxes.length - 1; i >= 0; i--) {
            if (summonBoxes[i].mob.name == s1.mob.name) {
                row.push(summonBoxes[i])
                summonBoxes.splice(i, 1)
            }
        }
        sameSummonBoxes.push(row)
    }
    sameSummonBoxes.forEach((similarMobs, rowIndex) => {
        similarMobs.sort((a, b) => a.mob.rarity - b.mob.rarity);
        similarMobs.forEach((box, i) => {
            box.x = box.l/2+10 + ((box.l*2)/1.5)*rowIndex
            box.y = box.l/2+10 + ((box.l*2)/1.5)*i;
        });
    });
    
    mobBoxes = [];
    mobs.forEach(mob => {
        let mobBox = new MobBox(50, 80, 55, mob);
        if (mob.name === "Rock") {
            mobBox.shape = rockMobShape;
            mobBox.varieties = mobRockBoxVar;
        }
        mobBox.innitClone();
        mobBoxes.push(mobBox);
    });

    
    for (let i = 0; i < mobBoxes.length; i++) {
        let box1 = mobBoxes[i];
        for (let j = i + 1; j < mobBoxes.length; j++) {
            let box2 = mobBoxes[j];
            if (box1.mob.name === box2.mob.name && box1.mob.rarity === box2.mob.rarity) {
                box1.amount += 1;
                mobBoxes.splice(j, 1);
                j--;
            }
        }
    }

    sameMobBoxes = [];
    while (mobBoxes.length > 0) {
        let mob1 = mobBoxes.shift();
        let row = [mob1];

        for (let i = mobBoxes.length - 1; i >= 0; i--) {
            if (mobBoxes[i].mob.name === mob1.mob.name) {
                row.push(mobBoxes[i]);
                mobBoxes.splice(i, 1);
            }
        }

        sameMobBoxes.push(row);
    }
    sameMobBoxes.forEach((similarMobs, rowIndex) => {
        similarMobs.sort((a, b) => a.mob.rarity - b.mob.rarity);
        similarMobs.forEach((box, i) => {
            box.x = (canvas.width/2-((box.l*2)*1.15)*(sameMobBoxes.length/4)) + (box.l*1.35) * rowIndex;
            box.y = box.l+120 + (box.l*1.15) * i;
        });
    });
    
    sameMobBoxes.forEach((row) => {
        row.forEach((box) => {
            if (boxCollision(mx, my, box.x-box.l/2, box.y-box.l/2, box.l) && !mouseDraggingBox) {
                box.hovered = true
            } else {
                box.hovered = false
            }
        })
    })
    sameSummonBoxes.forEach((row) => {
        row.forEach((box) => {
            if (boxCollision(mx, my, box.x-box.l/2, box.y-box.l/2, box.l) && !mouseDraggingBox) {
                box.hovered = true
            } else {
                box.hovered = false
            }
        })
    })
    sameMobBoxes.forEach((similarMobs, rowIndex) => {
        similarMobs.forEach((box) => {
            box.draw();
        });
    });    
    sameSummonBoxes.forEach((similarMobs, rowIndex) => {
        similarMobs.sort((a, b) => a.mob.rarity - b.mob.rarity);
        similarMobs.forEach((box, i) => {
            box.draw();
        });
    });
    
    sameMobBoxes.forEach((similarMobs, rowIndex) => {
        similarMobs.forEach((box) => {
            if (box.hovered) {
                box.drawStatBox()
            }
        });
    });    
    sameSummonBoxes.forEach((similarMobs, rowIndex) => {
        similarMobs.sort((a, b) => a.mob.rarity - b.mob.rarity);
        similarMobs.forEach((box, i) => {
            if (box.hovered) {
                box.drawStatBox()
            }
        });
    });
    wave.draw()
    sizeFactor = wave.sizeFactor
    requestAnimationFrame(render)
}
render()
