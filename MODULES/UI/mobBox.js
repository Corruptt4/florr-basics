import { ctx, canvas, mobs, rarities } from "../../main.js"
import { abbreviate, darkenRGB, degreesToRads } from "../../SCRIPTS/functions.js"
import { availableMobs } from "../STORAGE/mobs.js";

export class MobBox {
    /**
     * 
     * x, y, rarity, health, damage, size
     */
    constructor(x, y, l, mob) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.l = l;
        this.mob = mob;
        this.rarity = mob.rarity;
        this.mobName = mob.name // this is used to sort mobs and know which mobs to sort with rarity.
        this.clone = null
        this.amount = 1;
        this.hovered = false;
        this.drawable = true;
        this.shape = mob.shape
        this.varieties = []
    }
    innitClone() {
        this.clone = new this.mob.constructor(this.x, this.y, this.mob.rarity, this.mob.health, this.mob.damage, 25)
        this.clone.sizeVaries = false
        this.clone.isSandstorm = false
        this.clone.rock = true
        this.clone.shape = this.shape
        this.clone.innitMob()
        this.clone.color = this.mob.color
        this.clone.varieties = this.varieties
        this.clone.size = (this.l/5) * (this.mob.sizeMulti ?? 1)
    }
    drawStatBox() {
        ctx.save()        
        let tabWidth = 500
        let tabHeight = 300
        ctx.translate(Math.max(this.x-tabWidth/2.5-this.l, 10), Math.min(this.y+this.l/1.5, canvas.height-10))
        ctx.beginPath()
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.strokeStyle = "rgba(0, 0, 0, 1)"
        ctx.roundRect(0, 0, tabWidth, tabHeight, tabHeight/20)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.fillStyle = "white"
        ctx.strokeStyle =  "black"
        ctx.font = "35px Arial"
        ctx.textAlign = "left"
        ctx.strokeText(this.clone.name, 15, 35)
        ctx.fillText(this.clone.name, 15, 35)
        ctx.font = "15px Arial"
        ctx.strokeText(this.mob.description, 15, 95)
        ctx.fillText(this.mob.description, 15, 95)
        
        ctx.fillStyle = rarities[this.rarity-1][1]
        ctx.strokeStyle = darkenRGB(rarities[this.rarity-1][1], 35)
        ctx.font = "20px Arial"
        ctx.textAlign = "left"
        ctx.strokeText(rarities[this.rarity-1][0], 15, 60)
        ctx.fillText(rarities[this.rarity-1][0], 15, 60)

        if (this.amount > 1) {
            ctx.fillStyle = "white"
            ctx.strokeStyle =  "black"
            ctx.font = "30px Arial"
            ctx.textAlign = "right"
            ctx.strokeText("x"+this.amount, tabWidth-20, 35)
            ctx.fillText("x"+this.amount, tabWidth-20, 35)
        }

        if (this.mob.pet) {
            ctx.fillStyle = "cyan"
            ctx.strokeStyle =  "black"
            ctx.font = "25px Arial"
            ctx.textAlign = "right"
            ctx.strokeText("SUMMON", tabWidth-20, tabHeight-25)
            ctx.fillText("SUMMON", tabWidth-20, tabHeight-25)
        }

        
        ctx.fillStyle = "lime"
        ctx.strokeStyle =  "black"
        ctx.font = "20px Arial"
        ctx.textAlign = "left"
        let healthSpacing = ctx.measureText("Health: ")
        ctx.strokeText("Health: ", 15, tabHeight-50-(this.mob.bubbleBurst.power>0?20:0))
        ctx.fillText("Health: ", 15, tabHeight-50-(this.mob.bubbleBurst.power>0?20:0))
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.strokeText(abbreviate(this.mob.maxHealth), 15+healthSpacing.width, tabHeight-50-(this.mob.bubbleBurst.power>0?20:0))
        ctx.fillText(abbreviate(this.mob.maxHealth), 15+healthSpacing.width, tabHeight-50-(this.mob.bubbleBurst.power>0?20:0))
        
        ctx.fillStyle = "red"
        ctx.strokeStyle =  "black"
        ctx.font = "20px Arial"
        ctx.textAlign = "left"
        let damageSpacing = ctx.measureText("Damage: ")
        ctx.strokeText("Damage: ", 15, tabHeight-25-(this.mob.bubbleBurst.power>0?20:0))
        ctx.fillText("Damage: ", 15, tabHeight-25-(this.mob.bubbleBurst.power>0?20:0))
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.strokeText(abbreviate(this.mob.damage) + ((this.mob.pet&&this.mob.name=="Bubble")?` (${abbreviate(this.mob.damage*this.mob.bubbleBurst.damageMulti)} on pop)`:``), 15+damageSpacing.width, tabHeight-25-(this.mob.bubbleBurst.power>0?20:0))
        ctx.fillText(abbreviate(this.mob.damage) + ((this.mob.pet&&this.mob.name=="Bubble")?` (${abbreviate(this.mob.damage*this.mob.bubbleBurst.damageMulti)} on pop)`:``), 15+damageSpacing.width, tabHeight-25-(this.mob.bubbleBurst.power>0?20:0))

        if (this.mob.bubbleBurst.power>0) {
            ctx.fillStyle = "blue"
            ctx.strokeStyle =  "black"
            ctx.font = "20px Arial"
            ctx.textAlign = "left"
            let burstSpacing = ctx.measureText("Burst: ")
            ctx.strokeText("Burst: ", 15, tabHeight-20)
            ctx.fillText("Burst: ", 15, tabHeight-20)
            ctx.fillStyle = "white"
            ctx.strokeStyle =  "black"
            ctx.strokeText(abbreviate(this.mob.bubbleBurst.power),15+burstSpacing.width, tabHeight-20)
            ctx.fillText(abbreviate(this.mob.bubbleBurst.power, ), 15+burstSpacing.width, tabHeight-20)

        }
        
        ctx.closePath()
        ctx.restore()
    }
    draw() {
        if (this.drawable) {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.beginPath()
            ctx.lineWidth = 5;
            ctx.fillStyle = rarities[this.rarity-1][1]
            ctx.strokeStyle = darkenRGB(rarities[this.rarity-1][1], 25)
            ctx.roundRect(-this.l/2, -this.l/2, this.l, this.l, this.l/10)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()

            this.clone.x = this.mob.boxOffsetX
            this.clone.y = this.mob.boxOffsetY
            this.clone.angle = degreesToRads(-45+(this.mob.boxExtraRotation??1))
            this.clone.draw()
            
            if (this.amount > 1) {
                ctx.translate(this.l/2-4, -this.l/2+4)
                ctx.rotate(degreesToRads(20))
                ctx.beginPath()
                ctx.fillStyle = "white"
                ctx.strokeStyle = "black"
                ctx.font = "13px Arial"
                ctx.textAlign = "center"
                ctx.strokeText("x"+this.amount, 0, 0)
                ctx.fillText("x"+this.amount, 0, 0)
                ctx.closePath()
            }
            ctx.restore()
        }
    }
}