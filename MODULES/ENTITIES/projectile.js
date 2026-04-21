import { ctx, canvas } from "../../main.js"

export class Projectile {
    constructor(x, y, size, stats = {
        health: 100,
        damage: 10
    }) {
        this.x = x;
        this.y = y;
        this.stats = stats;
        this.size = size;
    }
}