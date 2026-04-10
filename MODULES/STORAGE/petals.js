import { Petal } from "../ENTITIES/petal.js";
import { ctx, rarities } from "../../main.js";
import { darkenRGB } from "../../SCRIPTS/functions.js";
import { availableMobs } from "./mobs.js";

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
        this.stats.health = 6
        this.stats.damage = 6
    }
}
class Iris extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Iris"
        this.altName = "Iris"
        this.size = 8
        this.maxReload = 100
        this.stats.health = 8
        this.stats.damage = 5
        this.poison = {
            poison: 100,
            tick: 180
        }
        this.sizeMulti = 0.6
        this.stats.armor = 0
        this.description = "Poisonous. Takes some time to do its effect."
        this.color = "rgba(150, 0, 196, 1)"
    }
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(box.x + boxSize/2, box.y + boxSize/2 - 10, (size*this.sizeMulti) * (boxSize/85), 0, Math.PI * 2);
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
    draw() {
        if (this.showRarity) {
            ctx.beginPath()
            ctx.globalAlpha = 0.5
            let rarityName = rarities[this.rarity-1][0]
            ctx.fillStyle = rarities[this.rarity-1][1]
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
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
class Rock extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Rock"
        this.altName = "Rock"
        this.size = 12
        this.maxReload = 180
        this.stats.health = 25
        this.sides = 5
        this.stats.damage = 8
        this.sizeMulti = 0.95
        this.stats.armor = 0
        this.description = "Very durable."
        this.color = "rgb(110, 110, 110)"
    }
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.moveTo(size*this.sizeMulti*boxSize/85 * Math.cos(0), size*this.sizeMulti*boxSize/85 * Math.sin(0))
        for (let i = 0; i < this.sides; i++) {
            ctx.lineTo(
                size*this.sizeMulti*(boxSize/85) * Math.cos(((Math.PI * 2)/this.sides)*i),
                size*this.sizeMulti*(boxSize/85) * this.variations[i] * Math.sin(((Math.PI * 2)/this.sides)*i)
            )
        }
        ctx.lineTo(size*this.sizeMulti*boxSize/85 * Math.cos(0), size*this.sizeMulti*boxSize/85 * Math.sin(0))
        ctx.lineTo(
            size*this.sizeMulti*(boxSize/85) * Math.cos((Math.PI * 2)/this.sides),
            size*this.sizeMulti*(boxSize/85) * this.variations[0] * Math.sin((Math.PI * 2)/this.sides),
        )
        ctx.fill()
        ctx.stroke()
        ctx.closePath();
        ctx.restore()
        
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.moveTo(this.size * Math.cos(0), this.size * Math.sin(0))
        for (let i = 0; i < this.sides; i++) {
            ctx.lineTo(
                this.size * Math.cos(((Math.PI * 2)/this.sides)*i),
                this.size * this.variations[i] * Math.sin(((Math.PI * 2)/this.sides)*i)
            )
        }
        ctx.lineTo(this.size * Math.cos(0), this.size * Math.sin(0))
        ctx.lineTo(
            this.size * Math.cos((Math.PI * 2)/this.sides),
            this.size * this.variations[0] * Math.sin((Math.PI * 2)/this.sides),
        )
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
class BeetleEgg extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Beetle Egg"
        this.altName = "Egg"
        this.size = 18
        this.maxReload = 10
        this.stats.health = 150
        this.stats.damage = 0.01
        this.sizeMulti = 1.3
        this.lockedAngle = true
        this.isSummoner = true
        this.summoner = {
            type: 1,
            timer: 90,
            timer2: 90,
            killsPetal: true,
            scalesWithRarity: true,
            summonRarity: this.rarity-1,
            lowerRarity: 0,
            scalesPetal: true,
        }
        this.description = "Now comes with a Beetle summon!"
        this.color = "rgb(254,240,185)"
    }
    
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.ellipse(0, 0, (size*this.sizeMulti)/1.4, (size*this.sizeMulti), 0, 0, Math.PI * 2)
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.ellipse(0, 0, this.size/1.4, this.size, 0, 0, Math.PI * 2)
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
class AntEgg extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Ant Egg"
        this.altName = "Egg"
        this.size = 18
        this.maxReload = 10
        this.stats.health = 150
        this.stats.damage = 0.01
        this.sizeMulti = 1.1
        this.lockedAngle = true
        this.isSummoner = true
        this.summoner = {
            type: 3,
            timer: 60,
            timer2: 60,
            killsPetal: true,
            capacity: 3,
            scalesWithRarity: true,
            summonRarity: this.rarity-1,
            lowerRarity: 0,
            scalesPetal: true,
        }
        this.description = "Ants hatch out? But why isn't it a larvae?"
        this.color = "rgb(254,240,185)"
    }
    
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.ellipse(0, 0, (size*this.sizeMulti), (size*this.sizeMulti), 0, 0, Math.PI * 2)
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.ellipse(0, 0, this.size, this.size, 0, 0, Math.PI * 2)
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
class DryStick extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Dry Stick"
        this.altName = "Stick"
        this.size = 10
        this.maxReload = 90
        this.stats.health = 400
        this.stats.damage = 0.1
        this.sizeMulti = 0.6
        this.lockedAngle = false
        this.isSummoner = true
        this.summoner = {
            type: 2,
            timer: 60,
            timer2: 70,
            killsPetal: false,
            scalesWithRarity: true,
            summonRarity: this.rarity-2,
            capacity: 5,
            scalesPetal: false,
            lowerRarity: 1
        }
        this.description = "It lost its moisture, but what if you spin this one in sand?"
        this.color = "rgb(114,81,20)"
    }
    
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.beginPath();
        ctx.lineJoin = "round"
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 8
        ctx.moveTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.fill()
        ctx.stroke()
        ctx.closePath();

        ctx.beginPath();
        ctx.lineJoin = "round"
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4
        ctx.moveTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 8
        ctx.lineJoin = "round"
        ctx.moveTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4
        ctx.lineJoin = "round"
        ctx.moveTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
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
class Stick extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Mysterious Stick"
        this.altName = "Stick"
        this.size = 12
        this.maxReload = 90
        this.stats.health = 400
        this.stats.damage = 0.1
        this.sizeMulti = 0.8
        this.lockedAngle = false
        this.isSummoner = true
        this.summoner = {
            type: 2,
            timer: 80,
            timer2: 80,
            killsPetal: false,
            scalesWithRarity: true,
            summonRarity: this.rarity-1,
            capacity: 2,
            scalesPetal: false,
            lowerRarity: 0
        }
        this.description = "What if you spin this in sand... Nothing, right?"
        this.color = "rgb(124,91,30)"
    }
    
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.beginPath();
        ctx.lineJoin = "round"
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 8
        ctx.moveTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.fill()
        ctx.stroke()
        ctx.closePath();

        ctx.beginPath();
        ctx.lineJoin = "round"
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4
        ctx.moveTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 8
        ctx.lineJoin = "round"
        ctx.moveTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4
        ctx.lineJoin = "round"
        ctx.moveTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
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
class Bubble extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Bubble"
        this.altName = "Bubble"
        this.size = 12
        this.maxReload = 10
        this.stats.health = 1
        this.stats.damage = 0.1
        this.sizeMulti = 1
        this.lockedAngle = false
        this.isSummoner = true
        this.summoner = {
            type: 5,
            timer: 10,
            timer2: 10,
            killsPetal: true,
            scalesWithRarity: false,
            summonRarity: this.rarity-1,
            capacity: 1,
            snapToPlayer: true,
            scalesPetal: false,
            lowerRarity: -1
        }
        this.description = "Pops easily, but summons a bubble summon... Some say your bubble is blessed."
        this.color = "rgb(0,0,0)"
        this.actualColor = "rgb(255,255,255)"
        this.fillColor = "rgba(255,255,255,0.5)"
        this.shineColor = "rgba(255,255,255,0.4)"
    }
    
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.actualColor;
        ctx.lineWidth = 3
        ctx.lineJoin = "round"
        ctx.arc(0, 0, size*this.sizeMulti, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = 4
        ctx.lineJoin = "round"
        ctx.arc(size*this.sizeMulti/4, size*this.sizeMulti/3.5, size*this.sizeMulti/3, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.actualColor;
        ctx.lineWidth = 3
        ctx.lineJoin = "round"
        ctx.arc(0, 0, this.size, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = 4
        ctx.lineJoin = "round"
        ctx.arc(this.size/4, this.size/3.5, this.size/3, 0, Math.PI*2)
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
class MagicStick extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Magic Stick"
        this.altName = "Stick"
        this.size = 12
        this.maxReload = 90
        this.stats.health = 400
        this.stats.damage = 0.1
        this.sizeMulti = 0.8
        this.lockedAngle = false
        this.isSummoner = true
        this.summoner = {
            type: 2,
            timer: 25,
            timer2: 25,
            killsPetal: false,
            scalesWithRarity: true,
            summonRarity: this.rarity-1,
            capacity: 20,
            scalesPetal: false,
            lowerRarity: 1
        }
        this.description = "Summons the forces of the wind, through magic."
        this.color = "rgb(0, 143, 238)"
    }
    
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.beginPath();
        ctx.lineJoin = "round"
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 8
        ctx.moveTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.fill()
        ctx.stroke()
        ctx.closePath();

        ctx.beginPath();
        ctx.lineJoin = "round"
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4
        ctx.moveTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(-size/2 * this.sizeMulti, size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-size * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
        ctx.lineTo(size*1.2 * this.sizeMulti, -size/1 * this.sizeMulti)
        ctx.lineTo(0, 0)
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 8
        ctx.lineJoin = "round"
        ctx.moveTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4
        ctx.lineJoin = "round"
        ctx.moveTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(-this.size/2, this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0-this.size)
        ctx.lineTo(0, 0)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
        ctx.lineTo(this.size*1.2, -this.size/1)
        ctx.lineTo(0, 0)
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
class Bacteria extends Petal {
    constructor(host, stats) {
        super(host, stats)
        this.name = "Bacteria"
        this.altName = "Bacteria"
        this.size = 18
        this.maxReload = 120
        this.stats.health = 12
        this.stats.damage = 10
        this.stats.armor = 0.5
        this.sizeMulti = 1.2
        this.description = "Infectious... It has a shell, stronger with rarity."
        this.color = "rgb(82, 255, 82)"
    }
    
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.save()
        ctx.translate(box.x + boxSize / 2, box.y + boxSize/2 - 10)
        ctx.rotate(Math.PI/4)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.roundRect(-(size*this.sizeMulti)/2, - (size*this.sizeMulti), (size*this.sizeMulti), (size*this.sizeMulti)*2, (size*this.sizeMulti)/1.5);
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.roundRect(-this.size/2, -this.size, this.size, this.size*2, this.size/1.5)
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
        this.size = 18
        this.maxReload = 360
        this.stats.health = 45
        this.stats.damage = 12
        this.sizeMulti = 1.2
        this.stats.armor = 0
        this.description = "This petal is pretty heavy, don't get in its way."
        this.color = "rgb(55, 55, 55)"
    }
    drawOnBox(box, size) {
        let boxSize = box.boxSize
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(box.x + boxSize/2, box.y + boxSize/2 - 10, (size*this.sizeMulti) * (boxSize/85), 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke()
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.arc(box.x + boxSize/2 - 5, box.y + boxSize/2 - 10 - 5, ((size/2)*this.sizeMulti) * (boxSize/85), 0, Math.PI * 2)
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
            ctx.arc(this.x, this.y, this.size*1.6, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.lineWidth = 2
            ctx.font = "20px Arial"
            ctx.textAlign = "center"
            ctx.strokeText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.fillText(rarityName, this.x, this.y-20/3 - this.size*1.5)
            ctx.closePath()
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`
        ctx.arc(-this.size/4, -this.size/4, this.size/2, 0, Math.PI * 2);
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
    new Basic(null, {
        health: 10,
        damage: 10
    }),
    new Heavy(null, {
        health: 45,
        damage: 12
    }),
    new Iris(null, {
        health: 15,
        damage: 17,
        armor: 7
    }),
    new Bacteria(null, {
        health: 15,
        damage: 17,
        armor: 7
    }),
    new BeetleEgg(null, {
        health: 100,
        damage: 1,
        armor: 0
    }),
    new Stick(null, {
        health: 100,
        damage: 1,
        armor: 0
    }),
    new DryStick(null, {
        health: 100,
        damage: 1,
        armor: 0
    }),
    new MagicStick(null, {
        health: 100,
        damage: 1,
        armor: 0
    }),
    new AntEgg(null, {
        health: 100,
        damage: 1,
        armor: 0
    }),
    new Rock(null, {
        health: 100,
        damage: 1,
        armor: 0
    }),
    new Bubble(null, {
        health: 100,
        damage: 1,
        armor: 0
    })
]