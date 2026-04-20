import { ctx, frictionMultiplier, summons, rarities, sizeFactor } from "../../main.js";
import { darkenRGB, degreesToRads } from "../../SCRIPTS/functions.js";
import { availableMobs } from "../STORAGE/mobs.js";
import { Mob } from "./mob.js";

// Just for slots with no petals, it won't be taken into account in rendering, updating, or in player.petalsOrbiting. Just to not break something
export class PlaceholderPetal {
    constructor() {
        this.type = "PlaceholderPetal"
        this.name = "Placeholder"
    }
}

export class Petal {
    constructor(host, stats = {
        health: 10,
        damage: 10,
        armor: 0
    }) {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.host = host;
        this.stats = stats;
        this.rarity = 0;
        this.dead = true;
        this.reload = 0;
        this.maxHealth = 0;
        this.size = 10;
        this.innited = false;
        this.maxReload = 60;
        this.description = "A basic petal, not too strong or too weak."
        this.orbitoffset = 0
        this.name = "Basic"
        this.altName = "Basic"
        this.poison = {
            poison: 0,
            tick: 0
        }
        this.angle = 0
        this.spin = -0.05 * Math.random() * (0.05 + 0.05)
        this.id = null;
        this.summons = []
        this.pushX = 0
        this.pushY = 0
        this.isSummoner = false
        this.lockedAngle = false
        this.showRarity = false;
        this.sides = 0
        this.extraSpeed = 0
        this.variations = []
        this.type = "petal"
        this.maxSummonTimer = 0;
        this.summoner = {
            type: 1,
            timer: 1,
            timer2: 1,
            killsPetal: true,
            scalesWithRarity: false,
            summonRarity: 1,
            capacity: 1,
            lowerRarity: 0,
            mobSnapToPlayer: false,
            scalesPetal: false,
        }
        /* 
        This are default stats.
        Stats:
        HEALTH: 6
        DAMAGE: 6
        SIZE: 10,
        RELOAD: 60 (ticks)
        */
        this.color = "rgb(255, 255, 255)"
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    summon() {
        if (this.summoner.timer > 0 && (this.summoner.capacity > 1 ? this.summons.length < this.summoner.capacity : this.summons.length == 0) && !this.dead) {
            this.summoner.timer--
        }
        if (this.summoner.timer <= 0) {
            this.summoner.timer = this.maxSummonTimer
            if (this.summoner.killsPetal) {
                this.dead = true
            }
            let summon = new availableMobs[this.summoner.type].constructor(
                this.x,
                this.y,
                this.summoner.summonRarity+1,
                availableMobs[this.summoner.type].health,
                availableMobs[this.summoner.type].damage,
                availableMobs[this.summoner.type].size*sizeFactor,
            )
            summon.rarities = rarities
            summon.hostPetal = this
            if (summon.name !== "Bubble") {
                summon.color = "rgb(255, 255, 0)"
            }
            if (summon.name == "Bubble") {
                summon.description += " Blessed by the Flower to deal damage to nearby mobs."
            }
            summon.snapToPlayer = this.summoner.mobSnapToPlayer
            summon.pet = true
            summon.innitMob()
            this.summons.push(summon)
        }
    }
    reloadPetal() {
        if (this.reload < this.maxReload && this.dead) {
            this.reload++
        }
        if (this.reload >= this.maxReload && this.dead) {
            this.reload = 0
            this.x = this.host.x
            this.y = this.host.y
            this.stats.health = this.maxHealth
            this.dead = false
        }
    }
    dist(x2, x1, y2, y1) {
        let dx = x2-x1
        let dy = y2-y1

        return Math.sqrt(dx*dx+dy*dy)
    }
    makeSides() {
        if (this.sides > 0) {
            for (let i = 0; i < this.sides; i++) {
                this.variations.push(0.8 + Math.random() * 0.4)
            }
        }
    }
    innit() {
        this.innited = true
        if (this.sides > 0) {
            for (let i = 0; i < this.sides; i++) {
                this.variations.push(0.8 + Math.random() * 0.4)
            }
        }
        if (this.isSummoner) {
            this.summoner.summonRarity = Math.max(this.rarity-2-this.summoner.lowerRarity, 0)
            if (this.summoner.scalesWithRarity) {
                this.summoner.timer *= Math.pow(1.27, this.summoner.summonRarity)
                this.summoner.timer2 = this.summoner.timer
            }
        }
        this.extraSpeed *= (this.rarity+1)
        this.maxSummonTimer = this.summoner.timer
        let exponential = 1.46
        let mainExponent = 2.6
        this.x = this.host.x
        this.y = this.host.y
        this.stats.health *= Math.pow(mainExponent, this.rarity-1) * Math.pow(exponential, this.rarity-1)
        this.maxHealth = this.stats.health
        this.stats.damage *= Math.pow(mainExponent+0.4, this.rarity-1) * Math.pow(exponential, this.rarity-1)
        this.stats.armor *= Math.pow(mainExponent, this.rarity-1) * Math.pow(exponential, this.rarity-1)
        this.poison.poison *= Math.pow(mainExponent, this.rarity-1) * Math.pow(exponential, this.rarity-1)
        
        this.stats.health = Math.round(this.stats.health)
        this.stats.damage = Math.round(this.stats.damage)
        this.stats.armor = Math.round(this.stats.armor)
        this.poison.poison = Math.round(this.poison.poison)
    }
    update() {
        if (this.lockedAngle) {
            this.angle = 0
        } else {
            this.angle += this.spin
        }
        this.targetX = this.host.x + this.host.petalOrbitDistance 
        * Math.cos(this.host.globalAngle + 
        degreesToRads((360 / this.host.petalsOrbiting.length) * (this.id-1)))
        
        this.targetY = this.host.y + this.host.petalOrbitDistance 
        * Math.sin(this.host.globalAngle + 
        degreesToRads((360 / this.host.petalsOrbiting.length) * (this.id-1)))
        
        let angle = Math.atan2(this.targetY - this.y, this.targetX - this.x)
        
        this.velocity.x += 0.5 * Math.log(this.dist(this.targetX, this.x, this.targetY, this.y)) * Math.cos(angle)
        this.velocity.y += 0.5 * Math.log(this.dist(this.targetX, this.x, this.targetY, this.y)) * Math.sin(angle)

        this.x += this.velocity.x
        this.y += this.velocity.y
        this.pushX *= frictionMultiplier
        this.pushY *= frictionMultiplier
        this.velocity.y *= frictionMultiplier
        this.velocity.x *= frictionMultiplier
    }
    draw() {
        if (this.stats.health < 0) {
            this.stats.health = 0
        }
        if (this.showRarity) {
            ctx.beginPath()
            ctx.globalAlpha = 0.5
            let rarityName = rarities[this.rarity-1][0]
            ctx.fillStyle = rarities[this.rarity-1][1]
            ctx.strokeStyle = "black"
            ctx.arc(this.x, this.y, this.size*2, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
            ctx.beginPath()
            ctx.fillStyle = rarities[this.rarity-1][1]
            ctx.strokeStyle = "black"
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        // This is a placeholder petal drawing.
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke()
        
        if (this.showRarity) {
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.lineWidth = 3
            ctx.font = "10px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(this.id, this.x, this.y+10/3)
            ctx.fillText(this.id, this.x, this.y+10/3)
        }
        ctx.closePath();
    }
    drawOnBox(box, size, textSize, boxOffset = 0) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize/2-boxOffset, box.y + boxSize/2 - 10-boxOffset)
        ctx.rotate(degreesToRads(box.boxRotation))
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke()
        ctx.closePath();

        ctx.lineWidth = 4
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = `${textSize}px Arial`
        ctx.lineJoin = "round"
        ctx.textAlign = "center"
        ctx.strokeText(`${this.altName}`, 0, +boxSize/2.2)
        ctx.fillText(`${this.altName}`, 0, +boxSize/2.2)
        ctx.restore()
    }
}