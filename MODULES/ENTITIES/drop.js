import { ctx, rarities, drops, mapSize } from "../../main.js"
import { darkenRGB, degreesToRads } from "../../SCRIPTS/functions.js";
import { availablePetals } from "../STORAGE/petals.js";

export class Drop {
    constructor(x, y, petal, amount = 1) {
        this.x = x;
        this.y = y;
        this.petal = petal;
        this.type = "drop"
        this.rarities = rarities;
        this.rarity = 12
        this.boxSize = 55
        this.boxRotation = 0
        this.t = 0
        this.collected = false;
        this.lifetime = 1200
        this.size = this.boxSize-20
        this.amount = amount;
    }
    update() {
        this.x = Math.min(Math.max(this.x, this.boxSize/2), mapSize-this.boxSize/2)
        this.y = Math.min(Math.max(this.y, this.boxSize/2), mapSize-this.boxSize/2)
        this.t += 0.01
        this.lifetime--
        if (this.lifetime <= 0) {
            drops.splice(drops.indexOf(this), 1)
        }
    }
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y-2)
        ctx.beginPath()
        ctx.lineWidth = 4
        ctx.fillStyle = this.rarities[this.rarity-1][1]
        ctx.strokeStyle = darkenRGB(this.rarities[this.rarity-1][1], 25)
        ctx.roundRect(
            -this.boxSize/2-(Math.sin(this.t)*(this.boxSize/30))/2, 
            -this.boxSize/2-(Math.sin(this.t)*(this.boxSize/30))/2, 
            this.boxSize+(Math.sin(this.t)*(this.boxSize/30)), 
            this.boxSize+(Math.sin(this.t)*(this.boxSize/30)), 
            this.boxSize/10
        )
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
        if (this.amount > 1) {
            ctx.save()
            ctx.translate(this.x+this.boxSize/2-5+(Math.sin(this.t)*(this.boxSize/30))/2, this.y-2-this.boxSize/2+5-(Math.sin(this.t)*(this.boxSize/30))/2)
            ctx.rotate(degreesToRads(20))
            ctx.beginPath()
            ctx.lineJoin = "round"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.lineWidth = 4
            ctx.font =  `${14+(Math.sin(this.t)*(14/30))}px Arial`
            ctx.textAlign = "center"
            ctx.strokeText("x"+this.amount, 0, 0)
            ctx.fillText("x"+this.amount, 0, 0)
            ctx.closePath()
            ctx.restore()
        }
        this.petal.makeSides()
        this.petal.drawOnBox(this, 11, 12, this.boxSize/2)
    }
}