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
        this.mass = 10;
        this.petalsOrbiting = []
        this.damageTick = 0
        this.equippedPetals = []
        this.speed = 0.2
        this.type = "player"
        this.push = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    innitPetals() {
        // Set petals to just nulls.
        for (let i = 0, n = 10; i < n; i++) {
            this.equippedPetals.push(
                {
                    id: i+1,
                    petal: null,
                    offset: (360 / n) * i,
                    rarity: 8
                }
            )
        }
        this.equippedPetals.forEach((p) => {
            if (!this.petalsOrbiting.includes(p) && p.type != "PlaceholderPetal") {
                this.petalsOrbiting.push([p.id, p.petal])
            }
        })
    }
    draw() {
        // Just draw the petals if they're NOT null.
        this.equippedPetals.forEach((petal) => {
            if (petal.petal != null && petal.petal.type != "PlaceholderPetal") {
                petal.petal.host = this
                if (!petal.petal.dead) petal.petal.draw();
                petal.petal.showRarity = this.showPetalRarity
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
        this.petalsOrbiting = []
        this.equippedPetals.forEach((p) => {
            if (p.petal != null && p.petal.type != "PlaceholderPetal") {
                this.petalsOrbiting.push(p.petal)
            }
        })
        this.petalsOrbiting.forEach((p, index) => {
            p.id = index+1
        })
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
        if (this.petalsOrbiting.length > 0) {
            this.petalsOrbiting.forEach((p) => {
                p.host = this
                p.reloadPetal()
                if (p.isSummoner) p.summon();
            })
        }

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

        this.x += this.push.x / this.mass
        this.y += this.push.y / this.mass 
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.push.x *= frictionMultiplier
        this.push.y *= frictionMultiplier
        this.velocity.x *= frictionMultiplier
        this.velocity.y *= frictionMultiplier
    }
}