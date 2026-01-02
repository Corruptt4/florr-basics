import { canvas, ctx } from "../main.js"

export class Camera {
    constructor(player) {
        this.player = player
        this.x = 0
        this.y = 0
        this.x2 = player.x
        this.y2 = player.y
        this.player = player
        this.zoom = 1
    }
    moveTo() {
        this.x2 = this.player.x
        this.y2 = this.player.y
        this.x += (this.x2 - this.x) * 0.15
        this.y += (this.y2 - this.y) * 0.15
    }
    apply() {
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.scale(this.zoom, this.zoom)
        ctx.translate(-this.x, -this.y)
    }
}