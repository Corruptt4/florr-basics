import { ctx, canvas, rarities } from "../../main.js";
import { abbreviate, darkenRGB } from "../../SCRIPTS/functions.js";
import { availablePetals } from "../STORAGE/petals.js";


export class InventoryPetalBox {
    constructor(x, y, set, rarity) {
        this.x = x;
        this.y = y;
        this.set = set;
        this.rarity = rarity;
        this.rarities = null;
        this.amount = 0
        this.boxSize = 80
        this.petal = null;
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.rarities[this.rarity-1][1]
        ctx.strokeStyle = darkenRGB(this.rarities[this.rarity-1][1], 20)
        ctx.lineWidth = 8
        ctx.roundRect(this.x, this.y, this.boxSize, this.boxSize, this.boxSize/10)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        this.petal.drawOnBox(this, 18)
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
        this.tabWidth = 400
        this.tabHeight = 550
        this.petalRarityFilter = "common"
        this.shownPetals = []
        this.row = 0
        this.col = 0
        this.petals = [];
        this.exitBox = {
            position: {x: this.x, y: this.y},
            size: 40,
            color: "rgb(200, 0, 0)"
        }
        this.petalFilter = {
            position: {x: this.x, y:this.y},
            width: 100,
            height: 40,
            filterRarity: 1,
            color: "rgb(200, 200, 200)"
        }
        this.open = false;
        this.color = "rgb(0, 188, 188)"
        this.scalingFactor = 0.4
        this.petalsToParse = []
    }
    update() {
        this.petalFilter.setFilter = () => {
            if (this.petalFilter.filterRarity > this.rarities.length-1) {
                this.petalFilter.filterRarity = 0
            }
            this.petalFilter.filterRarity += 1
        }
        this.shownPetals = this.petals.filter((petal) => (this.rarities.indexOf(petal.rarity) == this.petalFilter.filterRarity-1) && petal.amount > 0)
        if (this.open) {
            this.width += (this.tabWidth - this.width) * this.scalingFactor
            this.height += (this.tabHeight - this.height) * this.scalingFactor
        }
        if (!this.open) {
            this.width += (this.originalWidth - this.width) *  this.scalingFactor
            this.height += (this.originalHeight - this.height) *  this.scalingFactor
        }
        if (this.petalsToParse.length > 0) {
            this.petalsToParse.forEach((p) => {
                console.log(p)
                let petalRarity = p.rarity
                let petalName = p.name

                let typeOfPetal = this.petals.filter((petal) => petalName === petal.petal.name)
                let r = typeOfPetal.filter((petal) => this.rarities[petalRarity-1] == petal.rarity)
                r[0].amount++
                this.petalsToParse.splice(this.petalsToParse.indexOf(p), 1)
            })
        }
    }
    draw() {
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
            ctx.fillStyle = "white"
            ctx.strokeStyle = "black"
            ctx.textAlign = "center"
            ctx.font = "30px Arial"
            ctx.strokeText("Inventory", this.x+this.width/2, this.y+30/3+30)
            ctx.fillText("Inventory", this.x+this.width/2, this.y+30/3+30)
            ctx.closePath()

            ctx.beginPath()
            ctx.fillStyle = this.exitBox.color
            ctx.strokeStyle = darkenRGB(this.exitBox.color, 20)
            ctx.lineWidth = 6
            this.exitBox.position.x = this.x + this.width - 10 - this.exitBox.size
            this.exitBox.position.y = this.y - this.exitBox.size/2-10 + this.exitBox.size
            ctx.roundRect(this.exitBox.position.x, this.exitBox.position.y, this.exitBox.size, this.exitBox.size, this.exitBox.size/4)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()

            ctx.beginPath()
            let textSize = 16
            ctx.fillStyle = this.petalFilter.color
            ctx.strokeStyle = darkenRGB(this.petalFilter.color, 20)
            ctx.lineWidth = 6
            this.petalFilter.position.x = this.x + this.width - 10 - this.petalFilter.width
            this.petalFilter.position.y = this.y + this.petalFilter.height + 20
            ctx.roundRect(this.petalFilter.position.x, this.petalFilter.position.y, this.petalFilter.width, this.petalFilter.height, this.petalFilter.height/4)
            ctx.fill()
            ctx.stroke()
            ctx.fillStyle = this.rarities[this.petalFilter.filterRarity == 0 ? this.petalFilter.filterRarity : this.petalFilter.filterRarity-1][1]
            ctx.strokeStyle = darkenRGB(this.rarities[this.petalFilter.filterRarity == 0 ? this.petalFilter.filterRarity : this.petalFilter.filterRarity-1][1], 20)
            ctx.font = `${textSize}px Arial`
            ctx.textAlign = "center" 
            ctx.strokeText(this.rarities[(this.petalFilter.filterRarity) == 0 ? this.petalFilter.filterRarity : this.petalFilter.filterRarity-1][0], this.petalFilter.position.x + this.petalFilter.width/2, this.petalFilter.position.y + textSize/3 + this.petalFilter.height/2) 
            ctx.fillText(this.rarities[(this.petalFilter.filterRarity) == 0 ? this.petalFilter.filterRarity : this.petalFilter.filterRarity-1][0], this.petalFilter.position.x + this.petalFilter.width/2, this.petalFilter.position.y + textSize/3 + this.petalFilter.height/2)
            ctx.closePath()
            this.shownPetals.forEach((petal, index) => {
                let setRow = index%4
                let col = Math.floor(index/4)
                let slot = new InventoryPetalBox(this.x+20+(93.5*setRow), this.y+120+(93.5*col), petal.rarity, this.petalFilter.filterRarity)
                slot.rarities = this.rarities
                slot.petal = petal.petal
                slot.amount = petal.amount
                slot.draw()
            })
        }
    }
    innitPetals(rarities) {
        for (let i = 0; i < availablePetals.length; i++) {
            for (let k = 0; k <= rarities.length; k++) {
                this.petals.push({
                    petal: availablePetals[i],
                    amount: Math.random() < 0.5 ? 0 : 10,
                    rarity: rarities[k]
                })
            }
        }
        this.rarities = rarities
    }
}