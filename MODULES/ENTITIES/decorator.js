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
        this.gridSize = 75
        this.boundarySize = 15000
        this.decorColor = decorColor
        this.sizes = {
            minSize: minSize,
            maxSize: maxSize
        }
    }
    makeBoundaries() {
        ctx.beginPath()
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.fillRect(0, -this.boundarySize, this.mapSize, this.boundarySize)
        ctx.fillRect(-this.boundarySize, -this.boundarySize, this.boundarySize, this.boundarySize*3)
        ctx.fillRect(0, this.mapSize, this.boundarySize, this.boundarySize)
        ctx.fillRect(this.mapSize, -this.boundarySize, this.boundarySize, this.boundarySize+this.mapSize)
        ctx.closePath()
    }
    makeGrid() {
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
        // x lines
        for (let i = -this.mapSize; i < this.mapSize*2-this.gridSize; i+=this.gridSize) {
            ctx.moveTo(i, -this.mapSize)
            ctx.lineTo(i, this.mapSize*2)
        }
        
        // y lines
        for (let i = -this.mapSize; i < this.mapSize*2-this.gridSize; i+=this.gridSize) {
            ctx.moveTo(-this.mapSize, i)
            ctx.lineTo(this.mapSize*2, i)
        }
        ctx.stroke()
        ctx.closePath()
    }
}