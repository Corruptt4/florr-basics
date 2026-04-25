import { ctx, canvas } from "../../main.js"
import { darkenRGB } from "../../SCRIPTS/functions.js";

export class Projectile {
    constructor(x, y, size, host, stats = {
        health: 100,
        damage: 10
    }) {
        this.x = x;
        this.y = y;
        this.stats = stats;
        this.size = size;
        this.angle = 0;
        this.color = "rgb(55, 55, 55)"
        this.host = host
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color, 0)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
}