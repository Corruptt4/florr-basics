import { Petal } from "../ENTITIES/petal.js";
import { ctx, rarities } from "../../main.js";
import { darkenRGB } from "../../SCRIPTS/functions.js";

/**
 * STATS:
 * HEALTH
 * DAMAGE
 * SIZE
 * 
 *  constructor(host, stats = {
        health: 10,
        damage: 10,
        size: 8
    })
 */

class Basic extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Basic"
        this.altName = "Basic"
        this.stats.armor = 0
    }
}
class Bacteria extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Bacteria"
        this.altName = "Bacteria"
        this.stats.size = 18
        this.maxReload = 87
        this.stats.health = 16
        this.stats.damage = 18
        this.stats.armor = 7
        this.description = "Infectious... It has a shell, stronger with rarity."
        this.color = "rgb(82, 255, 82)"
    }
    
    drawOnBox(box) {
        let size = 23
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.rotate(Math.PI/4)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.roundRect(-size/2, - size, size, size*2, size/1.5);
        ctx.fill()
        ctx.stroke()
        ctx.closePath();
        ctx.restore()
        ctx.beginPath();
        ctx.lineWidth = 4
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = "18px Arial"
        ctx.lineJoin = "round"
        ctx.textAlign = "center"
        ctx.strokeText(`${this.altName}`, box.x + box.boxSize/2, box.y + box.boxSize/1.25)
        ctx.fillText(`${this.altName}`, box.x + box.boxSize/2, box.y + box.boxSize/1.25)
        ctx.closePath()
    }
    draw() {
        if (this.showRarity) {
            ctx.beginPath()
            ctx.globalAlpha = 0.5
            let rarityName = rarities[this.rarity-1][0]
            ctx.fillStyle = rarities[this.rarity-1][1]
            ctx.arc(this.x, this.y, this.stats.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.stats.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.stats.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.roundRect(-this.stats.size/2, -this.stats.size, this.stats.size, this.stats.size*2, this.stats.size/1.5)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
        
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
}
class Heavy extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Heavy"
        this.altName = "Heavy"
        this.stats.size = 18
        this.maxReload = 360
        this.stats.health = 45
        this.stats.damage = 12
        this.stats.armor = 0
        this.description = "This petal is pretty heavy, don't get in its way."
        this.color = "rgb(55, 55, 55)"
    }
    drawOnBox(box) {
        let boxSize = box.boxSize
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(box.x + boxSize/2, box.y + boxSize/2 - 10, 20 * (boxSize/85), 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke()
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.arc(box.x + boxSize/2 - 5, box.y + boxSize/2 - 10 - 5, 10 * (boxSize/85), 0, Math.PI * 2)
        ctx.fill()
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
    draw() {
        if (this.showRarity) {
            ctx.beginPath()
            ctx.globalAlpha = 0.5
            let rarityName = rarities[this.rarity-1][0]
            ctx.fillStyle = rarities[this.rarity-1][1]
            ctx.arc(this.x, this.y, this.stats.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.stats.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.stats.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(0, 0, this.stats.size, 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`
        ctx.arc(-this.stats.size/4, -this.stats.size/4, this.stats.size/2, 0, Math.PI * 2);
        ctx.fill()
        ctx.closePath()
        ctx.restore()
        
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
}

export var availablePetals = [
    new Heavy(null, {
        health: 45,
        damage: 12
    }),
    new Basic(null, {
        health: 10,
        damage: 10
    }),
    new Bacteria(null, {
        health: 15,
        damage: 17,
        armor: 7
    })
]