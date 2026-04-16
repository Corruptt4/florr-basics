import { ctx, entities, frictionMultiplier, mapSize, mobs } from "../../main.js";
import { abbreviate, darkenRGB, findMob, randomElement } from "../../SCRIPTS/functions.js";
import { findPetal } from "../STORAGE/petals.js";

export class Mob {
    constructor(x, y, rarity, health, damage, size) {
        this.x = x;
        this.y = y;
        this.rarity = rarity;
        this.rarities = null;
        this.rarityName = null;
        this.rarityColor = null;
        this.originalSize = size
        this.infected = 0
        this.size = size  * rarity
        this.startingHP = health
        this.startingDMG = damage
        this.speed = 0.2
        this.summoner = false
        this.actualSpeed = this.speed
        this.health = this.startingHP * Math.pow(3.8, rarity-1) * Math.pow(1.35, rarity-1);
        this.maxHealth = this.startingHP * Math.pow(3.8, rarity-1) * Math.pow(1.35, rarity-1);
        this.damage = this.startingDMG * Math.pow(2.25, rarity-1) * Math.pow(1.32, rarity-1);
        this.angle = 0
        this.type = "mob"
        this.name = "Baby Ant" // PLACEHOLDER
        this.t = 0;
        this.bubbleBurst = {
            power: 0,
            damageMulti: 1
        }
        this.sandstormMovement = false;
        this.isSandstorm = false;
        this.chasesPlayers = false;
        this.poisonTick = 0;
        this.poisonToTake = 0;
        this.poisonTicks = 0;
        this.mass = 50;
        this.moving = true
        this.target = null
        this.mass = 10 * Math.pow(1.2, rarity-1)
        this.turnSpeed = 0.08;
        this.pet = false;
        this.snapToPlayer = false
        this.boxOffsetX = 0;
        this.boxOffsetY = 0;
        this.hostPetal = null;
        this.givenTargets = [];
        this.sizeVariation = false

        // Summoner stuff
        this.summonerSettings = {
            minimumRarity: 1,
            losesHealthPerSpawn: false,
            summonRarityDecrease: 0,
            summonsThroughDamage: false,
            chance: 0
        }

        this.deathSummon = null
        this.summonsOnDeath = false;
        this.summonWithHealth = false;
        this.mobsToSummon = []
        this.summonMaxTick = 180;
        this.summonTick = this.summonMaxTick;

        // this.chasesMobs is for pets
        this.chasesMobs = false
        this.potentialEnemies = [];
        this.goingToPlayer = false
        this.description = "Are you meant to even see this description?"

        this.canBeDisplayed = true
        this.hatchTime = 0
        this.summonMob = []
        this.mobToSpawn = null
        this.canHatch = false;
        this.oldAngle = 0;
        this.oldHealth = this.maxHealth
        this.normalHP = this.maxHealth
        this.detectionDistance = this.size*2*10
        this.maxTimer = 180
        this.timer = this.maxTimer
        this.stormTimer = 30
        this.stormMaxTimer = 30
        this.damageTick = 0;
        this.detecDistPet = 0;
        this.rock = false;
        this.dropChances = []
        this.varieties = []
        this.drops = []
        this.actualDrops = []
        this.petalIDs = []
        this.velocity = {
            x: 0,
            y: 0
        }
        this.push = {
            x: 0,
            y: 0
        }
        this.aggressive = false
        this.color = "rgb(85, 85, 85)"
    }
    takeDamage() {
        if (this.summoner && this.summonerSettings.summonsThroughDamage) {
            let chance = Math.random() < this.summonerSettings.chance
            if (chance) {
                for (let i = 0; i < 1 + Math.random()*3; i++) {
                    let mobToSpawn = this.mobsToSummon[randomElement(this.mobsToSummon)]
                    let actualMob = findMob(mobToSpawn)
                    let summon = new actualMob.constructor(
                        this.x,
                        this.y,
                        Math.max(this.rarity-1-this.summonerSettings.summonRarityDecrease, 1),
                        actualMob.health,
                        actualMob.damage,
                        actualMob.size
                    )
                    summon.rarities = this.rarities
                    summon.innitMob()
                    mobs.push(summon)
                }
            }
        }
    }
    innitMob() {
        if (this.infected && !this.pet) {
            this.health *= 1.5
            this.maxHealth *= 1.5
            this.damage *= 0.7
            this.name = "Infected " + this.name
            this.color = "rgb(56, 206, 93)"
            this.description += " Why is it green?"
            this.petalIDs.push("Bacteria")
            this.dropChances.push(this.dropChances[0]*1.1)
        }
        if (!this.pet) {
            if (this.canHatch) {
                let mob = findMob(this.summonMob[0])
                this.mobToSpawn = mob
            }
            this.petalIDs.forEach((petal) => {
                this.drops.push(findPetal(`${petal}`))
            })
            this.drops.forEach((drop, index) => {
                let rarity = this.rarity
                let chance = this.dropChances[index]

                let rarityChances = this.rarity < 2
                    ? [chance, chance / 2.8332] : this.rarity == 2 ? [chance/2.1223, chance/1.432]
                    : [Math.min((chance / 5.882)*(13/this.rarity), 0.9), Math.min((chance / 3.291)*(13/this.rarity), 0.8), Math.min((chance / 4.823)*(13/this.rarity), 0.6)]

                let rarityPool = this.rarity <= 2
                    ? this.rarity == 1 ? [rarity, rarity+1] : [Math.max(rarity-1, 1), rarity]
                    : [Math.max(rarity - 2, 1), rarity - 1, rarity]

                let dropsToParse = []

                for (let k = 0; k < Math.min(rarityChances.length, rarityPool.length); k++) {
                    dropsToParse.push([
                        drop,
                        Math.max(rarityPool[k], 0),
                        rarityChances[k]
                    ])
                }

                this.actualDrops.push(dropsToParse)
            })
        }
        if (this.rock) {
            for (let i = 0; i < this.shape; i++) {
                this.varieties.push(1 - 0.15+Math.random()*0.3)
            }
        }
        this.angle = Math.PI * 2 * Math.random() - Math.PI
        this.mass *= Math.pow(4, this.rarity-1)
        this.bubbleBurst.power *= 1+Math.max((1.5*(this.rarity-1)*(1.1**(this.rarity-1))), 1) * (this.pet ? 2.4*(this.rarity-1)*Math.pow(2.12, this.rarity-1) : 1)
        if (this.pet) {
            this.size = this.originalSize * 1.05 * this.rarity
            if (this.name == "Bubble") {
                this.snapToPlayer = true
            }
            this.damage *= (this.pet ? Math.pow(1.25, this.rarity-1) : 1)
        }
        if (this.isSandstorm || this.sizeVariation) {
            this.size *= 0.8 + (Math.random() * 0.3)
        }
    }
    update(player) {
        if (this.damageTick > 0) {
            this.damageTick--
        }
        this.potentialEnemies = []
        if (this.poisonTick > 0) {
            this.poisonTick--
            this.damageTick = 6
            this.health -= this.poisonToTake/this.poisonTicks
        }

        if (!this.pet) {
            if (this.summoner) {
                if (this.summonTick > 0 && this.rarity >= this.summonerSettings.minimumRarity && !this.summonerSettings.summonsThroughDamage) {
                    this.summonTick--
                }
                if (this.summonTick <= 0) {
                    this.summonTick = this.summonMaxTick
                    let mobToSpawn = this.mobsToSummon[randomElement(this.mobsToSummon)]
                    let actualMob = findMob(mobToSpawn)
                    console.log(actualMob)
                    let mob = new actualMob.constructor(
                        this.x,
                        this.y,
                        Math.max(this.rarity-1-this.summonerSettings.summonRarityDecrease, 1),
                        actualMob.health,
                        actualMob.damage,
                        actualMob.size
                    )
                    if (this.infected) {
                        mob.infected = true
                    } else {
                        mob.infected = Math.random() < 0
                    }
                    mob.rarities = this.rarities
                    mob.innitMob()
                    mob.name += " Summon"
                    mob.description += " Summoned by " + this.name
                    mob.petalIDs = []
                    mob.dropChances = []
                    mob.boxExtraRotation = -45
                    mob.canBeDisplayed = false
                    mob.actualDrops = []
                    if (this.summonerSettings.losesHealthPerSpawn) {
                        this.health -= mob.health
                    }
                    mobs.push(mob)
                }
            }
            if (this.canHatch) {
                this.hatchTime--
                if (this.hatchTime <= 0) {
                    let hatchedMob = new this.mobToSpawn.constructor(
                        this.x, this.y,
                        this.rarity, this.mobToSpawn.health, this.mobToSpawn.damage, this.mobToSpawn.size
                    )
                    hatchedMob.rarities = this.rarities
                    hatchedMob.innitMob()
                    mobs.push(hatchedMob)
                    mobs.splice(mobs.indexOf(this), 1)
                }
            }
            let dx = player.x-this.x
            let dy = player.y-this.y
            let dist = dx*dx+dy*dy
            let r = this.detectionDistance*this.detectionDistance
            if (dist <= r) {
                this.target = player
            }
            if (dist > r) {
                this.target = null;
            }
            
            if (this.chasesPlayers && this.target && !this.pet) {
                this.aggressive = true
                let dx = this.x - player.x
                let dy = this.y - player.y
                let angle = Math.atan2(dy, dx)
                let diff = ((angle-this.angle) % (Math.PI*2)) - Math.PI
                this.angle += (diff) * this.turnSpeed

                this.velocity.x += this.speed * Math.cos(this.angle)
                this.velocity.y += this.speed * Math.sin(this.angle)
            }
        }
        if (this.pet) {
            if (this.snapToPlayer) {
                let dx = player.x-this.x
                let dy = player.y-this.y
                let angle = Math.atan2(dy, dx)
                this.velocity.x += 1 * Math.cos(angle)
                this.velocity.y += 1 * Math.sin(angle)
            } else {
                this.chasesPlayers = false
                let ddx = this.x-player.x
                let ddy = this.y-player.y
                let dist = ddx*ddx+ddy*ddy
                let r = 400**2
                let detection = (this.detectionDistance*this.detectionDistance)
                this.detecDistPet = detection
                this.givenTargets.forEach((t) => {
                    let ex = t.x - this.x
                    let ey = t.y - this.y
                    let edist = ex*ex+ey*ey
                    if (edist <= detection && this.target == null) {
                        this.potentialEnemies.push([edist, t])
                    }
                })
                if (this.potentialEnemies.length > 0 && this.chasesMobs) {
                    this.potentialEnemies.sort((a, b) => a[0] -b[0])
                    this.target = this.potentialEnemies[0][1]
                }
                if (this.target) {
                    this.aggressive = true
                    let tx = this.x - this.target.x
                    let ty = this.y - this.target.y
                    let angle = Math.atan2(ty, tx)
                    let diff = ((angle-this.angle) % (Math.PI*2)) - Math.PI
                    this.angle += (diff) * this.turnSpeed
                    this.velocity.x += this.speed * Math.cos(this.angle)
                    this.velocity.y += this.speed * Math.sin(this.angle)
                    if (this.target.health <= 0) {
                        this.target = null
                        this.aggressive = false
                    }
                }
                if (dist > r) {
                    this.goingToPlayer = true
                    let angle = Math.atan2(ddy, ddx)
                    let diff = ((angle-this.angle) % (Math.PI*2)) - Math.PI
                    this.angle += (diff) * this.turnSpeed
                    this.velocity.x += this.speed * Math.cos(this.angle)
                    this.velocity.y += this.speed * Math.sin(this.angle)
                } if (dist <= r) {
                    this.goingToPlayer = false
                }
            }
        }
        this.t += 0.15 * (1+this.aggressive)

        if (this.sandstormMovement && !this.goingToPlayer) {
            this.moving = true
            this.stormTimer--
            if (this.stormTimer <= 0) {
                this.angle = Math.PI * 2 * Math.random() - Math.PI
                this.speed = this.actualSpeed * (1 + Math.random() * 0.7)
                this.stormTimer = this.stormMaxTimer + (1 - Math.random() * 2)
            }

                
            this.velocity.x += this.speed * Math.cos(this.angle)
            this.velocity.y += this.speed * Math.sin(this.angle)
            this.angle += (0.1 * Math.sin(this.t))
        }
        
        if ((!this.chasesPlayers || this.target == null) && !this.sandstormMovement && this.speed > 0) {
            this.timer--
            if (this.timer <= 100) {
                this.moving = false
            }
            if (this.timer <= 0) {
                this.timer = this.maxTimer
                let randomAngle = Math.PI * 2 * Math.random() - Math.PI
                this.angle = randomAngle
                this.moving = true
            }
            if (this.moving) {
                this.velocity.x += this.speed * Math.cos(this.angle)
                this.velocity.y += this.speed * Math.sin(this.angle)
            }
        }
        this.x += this.push.x
        this.y += this.push.y
        this.x += this.velocity.x
        this.y += this.velocity.y
        
        this.x = Math.min(Math.max(this.x, this.size), mapSize-this.size)
        this.y = Math.min(Math.max(this.y, this.size), mapSize-this.size)
        this.push.x *= frictionMultiplier
        this.push.y *= frictionMultiplier
        this.velocity.x *= frictionMultiplier
        this.velocity.y *= frictionMultiplier
    }
    getSpecificStats(rarity, isPet = false) {
        this.specificHP = this.startingHP * Math.pow(3.8, rarity) * Math.pow(1.35, rarity);
        this.specificDMG = this.startingDMG * Math.pow(2.25, rarity) * Math.pow(1.32, rarity) * (isPet ? Math.pow(1.25, rarity) : 1);
        return {
            hp: this.specificHP,
            dmg: this.specificDMG
        }
    }
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.rotate(this.angle+(Math.sin(this.t) * (Math.PI / 40)))
        ctx.moveTo(this.size/2, this.size/1.7)
        ctx.lineTo(this.size*1.35, this.size/2.5)
        ctx.lineTo(this.size/2, this.size/1.7)
        ctx.lineWidth = this.size/4
        ctx.lineJoin = "round"
        ctx.strokeStyle = "rgb(25, 25, 25)"
        ctx.fillStyle = "rgb(25, 25, 25)"
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        ctx.restore()

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.rotate(this.angle-((Math.PI / 40)*Math.sin(this.t)))
        ctx.lineWidth = this.size/4
        ctx.lineJoin = "round"
        ctx.strokeStyle = "rgb(25, 25, 25)"
        ctx.fillStyle = "rgb(25, 25, 25)"
        ctx.moveTo(this.size/2, -this.size/1.7)
        ctx.lineTo(this.size*1.35, -this.size/2.5)
        ctx.lineTo(this.size/2, -this.size/1.7)
        
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        ctx.restore()


        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath()
        ctx.lineWidth = this.size/4
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color, 20)
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
    drawDetectionSize() {
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.arc(this.x, this.y, Math.sqrt(this.detecDistPet), 0, Math.PI * 2)
        ctx.stroke()
        ctx.closePath()
    }
    poisonTake(poison, time) {
        this.poisonTick = time
        this.poisonTicks = time
        this.poisonToTake = poison
    }
    drawRarity() {
        if (this.health < 0) {
            this.health = 0
        }
        this.oldHealth +=(this.normalHP - this.oldHealth) * (0.05 * (this.damageTick > 0 ? 0 : 1))
        this.normalHP += (this.health - this.normalHP) * 0.2
        this.rarityName = this.rarities[this.rarity-1][0];
        this.rarityColor = this.rarities[this.rarity-1][1];
        
        let healthWidth = 150
        ctx.save()
        ctx.translate(this.x, this.y)

        ctx.beginPath()
        ctx.lineJoin = "round"
        ctx.fillStyle = this.rarityColor
        ctx.lineWidth = 4
        ctx.strokeStyle = darkenRGB(this.rarityColor, 25)
        ctx.font = "15px Arial"
        ctx.textAlign = "right"
        ctx.strokeText(this.rarityName, healthWidth/2, this.size+75)
        ctx.fillText(this.rarityName, healthWidth/2, this.size+75)
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.textAlign = "left"
        ctx.strokeText(this.name, -healthWidth/2, this.size+32)
        ctx.fillText(this.name, -healthWidth/2, this.size+32)
        ctx.textAlign = "center"
        ctx.closePath()
        
        
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 8
        ctx.lineJoin = "round"
        ctx.roundRect(-healthWidth/2, this.size + 40, healthWidth, 15, 15)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        ctx.clip()


        ctx.beginPath()
        ctx.fillStyle = "red"
        ctx.roundRect(-healthWidth/2, this.size + 40, healthWidth*(this.oldHealth/this.maxHealth), 15, 15)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "lime"
        ctx.roundRect(-healthWidth/2, this.size + 40, healthWidth*(this.normalHP/this.maxHealth), 15, 15)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 1
        ctx.lineJoin = "round"
        ctx.roundRect(-healthWidth/2, this.size + 40, healthWidth, 15, 15)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.lineJoin = "round"
        ctx.lineWidth = 4
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.textAlign = "center"
        ctx.font = "12px Arial"
        let actualHp = abbreviate(this.maxHealth*(this.normalHP/this.maxHealth))
        ctx.strokeText(`${actualHp}/${abbreviate(this.maxHealth)}`, 0, this.size+51)
        ctx.fillText(`${actualHp}/${abbreviate(this.maxHealth)}`, 0, this.size+51)
        ctx.closePath()

        ctx.restore()
    }
}