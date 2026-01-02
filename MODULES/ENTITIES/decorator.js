import { ctx, mapSize } from "../../main.js"
import { darkenRGB } from "../../SCRIPTS/functions.js";

export class Decoration {
    constructor(x, y, size, sides, color, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.sides = sides;
        this.type = type;
        this.color = color
    }
    
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 15)
        ctx.lineWidth = this.size/5
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}


export class Decorator {
    constructor(amount, mapSize, decorColor, minSize, maxSize) {
        this.amount = amount;
        this.mapSize = mapSize;
        this.decorColor = decorColor
        this.sizes = {
            minSize: minSize,
            maxSize: maxSize
        }
    }
    createDecoration(decorArray) {
        for (let i = 0; i < this.amount; i++) {
            let decor = new Decoration(
                Math.random() * this.mapSize, 
                Math.random() * this.mapSize, 
                this.sizes.minSize + Math.random()*(this.sizes.maxSize - this.sizes.minSize),
                6,
                this.decorColor,
                1
            )
            decorArray.push(decor)
        }
    }
}