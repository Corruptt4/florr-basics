import { Mob } from "../ENTITIES/mob.js";
import { ctx, rarities } from "../../main.js";
import { darkenRGB, degreesToRads } from "../../SCRIPTS/functions.js";

// x, y, rarity, health, damage, size

class BabyAnt extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.color = "rgb(80, 80, 80)"
        this.description = "Weak and defenseless, with dreams."
        this.mass = 20
    }
}

class SoldierAnt extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.name = "Soldier Ant",
        this.description = "It's ready to use its wings to protect the queen!"
        this.rarities = rarities
        this.speed = 0.18
        this.mass = 35
        this.boxOffsetX = 2.5
        this.boxOffsetY = -2.5
        this.chasesMobs = true
        this.chasesPlayers = true
        this.color = "rgb(80, 80, 80)"
    }
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.rotate(this.angle+(Math.sin(this.t) * (Math.PI / 40)))
        ctx.moveTo(this.size/2, this.size/1.7)
        ctx.lineTo(this.size*1.35, this.size/2.5)
        ctx.lineTo(this.size/2, this.size/1.7)
        ctx.lineWidth = this.size/4
        ctx.lineJoin = "round"
        ctx.strokeStyle = "rgb(25, 25, 25)"
        ctx.fillStyle = "rgb(25, 25, 25)"
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        ctx.restore()

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.rotate(this.angle-((Math.PI / 40)*Math.sin(this.t)))
        ctx.lineWidth = this.size/4
        ctx.lineJoin = "round"
        ctx.strokeStyle = "rgb(25, 25, 25)"
        ctx.fillStyle = "rgb(25, 25, 25)"
        ctx.moveTo(this.size/2, -this.size/1.7)
        ctx.lineTo(this.size*1.35, -this.size/2.5)
        ctx.lineTo(this.size/2, -this.size/1.7)
        
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        ctx.restore()


        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath()
        ctx.lineWidth = this.size/4
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color, 20)
        ctx.arc(-this.size, 0, this.size/1.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.rotate(this.angle+(Math.sin(this.t) * (Math.PI / 40)))
        ctx.ellipse(-this.size, -this.size/1.7, this.size/1.3, this.size/2.5, degreesToRads(10), 0, Math.PI*2)
        ctx.lineWidth = this.size/4
        ctx.lineJoin = "round"
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.fill()
        ctx.closePath()
        ctx.restore()
        

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.beginPath()
        ctx.rotate(this.angle-(Math.sin(this.t) * (Math.PI / 40)))
        ctx.ellipse(-this.size, this.size/1.7, this.size/1.3, this.size/2.5, -degreesToRads(10), 0, Math.PI*2)
        ctx.lineWidth = this.size/4
        ctx.lineJoin = "round"
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.fill()
        ctx.closePath()
        ctx.restore()

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath()
        ctx.lineWidth = this.size/4
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color, 20)
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
}


class Sandstorm extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.name = "Sandstorm"
        this.description = "This storm is random... Maybe go away from it"
        this.rarities = rarities
        this.sandstormMovement = true;
        this.shape = 6
        this.sizeMulti = 1.5
        this.boxExtraRotation = 20
        this.mass = 50
        this.actualSpeed = 0.25
        this.isSandstorm = true;
        this.color = "rgb(212,199,167)"
    }
    draw() {
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.translate(this.x, this.y)
            let size = this.size / [1, 1.4, 2.5][i]
            ctx.beginPath();
            if (!this.isSandstorm) {
                ctx.rotate(this.angle + this.boxExtraRotation)
            } else {
                ctx.rotate(0.6*[1,1.2,1.4][i]*this.t*[-1,1,-1][i])
            }
            ctx.fillStyle = darkenRGB(this.color, 0 + (20*i))
            ctx.strokeStyle = darkenRGB(this.color, 0 + (20*i))
            ctx.lineWidth = size / 3 / [1, 1.4, 2.5][i]
            ctx.lineJoin = "round"
            ctx.moveTo(size * Math.cos(0), size*Math.sin(0))
            for (let i = 0; i < this.shape+1.2; i++) {
                ctx.lineTo(
                    size * Math.cos(degreesToRads((360 / this.shape)*i)),
                    size * Math.sin(degreesToRads((360 / this.shape)*i))
                )
            }
            ctx.fill()
            ctx.stroke()
            ctx.closePath();
            ctx.restore();
        }
    }
}

class Rock extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.name = "Rock"
        this.description = "The Rock."
        this.rarities = rarities
        this.shape = 15 + Math.floor(Math.random() * 10)
        this.speed = 0
        this.sizeMulti = 1.5
        this.rock = true;
        this.sizeVariation = true
        this.mass = 70
        this.variationSides = true;
        this.color = "rgb(110, 110, 110)"
    }
    draw() {
        this.varieties[this.shape-1] = 1
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.lineJoin = "round"
        ctx.strokeStyle = darkenRGB(this.color, 20)
        ctx.moveTo(this.size*Math.cos(0), this.size*Math.sin(0))
        for (let i = 0; i <= this.shape; i++) {
            ctx.lineTo(
                this.size*this.varieties[i]*Math.cos(((Math.PI * 2)/this.shape) * i),
                this.size*this.varieties[i]*Math.sin(((Math.PI * 2)/this.shape) * i)
            )
        }
        ctx.lineWidth = this.size/6
        ctx.lineTo(this.size*Math.cos(0), this.size*Math.sin(0))
        ctx.lineTo(
            this.size*Math.cos(((Math.PI * 2)/this.shape) * 1), 
            this.size*this.varieties[1]*Math.sin(((Math.PI * 2)/this.shape) * 1)
        )
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
}

