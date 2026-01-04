import { ctx, rarities } from "../../main.js";
import { abbreviate, darkenRGB } from "../../SCRIPTS/functions.js";
import { availableMobs } from "../STORAGE/mobs.js";

export class PetalBoxPlace {
    constructor(player) {
        this.x = 0;
        this.y = 0
        this.player = player
        this.id = 0;
        this.boxSize = 85;
        this.draggingBox = false
        this.box = null
    }
    draw() {
        ctx.beginPath()
        ctx.globalAlpha = 0.5
        ctx.fillStyle = "black"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 8
        ctx.roundRect(this.x, this.y, this.boxSize, this.boxSize, this.boxSize/10)
        ctx.fill()
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.closePath()
        if (this.box != null) {
            if (!this.draggingBox) {
                this.box.x += (this.x - this.box.x) * 0.3;
                this.box.y += (this.y - this.box.y) * 0.3;
            }
            this.box.draw()
            this.box.petal[0].drawOnBox(this.box, 17)
        }
    }
}

export class PetalBox {
    constructor(player) {
        this.x = 0;
        this.y = 0
        this.player = player
        this.id = 0;
        this.rarity = 0
        this.boxSize = 85;
        this.boxOn = null;
        this.hovered = false;
        this.followMouse = false
        this.targetPercentage = 0;
        this.percentage = 0;
        this.petal = []
    }
    /**
     * this.petal example:
     *
     * [petal, id, rarity]
     */
    draw() {
        this.targetPercentage = this.petal[0].stats.health/this.petal[0].maxHealth
        if (this.targetPercentage < 0) {
            this.targetPercentage = 0
        }
        this.percentage += (this.targetPercentage-this.percentage)*0.1
        
        ctx.beginPath()
        ctx.fillStyle = darkenRGB(rarities[this.petal[0].rarity-1][1], 20)
        ctx.lineWidth = 8
        ctx.roundRect(this.x, this.y, this.boxSize, this.boxSize, this.boxSize/10)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = rarities[this.petal[0].rarity-1][1]
        ctx.roundRect(this.x, this.y, this.boxSize, this.boxSize*this.percentage, this.boxSize/10)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = darkenRGB(rarities[this.petal[0].rarity-1][1], 20)
        ctx.strokeStyle = darkenRGB(rarities[this.petal[0].rarity-1][1], 20)
        ctx.lineWidth = 8
        ctx.roundRect(this.x, this.y, this.boxSize, this.boxSize, this.boxSize/10)
        ctx.stroke()
        ctx.closePath()
        if (this.hovered) {
            let tabWidth = 450
            let tabHeight = 250
            let x = this.x - this.boxSize/2-tabWidth/3.3
            let y = this.y - tabHeight -  20
            let textX = this.x-tabWidth/2.5
            let textY = this.y - tabHeight
            ctx.beginPath()
            ctx.globalAlpha = 0.7
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
            ctx.strokeStyle = "rgba(0, 0, 0, 0.8"
            ctx.lineJoin = "round"
            ctx.roundRect(x, y, tabWidth, tabHeight, tabWidth/15)
            ctx.fill()
            ctx.stroke()
            ctx.globalAlpha = 1
            ctx.font = "45px Arial"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "left"
            ctx.lineWidth = 5
            ctx.strokeText(this.petal[0].name, x+20, y+50)
            ctx.fillText(this.petal[0].name, x+20, y+50)
            ctx.font = "20px Arial"
            ctx.fillStyle = rarities[this.petal[0].rarity-1][1]
            ctx.strokeStyle = darkenRGB(rarities[this.petal[0].rarity-1][1])
            ctx.strokeText(rarities[this.petal[0].rarity-1][0], x+20, y+75)
            ctx.fillText(rarities[this.petal[0].rarity-1][0], x+20, y+75)
            ctx.font = "20px Arial"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "right"
            ctx.strokeText((this.petal[0].maxReload/60).toFixed(2) + (this.petal[0].isSummoner ? " + " + (this.petal[0].summoner.timer/60).toFixed(2) : "") + "s",  x+tabWidth/1.05, y+35)
            ctx.fillText((this.petal[0].maxReload/60).toFixed(2) + (this.petal[0].isSummoner ? " + " + (this.petal[0].summoner.timer/60).toFixed(2) : "") + "s",  x+tabWidth/1.05, y+35)
            ctx.font = "20px Arial"
            ctx.fillStyle = "lime"
            ctx.strokeStyle = "black"
            ctx.textAlign = "left"
            ctx.strokeText("Health: ", x+20, y+tabHeight/1.25)
            ctx.fillText("Health: ", x+20, y+tabHeight/1.25)
            let healthExtraSpacing = ctx.measureText("Health: ")
            ctx.fillStyle = "white"
            ctx.strokeText(abbreviate(this.petal[0].maxHealth), x+20+healthExtraSpacing.width , y+tabHeight/1.25)
            ctx.fillText(abbreviate(this.petal[0].maxHealth), x+20+healthExtraSpacing.width, y+tabHeight/1.25)
            if (this.petal[0].poison.poison > 0) {
                ctx.font = "20px Arial"
                ctx.fillStyle = "rgba(127, 0, 177, 1)"
                ctx.strokeStyle = "black"
                ctx.textAlign = "left"
                ctx.strokeText("Poison: ", x+20, y+tabHeight/1.45)
                ctx.fillText("Poison: ", x+20, y+tabHeight/1.45)
                let damageExtraSpacing = ctx.measureText("Poison: ")
                ctx.fillStyle = "white"
                ctx.strokeText(`${(abbreviate(this.petal[0].poison.poison / (this.petal[0].poison.tick / 60)))}/s (duration: ${this.petal[0].poison.tick/60}s)`, x+20+damageExtraSpacing.width , y+tabHeight/1.45)
                ctx.fillText(`${(abbreviate(this.petal[0].poison.poison / (this.petal[0].poison.tick / 60)))}/s (duration: ${this.petal[0].poison.tick/60}s)`, x+20+damageExtraSpacing.width, y +tabHeight/1.45)
            }
            ctx.font = "20px Arial"
            ctx.fillStyle = "red"
            ctx.strokeStyle = "black"
            ctx.textAlign = "left"
            ctx.strokeText("Damage: ", x+20, y+tabHeight/1.10)
            ctx.fillText("Damage: ", x+20, y+tabHeight/1.10)
            let damageExtraSpacing = ctx.measureText("Damage: ")
            ctx.fillStyle = "white"
            ctx.strokeText(abbreviate(this.petal[0].stats.damage), x+20+damageExtraSpacing.width , y+tabHeight/1.10)
            ctx.fillText(abbreviate(this.petal[0].stats.damage), x+20+damageExtraSpacing.width, y +tabHeight/1.10)
            
            ctx.font = "15px Arial"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "left"
            ctx.lineWidth = 5
            ctx.strokeText(this.petal[0].description, x+20, y+tabHeight/2, tabWidth-20)
            ctx.fillText(this.petal[0].description, x+20, y+tabHeight/2, tabWidth-20)

            
            if (this.petal[0].isSummoner) {   
                ctx.font = "15px Arial"
                ctx.fillStyle = "cyan"
                ctx.strokeStyle = "black"
                ctx.strokeText("SUMMONS: ", x+20, y+tabHeight/1.45)
                ctx.fillText("SUMMONS: ", x+20, y+tabHeight/1.45)
                let summonsExtraSpacing = ctx.measureText("SUMMONS: ")
                ctx.fillStyle = rarities[this.petal[0].summoner.summonRarity][1]
                ctx.strokeStyle = darkenRGB(rarities[this.petal[0].summoner.summonRarity][1])
                ctx.strokeText(rarities[this.petal[0].summoner.summonRarity][0], x+20+summonsExtraSpacing.width , y+tabHeight/1.45)
                ctx.fillText(rarities[this.petal[0].summoner.summonRarity][0], x+20+summonsExtraSpacing.width, y+tabHeight/1.45)
                let summonSP1 = ctx.measureText(rarities[this.petal[0].summoner.summonRarity][0])

                ctx.fillStyle = "white"
                ctx.strokeStyle = "black"
                ctx.strokeText(availableMobs[this.petal[0].summoner.type].name, x+25+summonsExtraSpacing.width + summonSP1.width , y+tabHeight/1.45)
                ctx.fillText(availableMobs[this.petal[0].summoner.type].name, x+25+summonsExtraSpacing.width + summonSP1.width, y+tabHeight/1.45)
                
                let summonSP = ctx.measureText(rarities[this.petal[0].summoner.summonRarity][0] + " " + availableMobs[this.petal[0].summoner.type].name)
                ctx.fillStyle = "lime"
                ctx.strokeText(
                    `(HP: ${abbreviate(availableMobs[this.petal[0].summoner.type].getSpecificStats(this.petal[0].summoner.summonRarity, rarities).hp)}`, 
                    x+25+summonsExtraSpacing.width + summonSP.width, 
                    y+tabHeight/1.45
                )
                ctx.fillText(
                    `(HP: ${abbreviate(availableMobs[this.petal[0].summoner.type].getSpecificStats(this.petal[0].summoner.summonRarity, rarities).hp)}`, 
                    x+25+summonsExtraSpacing.width + summonSP.width,
                    y+tabHeight/1.45
                )
                
                let summonSP2 = ctx.measureText(abbreviate(availableMobs[this.petal[0].summoner.type].getSpecificStats(this.petal[0].summoner.summonRarity, rarities).hp))
                ctx.fillStyle = "lime"
                ctx.strokeText(
                    `DMG: ${abbreviate(availableMobs[this.petal[0].summoner.type].getSpecificStats(this.petal[0].summoner.summonRarity, rarities).dmg)})`, 
                    x+65+summonsExtraSpacing.width + summonSP2.width + summonSP.width, 
                    y+tabHeight/1.45
                )
                ctx.fillText(
                    `DMG: ${abbreviate(availableMobs[this.petal[0].summoner.type].getSpecificStats(this.petal[0].summoner.summonRarity, rarities).dmg)})`, 
                    x+65+summonsExtraSpacing.width + summonSP2.width + summonSP.width,
                    y+tabHeight/1.45
                )
            }
            
            if (this.petal[0].stats.armor > 0) {
                ctx.font = "20px Arial"
                ctx.fillStyle = "grey"
                ctx.strokeStyle = "black"
                ctx.textAlign = "right"
                ctx.strokeText("Armor", x+tabWidth/1.05, y+tabHeight/1.10)
                ctx.fillText("Armor", x+tabWidth/1.05, y+tabHeight/1.10)
                let armorExtraSpacing = ctx.measureText("Armor")
                ctx.strokeText(abbreviate(this.petal[0].stats.armor), x+tabWidth/1.07-armorExtraSpacing.width , y+tabHeight/1.10)
                ctx.fillText(abbreviate(this.petal[0].stats.armor), x+tabWidth/1.07-armorExtraSpacing.width, y +tabHeight/1.10)
            }
            ctx.closePath()
        }
    }
}