import { ctx, canvas, rarities } from "../../main.js";
import { abbreviate, darkenRGB } from "../../SCRIPTS/functions.js";
import { availableMobs } from "../STORAGE/mobs.js";
import { availablePetals } from "../STORAGE/petals.js";

export class InventoryPetalBox {
    constructor(x, y, set, rarity, rarities) {
        this.x = x;
        this.y = y;
        this.rarity = rarity;
        this.hovered = false
        this.amount = 1
        this.boxSize = 75
        this.innited = true
        this.rarities = rarities
        this.petal = null;
    }
    drawBox() {
        if (this.hovered) {
            this.rarities = rarities
            this.petal.rarity = this.rarity
            let tabWidth = 600
            let tabHeight = 250
            let x = this.x - this.boxSize/2-tabWidth/3.3
            let y = this.y - tabHeight -  20
            ctx.beginPath()
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
            ctx.strokeStyle = "rgba(0, 0, 0, 1)"
            ctx.lineJoin = "round"
            ctx.roundRect(x, y, tabWidth, tabHeight, tabWidth/25)
            ctx.fill()
            ctx.stroke()
            ctx.font = "45px Arial"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "left"
            ctx.lineWidth = 5
            ctx.strokeText(this.petal.name, x+20, y+50)
            ctx.fillText(this.petal.name, x+20, y+50)
            ctx.font = "20px Arial"
            ctx.fillStyle = this.rarities[this.petal.rarity-1][1]
            ctx.strokeStyle = darkenRGB(this.rarities[this.petal.rarity-1][1])
            ctx.strokeText(this.rarities[this.petal.rarity-1][0], x+20, y+75)
            ctx.fillText(this.rarities[this.petal.rarity-1][0], x+20, y+75)
            ctx.font = "20px Arial"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "right"
            ctx.strokeText((this.petal.maxReload/60).toFixed(2) + "s" + (this.petal.isSummoner ? " + " + (this.petal.summoner.timer2/60).toFixed(2) + "s": ""),  x+tabWidth/1.05, y+35)
            ctx.fillText((this.petal.maxReload/60).toFixed(2) + "s" + (this.petal.isSummoner ? " + " + (this.petal.summoner.timer2/60).toFixed(2) + "s" : ""),  x+tabWidth/1.05, y+35)
            ctx.font = "20px Arial"
            ctx.fillStyle = "lime"
            ctx.strokeStyle = "black"
            ctx.textAlign = "left"
            ctx.strokeText("Health: ", x+20, y+tabHeight/1.25)
            ctx.fillText("Health: ", x+20, y+tabHeight/1.25)
            let healthExtraSpacing = ctx.measureText("Health: ")
            ctx.fillStyle = "white"
            ctx.strokeText(abbreviate(this.petal.maxHealth), x+20+healthExtraSpacing.width , y+tabHeight/1.25)
            ctx.fillText(abbreviate(this.petal.maxHealth), x+20+healthExtraSpacing.width, y+tabHeight/1.25)
            if (this.petal.poison.poison > 0) {
                ctx.font = "20px Arial"
                ctx.fillStyle = "rgba(127, 0, 177, 1)"
                ctx.strokeStyle = "black"
                ctx.textAlign = "left"
                ctx.strokeText("Poison: ", x+20, y+tabHeight/1.45)
                ctx.fillText("Poison: ", x+20, y+tabHeight/1.45)
                let damageExtraSpacing = ctx.measureText("Poison: ")
                ctx.fillStyle = "white"
                ctx.strokeText(`${(abbreviate(this.petal.poison.poison / (this.petal.poison.tick / 60)))}/s (duration: ${this.petal.poison.tick/60}s)`, x+20+damageExtraSpacing.width , y+tabHeight/1.45)
                ctx.fillText(`${(abbreviate(this.petal.poison.poison / (this.petal.poison.tick / 60)))}/s (duration: ${this.petal.poison.tick/60}s)`, x+20+damageExtraSpacing.width, y +tabHeight/1.45)
            }
            ctx.font = "20px Arial"
            ctx.fillStyle = "red"
            ctx.strokeStyle = "black"
            ctx.textAlign = "left"
            ctx.strokeText("Damage: ", x+20, y+tabHeight/1.10)
            ctx.fillText("Damage: ", x+20, y+tabHeight/1.10)
            let damageExtraSpacing = ctx.measureText("Damage: ")
            ctx.fillStyle = "white"
            ctx.strokeText(abbreviate(this.petal.stats.damage), x+20+damageExtraSpacing.width , y+tabHeight/1.10)
            ctx.fillText(abbreviate(this.petal.stats.damage), x+20+damageExtraSpacing.width, y +tabHeight/1.10)
            
            ctx.font = "15px Arial"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "left"
            ctx.lineWidth = 5
            ctx.strokeText(this.petal.description, x+20, y+tabHeight/2, tabWidth-20)
            ctx.fillText(this.petal.description, x+20, y+tabHeight/2, tabWidth-20)

            
            if (this.petal.isSummoner) {   
                ctx.font = "15px Arial"
                ctx.fillStyle = "cyan"
                ctx.strokeStyle = "black"
                ctx.strokeText(`SUMMONS: ${this.petal.summoner.capacity > 1 ? this.petal.summoner.capacity + "x" : ""}`, x+20, y+tabHeight/1.45)
                ctx.fillText(`SUMMONS: ${this.petal.summoner.capacity > 1 ? this.petal.summoner.capacity + "x" : ""}`, x+20, y+tabHeight/1.45)
                let summonsExtraSpacing = ctx.measureText(`SUMMONS: ${this.petal.summoner.capacity > 1 ? this.petal.summoner.capacity + "x" : ""}`)
                ctx.fillStyle = this.rarities[this.petal.summoner.summonRarity][1]
                ctx.strokeStyle = darkenRGB(this.rarities[this.petal.summoner.summonRarity][1])
                ctx.strokeText(this.rarities[this.petal.summoner.summonRarity][0], x+20 + (this.petal.summoner.capacity > 1 ? 5 : 0)+summonsExtraSpacing.width , y+tabHeight/1.45)
                ctx.fillText(this.rarities[this.petal.summoner.summonRarity][0], x+20 + (this.petal.summoner.capacity > 1 ? 5 : 0)+summonsExtraSpacing.width, y+tabHeight/1.45)
                let summonSP1 = ctx.measureText(this.rarities[this.petal.summoner.summonRarity][0])

                ctx.fillStyle = "white"
                ctx.strokeStyle = "black"
                ctx.strokeText(availableMobs[this.petal.summoner.type].name, x+25 + (this.petal.summoner.capacity > 1 ? 5 : 0)+summonsExtraSpacing.width + summonSP1.width , y+tabHeight/1.45)
                ctx.fillText(availableMobs[this.petal.summoner.type].name, x+25 + (this.petal.summoner.capacity > 1 ? 5 : 0)+summonsExtraSpacing.width + summonSP1.width, y+tabHeight/1.45)
                
                let summonSP = ctx.measureText(this.rarities[this.petal.summoner.summonRarity][0] + " " + availableMobs[this.petal.summoner.type].name)
                ctx.fillStyle = "lime"
                ctx.strokeText(
                    `(HP: ${abbreviate(availableMobs[this.petal.summoner.type].getSpecificStats(this.petal.summoner.summonRarity, true).hp)}`, 
                    x+25+ (this.petal.summoner.capacity > 1 ? 5 : 0)+summonsExtraSpacing.width + summonSP.width, 
                    y+tabHeight/1.45
                )
                ctx.fillText(
                    `(HP: ${abbreviate(availableMobs[this.petal.summoner.type].getSpecificStats(this.petal.summoner.summonRarity, true).hp)}`, 
                    x+ (this.petal.summoner.capacity > 1 ? 5 : 0)+25+summonsExtraSpacing.width + summonSP.width,
                    y+tabHeight/1.45
                )
                
                let summonSP2 = ctx.measureText(abbreviate(availableMobs[this.petal.summoner.type].getSpecificStats(this.petal.summoner.summonRarity, true).hp))
                ctx.fillStyle = "lime"
                ctx.strokeText(
                    `DMG: ${abbreviate(availableMobs[this.petal.summoner.type].getSpecificStats(this.petal.summoner.summonRarity, true).dmg)})`, 
                    x+(this.petal.summoner.capacity > 1 ? 5 : 0)+65+summonsExtraSpacing.width + summonSP2.width + summonSP.width, 
                    y+tabHeight/1.45
                )
                ctx.fillText(
                    `DMG: ${abbreviate(availableMobs[this.petal.summoner.type].getSpecificStats(this.petal.summoner.summonRarity, true).dmg)})`, 
                    x+(this.petal.summoner.capacity > 1 ? 5 : 0)+65+summonsExtraSpacing.width + summonSP2.width + summonSP.width,
                    y+tabHeight/1.45
                )
            }
            
            if (this.petal.stats.armor > 0) {
                ctx.font = "20px Arial"
                ctx.fillStyle = "grey"
                ctx.strokeStyle = "black"
                ctx.textAlign = "right"
                ctx.strokeText("Armor", x+tabWidth/1.05, y+tabHeight/1.10)
                ctx.fillText("Armor", x+tabWidth/1.05, y+tabHeight/1.10)
                let armorExtraSpacing = ctx.measureText("Armor")
                ctx.strokeText(abbreviate(this.petal.stats.armor), x+tabWidth/1.07-armorExtraSpacing.width , y+tabHeight/1.10)
                ctx.fillText(abbreviate(this.petal.stats.armor), x+tabWidth/1.07-armorExtraSpacing.width, y +tabHeight/1.10)
            }
            ctx.closePath()
        }
    }
    draw() {
        this.rarities = rarities
        ctx.beginPath()
        ctx.fillStyle = this.rarities[this.rarity-1][1]
        ctx.strokeStyle = darkenRGB(this.rarities[this.rarity-1][1], 20)
        ctx.lineWidth = 6
        ctx.roundRect(this.x, this.y, this.boxSize, this.boxSize, this.boxSize/10)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        this.petal.drawOnBox(this, 15, 15)
        ctx.save()
        ctx.translate(this.x+this.boxSize/1.2, this.y+10)
        ctx.rotate(Math.PI/8)
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 4
        ctx.font = "15px Arial"
        ctx.textAlign = "center"
        ctx.strokeText("x" + abbreviate(this.amount), 0, 0)
        ctx.fillText("x" + abbreviate(this.amount), 0, 0)
        ctx.closePath()
        ctx.restore()
    }
}