class Bubble extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.name = "Bubble"
        this.description = "Pop!"
        this.rarities = rarities
        this.speed = 0
        this.sizeMulti = 1.6
        this.bubbleBurst = {
            power: 25,
            damageMulti: 5,
            burstRange: 15
        }
        this.sizeVariation = true
        this.mass = 9
        this.color = "rgba(255, 255, 255, 0.4)"
    }
    draw() {
        this.varieties[this.shape-1] = 1
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.strokeStyle = "rgb(225, 225, 225)"

        ctx.arc(0, 0, this.size, 0, Math.PI*2)
        ctx.lineWidth = this.size/10
        
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
        ctx.arc(-3*(this.size/10), -3*(this.size/10), this.size/3, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()

        ctx.restore()
    }
}

class Beetle extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.chasesPlayers = true
        this.description = "It's hungry for flowers, but why flowers instead of insects?"
        this.name = "Beetle"
        this.rarities = rarities
        this.boxOffsetX = -2.5
        this.boxOffsetY = 2.5
        this.sizeMulti = 1.4
        this.chasesMobs = true
        this.mass = 40
        this.color = "rgb(138,90,170)"
    }
    draw() {
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle+(Math.PI / 40) * Math.sin(this.t)-Math.PI/30)
        ctx.moveTo(this.size/2, this.size/1.7)
        ctx.quadraticCurveTo(this.size*1.3, this.size/1.1, this.size*1.7, this.size/2)
        ctx.quadraticCurveTo(this.size*1.3, this.size/1.3, this.size/1.7, this.size/4)

        ctx.lineJoin = "round"
        ctx.fillStyle = "rgb(35, 35, 35)"
        ctx.strokeStyle = "rgb(35, 35, 35)"
        ctx.lineWidth = this.size / 10;
        ctx.fill()
        ctx.stroke()
        ctx.restore();

        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle-(Math.PI / 40) * Math.sin(this.t)+Math.PI/30)
        ctx.moveTo(this.size/2, -this.size/1.7)
        ctx.quadraticCurveTo(this.size*1.3, -this.size/1.1, this.size*1.7, -this.size/2)
        ctx.quadraticCurveTo(this.size*1.3, -this.size/1.3, this.size/1.7, -this.size/4)
        ctx.lineJoin = "round"
        ctx.fillStyle = "rgb(35, 35, 35)"
        ctx.strokeStyle = "rgb(35, 35, 35)"
        ctx.lineWidth = this.size / 7;
        ctx.fill()
        ctx.stroke()
        ctx.restore();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color, 20)
        // Body
        ctx.moveTo(this.size, 0)
        ctx.quadraticCurveTo(this.size, this.size/2, this.size/1.5, this.size/1.5)
        ctx.quadraticCurveTo(0, this.size*0.87, -this.size/1.7, this.size/1.5)
        ctx.quadraticCurveTo(-this.size, this.size/2, -this.size, 0)
        ctx.quadraticCurveTo(-this.size, -this.size/2, -this.size/1.7, -this.size/1.5)
        ctx.quadraticCurveTo(0, -this.size*0.87, this.size/1.7, -this.size/1.5)
        ctx.quadraticCurveTo(this.size, -this.size/2, this.size, 0)

        ctx.lineJoin = "round"
        ctx.fill();
        ctx.lineWidth = this.size / 7;
        ctx.moveTo(-this.size/1.7, 0)
        ctx.quadraticCurveTo(0, this.size/10, this.size/1.7, 0)
        ctx.quadraticCurveTo(0, this.size/10, -this.size/1.7, 0)
        ctx.quadraticCurveTo(0, this.size/10, this.size/1.7, 0)
        ctx.stroke();
        ctx.closePath();
        
        let x = [-this.size/2.2, 0, this.size/2.2]
        let y = [this.size/3.2, this.size/2.8, this.size/3.2, -this.size/3.2, -this.size/2.8, -this.size/3.2]
        for (let i = 0; i < 3; i++) {
            ctx.beginPath()
            ctx.lineWidth = this.size/12;
            ctx.arc(x[i], y[i], ctx.lineWidth, 0, Math.PI * 2)
            ctx.arc(x[i], y[i], ctx.lineWidth/2, 0, Math.PI * 2)
            ctx.stroke()
            ctx.closePath()
        }
        for (let i = 0; i < 3; i++) {
            ctx.beginPath()
            ctx.lineWidth = this.size/12;
            ctx.arc(x[i], y[3+i], ctx.lineWidth, 0, Math.PI * 2)
            ctx.arc(x[i], y[3+i], ctx.lineWidth/2, 0, Math.PI * 2)
            ctx.stroke()
            ctx.closePath()
        }
        ctx.closePath();
        ctx.restore();
    }
}


export let availableMobs = [
    new BabyAnt(0, 0, 1, 85, 3, 15),
    new Beetle(0, 0, 1, 250, 6, 35),
    new Sandstorm(0, 0, 1, 350, 8, 40),
    new SoldierAnt(0, 0, 1, 180, 3, 18),
    new Rock(0, 0, 1, 225, 3, 25),
    new Bubble(0, 0, 1, 0.2, 3, 30)
]