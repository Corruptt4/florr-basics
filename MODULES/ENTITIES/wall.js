import { ctx } from "../../main.js"

export class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = "rgba(0, 0, 0, 0.3)"
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.roundRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h)
        ctx.fill()
        ctx.closePath()
    }
}