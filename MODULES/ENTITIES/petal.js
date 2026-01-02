import { ctx, frictionMultiplier, rarities } from "../../main.js";
import { darkenRGB, degreesToRads } from "../../SCRIPTS/functions.js";

export class Petal {
    constructor(host, stats = {
        health: 10,
        damage: 10,
        armor: 0,
        size: 8
    }) {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.host = host;
        this.stats = stats;
        this.rarity = 1;
        this.dead = true;
        this.reload = 0;
        this.maxReload = 60;
        this.description = "A basic petal, not too strong or too weak."
        this.orbitoffset = 0
        this.name = "Basic"
        this.altName = "Basic"
        this.angle = 0
        this.spin = -0.05 * Math.random() * (0.05 + 0.05)
        this.id = null;
        this.showRarity = false;
        /* 
        This is default stats.
        Stats:
        HEALTH: 10
        DAMAGE: 10
        SIZE: 8
        */
        this.color = "rgb(255, 255, 255)"
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    reloadPetal() {
        if (this.dead) {
            if (this.reload < this.maxReload) {
                this.reload++
            }
            if (this.reload >= this.maxReload) {
                this.x = this.host.x
                this.y = this.host.y
                this.dead = false
                this.reload = 0
            }
        }
    }
    dist(x2, x1, y2, y1) {
        let dx = x2-x1
        let dy = y2-y1

        return Math.sqrt(dx*dx+dy*dy)
    }
    innit() {
        let exponential = 1.17
        let mainExponent = 2.75
        this.x = this.host.x
        this.y = this.host.y
        this.stats.health *= Math.pow(mainExponent, this.rarity-1) * Math.pow(exponential, this.rarity-1)
        this.stats.damage *= Math.pow(mainExponent, this.rarity-1) * Math.pow(exponential, this.rarity-1)
        this.stats.armor *= Math.pow(mainExponent, this.rarity-1) * Math.pow(exponential, this.rarity-1)

        
        this.stats.health = Math.round(this.stats.health)
        this.stats.damage = Math.round(this.stats.damage)
        this.stats.armor = Math.round(this.stats.armor)
    }
    update() {
        this.angle += this.spin
        this.targetX = this.host.x + this.host.petalOrbitDistance 
        * Math.cos(this.host.globalAngle + 
        degreesToRads((360 / this.host.equippedPetals.length) * (this.id)))
        
        this.targetY = this.host.y + this.host.petalOrbitDistance 
        * Math.sin(this.host.globalAngle + 
        degreesToRads((360 / this.host.equippedPetals.length) * (this.id)))
        
        let angle = Math.atan2(this.targetY - this.y, this.targetX - this.x)
        
        this.velocity.x += 0.5 * Math.log(this.dist(this.targetX, this.x, this.targetY, this.y)) * Math.cos(angle)
        this.velocity.y += 0.5 * Math.log(this.dist(this.targetX, this.x, this.targetY, this.y)) * Math.sin(angle)

        this.x += this.velocity.x
        this.y += this.velocity.y
        this.velocity.y *= frictionMultiplier
        this.velocity.x *= frictionMultiplier
    }
    draw() {
        if (this.showRarity) {
            ctx.beginPath()
            ctx.globalAlpha = 0.5
            let rarityName = rarities[this.rarity-1][0]
            ctx.fillStyle = rarities[this.rarity-1][1]
            ctx.arc(this.x, this.y, this.stats.size*2, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.stats.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.stats.size*1.5)
            ctx.closePath()
        }
        // This is a placeholder petal drawing.
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(this.x, this.y, this.stats.size, 0, Math.PI * 2);
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
    drawOnBox(box) {
        let boxSize = box.boxSize
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(box.x + boxSize/2, box.y + boxSize/2 - 10, 15 * (boxSize/85), 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke()
        ctx.closePath();
        
        
        ctx.lineWidth = 4
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = "18px Arial"
        ctx.lineJoin = "round"
        ctx.textAlign = "center"
        ctx.strokeText(`${this.altName}`, box.x + box.boxSize/2, box.y + box.boxSize/1.25)
        ctx.fillText(`${this.altName}`, box.x + box.boxSize/2, box.y + box.boxSize/1.25)
    }
}