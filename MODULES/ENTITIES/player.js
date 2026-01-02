import { ctx } from "../../main.js";
import { darkenRGB } from "../../SCRIPTS/functions.js";

export class Player {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.keyDown = []
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 3
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    move() {
        // right 39, 68
        // left 37, 65
        // up 83, 40
        // down 38, 87

        if (this.keyDown[39] || this.keyDown[68]) {
            this.velocity.x += 0.5
        }
        
        if (this.keyDown[37] || this.keyDown[65]) {
            this.velocity.x -= 0.5
        }
        
        if (this.keyDown[40] || this.keyDown[83]) {
            this.velocity.y += 0.5
        }
        
        if (this.keyDown[38] || this.keyDown[87]) {
            this.velocity.y -= 0.5
        }

        this.x += this.velocity.x
        this.y += this.velocity.y

        this.velocity.x *= 0.94
        this.velocity.y *= 0.94
    }
}