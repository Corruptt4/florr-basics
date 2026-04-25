import { Projectile } from "../ENTITIES/projectile.js"

class HornetMissile extends Projectile {
    constructor(x, y, size, host, stats) {
        super(x, y, size, host, stats)
        this.color = "rgb(50, 50, 50)"
    }

    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.strokeStyle = this.color
        ctx.fillStyle = this.size/6
        ctx.lineJoin = "round"
        ctx.moveTo(this.size/2, 0)
        ctx.lineTo(-this.size, this.size/8)
        ctx.lineTo(-this.size, -this.size/8)
        ctx.lineTo(this.size/2, 0)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
}

export var projectiles = [
    new HornetMissile(0, 0, 15, null, {
        health: 100,
        damage: 15
    })
]