import { ctx, frictionMultiplier, mapSize, rarities } from "../../main.js";
import { darkenRGB } from "../../SCRIPTS/functions.js";

export class Player {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.globalAngle = 0;
        this.petalSpeed = 0.05;
        this.petalOrbitDistance = 60;
        this.extraRange = 30
        this.defending = false
        this.attacking = false;
        this.showPetalRarity = false;
        this.keyDown = [];
        this.equippedPetals = []
        this.speed = 0.2
        this.type = "player"
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    innitPetals() {
        // Set petals to just nulls.
        for (let i = 0, n = 1; i < n; i++) {
            this.equippedPetals.push(
                {
                    id: i+1,
                    petal: null,
                    offset: (360 / n) * i,
                    rarity: 10
                }
            )
        }
    }
    draw() {
        // Just draw the petals if they're NOT null.
        this.equippedPetals.forEach((petal) => {
            if (petal.petal != null) {
                if (!petal.petal.dead) petal.petal.draw();
                petal.petal.showRarity = this.showPetalRarity
            }
            if (petal.petal.id == null) {
                petal.petal.id = petal.id
                petal.petal.orbitoffset = petal.offset
            }
        })

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = darkenRGB(this.color, 20);
        ctx.lineWidth = 4
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    update() {
        if (this.x - this.size < 0) {
            this.velocity.x += 1
        }
        if (this.x + this.size > mapSize) {
            this.velocity.x -= 1
        }
        if (this.y - this.size < 0) {
            this.velocity.y += 1
        }
        if (this.y + this.size > mapSize) {
            this.velocity.y -= 1
        }
        this.equippedPetals.forEach((p) => {
            p.petal.reloadPetal()
        })

        /** Key codes */
        // right 39, 68
        // left 37, 65
        // up 83, 40
        // down 38, 87
        // attack 32 || defend 16
        // show petal rarities 71

        this.globalAngle += this.petalSpeed

        if (this.attacking) {
            this.petalOrbitDistance = 60 + this.extraRange
        }

        if (this.defending && !this.attacking) {
            this.petalOrbitDistance = 40
        }
        if (!this.attacking && !this.defending) {
            this.petalOrbitDistance = 60
        }

        if (this.keyDown[39] || this.keyDown[68]) {
            this.velocity.x += this.speed
        }
        
        if (this.keyDown[37] || this.keyDown[65]) {
            this.velocity.x -= this.speed
        }
        
        if (this.keyDown[40] || this.keyDown[83]) {
            this.velocity.y += this.speed
        }
        
        if (this.keyDown[38] || this.keyDown[87]) {
            this.velocity.y -= this.speed
        }

        if (this.keyDown[32]) {
            this.attacking = true
        }
         if (!this.keyDown[32]) {
            this.attacking = false
        }
        if (this.keyDown[16]) {
            this.defending = true
        }
        if (!this.keyDown[16]) {
            this.defending = false
        }

        if (this.keyDown[71]) {
            this.showPetalRarity = true
        }
        if (!this.keyDown[71]) {
            this.showPetalRarity = false
        }

        this.x += this.velocity.x
        this.y += this.velocity.y

        this.velocity.x *= frictionMultiplier
        this.velocity.y *= frictionMultiplier
    }
}