export class Inventory {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.rarities = []
        this.width = width;
        this.height = height; 
        this.originalWidth = width;
        this.originalHeight = height;
        this.tabWidth = 450
        this.tabHeight = 550
        this.shownPetals = []
        this.row = 0
        this.col = 0
        this.visibleSlots = []
        this.petals = [];
        this.exitBox = {
            position: {x: this.x, y: this.y},
            size: 40,
            color: "rgb(200, 0, 0)"
        }
        this.petalFilter = {
            position: {x: this.x, y:this.y},
            width: 380,
            height: 45,
            color: "rgb(200, 200, 200)"
        }
        this.open = false;
        this.color = "rgb(0, 188, 188)"
        this.scalingFactor = 0.4;
        this.toScrollTarget = 0;
        this.scrollTarget = 0;
        this.petalsToParse = []
    }
    update() {
        this.visibleSlots = []
        if (this.open) {
            let actualSlots = this.shownPetals.filter((petal) => petal.amount > 0)
            actualSlots.forEach((petal, index) => {
                let setRow = index%5
                let col = Math.floor(index/5)
                let slot = new InventoryPetalBox(this.x+20+(85*setRow), this.y-this.scrollTarget+100+(93.5*col), petal, petal.actualRarity, this.rarities)
                slot.petal = petal.petal
                slot.petal.host = []
                slot.amount = petal.amount
                this.visibleSlots.push(slot)
            })
        }
        this.toScrollTarget = Math.max(Math.min(this.toScrollTarget, this.y+(93.5*Math.floor(this.visibleSlots.length/5))-(200+93.5*5)), 0)
        this.scrollTarget += (this.toScrollTarget-this.scrollTarget)*0.2
       
        if (this.open) {
            this.width += (this.tabWidth - this.width) * this.scalingFactor
            this.height += (this.tabHeight - this.height) * this.scalingFactor
        }
        if (!this.open) {
            this.width += (this.originalWidth - this.width) *  this.scalingFactor
            this.height += (this.originalHeight - this.height) *  this.scalingFactor
        }
            this.petalsToParse.forEach((p) => {
                let petalRarity = p.rarity
                let petalName = p.name

                let typeOfPetal = this.shownPetals.filter((petal) => petalName === petal.petal.name)
                let r = typeOfPetal.filter((petal) => this.rarities[petalRarity] == petal.rarity)
                r[0].amount++
                this.petalsToParse.splice(this.petalsToParse.indexOf(p), 1)
            })
    }
    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.strokeStyle = darkenRGB(this.color, 20)
        ctx.lineWidth = 6
        ctx.roundRect(this.x, this.y, this.width, this.height, 15)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        if (this.open) {
            ctx.beginPath()
            ctx.lineJoin = "round"
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "center"
            ctx.font = "30px Arial"
            ctx.strokeText("Inventory", this.x+this.width/2, this.y+30/3+30)
            ctx.fillText("Inventory", this.x+this.width/2, this.y+30/3+30)
            ctx.closePath()

            ctx.beginPath()
            ctx.lineJoin = "round"
            ctx.fillStyle = this.exitBox.color
            ctx.strokeStyle = darkenRGB(this.exitBox.color, 20)
            ctx.lineWidth = 6
            this.exitBox.position.x = this.x + this.width - 10 - this.exitBox.size
            this.exitBox.position.y = this.y - this.exitBox.size/2-10 + this.exitBox.size
            ctx.roundRect(this.exitBox.position.x, this.exitBox.position.y, this.exitBox.size, this.exitBox.size, this.exitBox.size/4)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
        }

        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.roundRect(this.x, this.y+90, this.width, this.height-100)
        ctx.closePath()
        ctx.clip()
        if (this.open) {
            this.visibleSlots.forEach((s) => {
                if (s.amount > 0) {
                    s.draw()
                }
            })
        }
        ctx.restore()
    }
    innitPetals(rarities) {
        this.shownPetals = [];

        for (let i = 0; i < availablePetals.length; i++) {
            for (let k = 1; k <= rarities.length; k++) {
                let petal = new availablePetals[i].constructor(
                    availablePetals[i].host,
                    availablePetals[i].stats
                );
                this.shownPetals.push({
                    petal: petal,
                    amount: 0,
                    rarity: rarities[k],
                    actualRarity: k
                });
            }
        }

        this.shownPetals.sort((a, b) => b.actualRarity - a.actualRarity);
        this.shownPetals.forEach((p) => {
            p.petal.makeSides()
        })
        this.rarities = rarities;
    }
}