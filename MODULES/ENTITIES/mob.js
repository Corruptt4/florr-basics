import { ctx } from "../../main.js";
import { abbreviate, darkenRGB, degreesToRads } from "../../SCRIPTS/functions.js";

export class Mob {
    constructor(x, y, rarity, health, damage) {
        this.x = x;
        this.y = y;
        this.rarity = rarity;
        this.health = health * Math.pow(3.5, rarity-1) * Math.pow(1.03, rarity-1);
        this.damage = damage * Math.pow(2.75, rarity-1) * Math.pow(1.17, rarity-1);
        this.angle = 0 
    }
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath()

        ctx.closePath()
        ctx.restore()
    }
}