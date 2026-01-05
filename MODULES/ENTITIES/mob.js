import { ctx, entities, frictionMultiplier, mapSize, mobs } from "../../main.js";
import { darkenRGB } from "../../SCRIPTS/functions.js";

export class Mob {
    constructor(x, y, rarity, health, damage, size) {
        this.x = x;
        this.y = y;
        this.rarity = rarity;
        this.rarities = null;
        this.rarityName = null;
        this.rarityColor = null;
        this.originalSize = size
        this.size = size * Math.pow(1.30, rarity-1)
        this.startingHP = health
        this.startingDMG = damage
        this.speed = 0.2
        this.health = this.startingHP * Math.pow(3.56, rarity-1) * Math.pow(1.25, rarity-1);
        this.maxHealth = this.startingHP * Math.pow(3.56, rarity-1) * Math.pow(1.25, rarity-1);
        this.damage = this.startingDMG * Math.pow(2.55, rarity-1) * Math.pow(1.2, rarity-1);
        this.angle = 0
        this.type = "mob"
        this.name = "Baby Ant" // PLACEHOLDER
        this.t = 0;
        this.chasesPlayers = false;
        this.poisonTick = 0;
        this.poisonToTake = 0;
        this.poisonTicks = 0;
        this.moving = true
        this.target = null
        this.mass = 1 * Math.pow(1.2, rarity-1)
        this.turnSpeed = 0.08;
        this.pet = false
        this.hostPetal = null;
        this.givenTargets = [];
        this.potentialEnemies = [];
        this.oldAngle = 0;
        this.oldHealth = this.maxHealth
        this.detectionDistance = this.size*2*10
        this.maxTimer = 180
        this.timer = this.maxTimer
        this.detecDistPet = 0;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.aggressive = false
        this.color = "rgb(85, 85, 85)"
    }
    innitMob() {
        this.angle = Math.PI * 2 * Math.random() - Math.PI
        if (this.pet) {
            this.size = this.originalSize * Math.pow(1.14, this.rarity-1)
        }
    }
    update(player) {
        this.potentialEnemies = []
        if (this.poisonTick > 0) {
            this.poisonTick--
            this.health -= this.poisonToTake/this.poisonTicks
        }
        if (this.x - this.size < 0) {
            this.velocity.x += 1
        }
        if (this.x + this.size > mapSize) {
            this.velocity.x -= 1
        }
        if (this.y - this.size < 0) {
            this.velocity.y += 1
        }
        if (this.y + this.size > mapSize) {
            this.velocity.y -= 1
        }

        if (!this.pet) {
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
            if (this.potentialEnemies.length > 0) {
                this.potentialEnemies.sort((a, b) => a[0] -b[0])
                this.target = this.potentialEnemies[0][1]
            }
            if (this.target) {
                let tx = this.x - this.target.x
                let ty = this.y - this.target.y
                let angle = Math.atan2(ty, tx)
                let diff = ((angle-this.angle) % (Math.PI*2)) - Math.PI
                this.angle += (diff) * this.turnSpeed
                this.velocity.x += this.speed * Math.cos(this.angle)
                this.velocity.y += this.speed * Math.sin(this.angle)
                if (this.target.health <= 0) {
                    this.target = null
                }
            }
            if (dist > r) {
                let angle = Math.atan2(ddy, ddx)
                let diff = ((angle-this.angle) % (Math.PI*2)) - Math.PI
                this.angle += (diff) * this.turnSpeed
                this.velocity.x += this.speed * Math.cos(this.angle)
                this.velocity.y += this.speed * Math.sin(this.angle)
            }
        }
        this.t += 0.1 * (1+this.aggressive)
        
        if (!this.chasesPlayers || !this.target) {
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
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.velocity.x *= frictionMultiplier
        this.velocity.y *= frictionMultiplier
    }
    getSpecificStats(rarity) {
        this.specificHP = this.startingHP * Math.pow(3.56, rarity) * Math.pow(1.25, rarity);
        this.specificDMG = this.startingDMG * Math.pow(2.55, rarity) * Math.pow(1.2, rarity);
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
        this.oldHealth +=(this.health - this.oldHealth) * 0.1
        this.rarityName = this.rarities[this.rarity-1][0];
        this.rarityColor = this.rarities[this.rarity-1][1];
        
        let healthWidth = 150
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 4
        ctx.lineJoin = "round"
        ctx.roundRect(-healthWidth/2, this.size + 40, healthWidth, 5, 5)
        ctx.stroke()
        ctx.fill()

        ctx.fillStyle = this.rarityColor
        ctx.strokeStyle = darkenRGB(this.rarityColor, 20)
        ctx.font = "15px Arial"
        ctx.textAlign = "right"
        ctx.strokeText(this.rarityName, healthWidth/2, this.size+60)
        ctx.fillText(this.rarityName, healthWidth/2, this.size+60)
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.textAlign = "left"
        ctx.strokeText(this.name, -healthWidth/2, this.size+35)
        ctx.fillText(this.name, -healthWidth/2, this.size+35)
        ctx.closePath()


        ctx.beginPath()
        ctx.fillStyle = "red"
        ctx.roundRect(-healthWidth/2, this.size + 40, healthWidth*(this.oldHealth/this.maxHealth), 5, 5)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "lime"
        ctx.roundRect(-healthWidth/2, this.size + 40, healthWidth*(this.health/this.maxHealth), 5, 5)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
}