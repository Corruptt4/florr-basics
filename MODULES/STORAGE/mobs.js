import { Mob } from "../ENTITIES/mob.js";
import { ctx, rarities } from "../../main.js";
import { darkenRGB, degreesToRads } from "../../SCRIPTS/functions.js";

// x, y, rarity, health, damage, size

class BabyAnt extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.color = "rgb(80, 80, 80)"
    }
}

class Sandstorm extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.name = "Sandstorm"
        this.rarities = rarities
        this.sandstormMovement = true;
        this.shape = 6
        this.actualSpeed = 0.3
        this.isSandstorm = true;
        this.color = "rgb(212,199,167)"
    }
    draw() {
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.translate(this.x, this.y)
            let size = this.size / [1, 1.4, 2.5][i]
            ctx.beginPath();
            ctx.rotate(0.6*[1,1.2,1.4][i]*this.t*[-1,1,-1][i])
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

class Beetle extends Mob {
    constructor(x, y, rarity, health, damage, size) {
        super(x, y, rarity, health, damage, size)
        this.chasesPlayers = true
        this.name = "Beetle"
        this.rarities = rarities
        this.chasesMobs = true
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
    new Sandstorm(0, 0, 1, 350, 8, 40)
]