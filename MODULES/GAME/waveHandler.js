import { mapSize, mobs, canvas, ctx, mobBoxes } from "../../main.js";
import { randomElement } from "../../SCRIPTS/functions.js";
import { availableMobs } from "../STORAGE/mobs.js";
import { MobBox } from "../UI/mobBox.js";

export class WaveMode {
    /**
     * Since we run the update loop at 60hz, for a minute, it will be 3600 ticks.
     * 
     * Wave bar = white
     * Intermission bar = red
     */
    constructor(startWave, rarities) {
        this.startWave = startWave
        this.wave = startWave
        this.waveTick = 0
        this.rarities = rarities;
        this.intermissionTick = 0
        this.waveGoing = false
        this.waveStarted = true
        this.intermissionStarted = false
        this.sizeFactor = 1
        this.waveMaxTick = 3600
        this.intermissionMaxTick = 3600
        this.spawnMobTick = 90;
        this.amountInWave = 0
        this.spawnAmount = 0;
        this.time = 0;
        this.seconds = 0;
        this.minutes = 0;
        this.chanceGrowthFactor = 300
        this.mobSizeFactor = 25
        this.chances = [
            [0.8, 0],
            [0.2, 1],
            [0.1, 2],
            [0.05, 3],
            [0.0008, 4]
        ]
        this.raritiesToSpawn = [0, 0, 0, 0, 0]
        this.mobsToSpawn = []
        this.createWave(this.wave)
    }
    ticksToTime() {
        if (!this.intermissionStarted) {
            this.time = (this.waveMaxTick-this.waveTick)/60
        } else {
            this.time = (this.intermissionMaxTick-this.intermissionTick)/60
        }
        this.seconds = Math.floor(this.time%60)
        this.minutes = Math.floor(this.time/60)
    }
    createWave(wave) {
        this.raritiesToSpawn[0] = Math.min(1+Math.floor((wave-1)*0.105), this.rarities.length)
        this.raritiesToSpawn[1] = Math.max(this.raritiesToSpawn[0]-1, 1)
        this.raritiesToSpawn[2] = Math.min(this.raritiesToSpawn[0]+1, this.rarities.length)
        this.raritiesToSpawn[3] = Math.min(this.raritiesToSpawn[0]+2, this.rarities.length)
        this.raritiesToSpawn[4] = Math.min(this.raritiesToSpawn[0]+3, this.rarities.length)

        this.chances[0][0] = Math.min(0.8 - (wave-1)/this.chanceGrowthFactor, 0.2)
        this.chances[0][1] = Math.min(0.2 - (wave-1)/this.chanceGrowthFactor, 0.05)
        this.chances[0][2] = Math.min(0.1 + (wave-1)/this.chanceGrowthFactor, 0.6)
        this.chances[0][3] = Math.min(0.05 + (wave-1)/this.chanceGrowthFactor, 0.5)
        this.chances[0][4] = Math.min(0.0008 + (wave-1)/this.chanceGrowthFactor, 0.1)

        this.sizeFactor = Math.min(1 / (wave/this.mobSizeFactor), 1)
        let mobsToSet = Math.min((20+(wave-1)*3), 700)
        this.amountInWave = mobsToSet
        for (let i = 0; i < mobsToSet; i++) {
            let randomMob = randomElement(availableMobs)
            let rarityToSpawn = 0
            let rng = Math.random()
            for (let k = this.chances.length-1; k > 0; k--) {
                let [chance, type] = this.chances[k]
                if (chance > rng) {
                    rarityToSpawn = type
                    break;
                }
            }
            let mob = new availableMobs[randomMob].constructor(
                Math.random()*mapSize,
                Math.random()*mapSize,
                this.raritiesToSpawn[rarityToSpawn],
                availableMobs[randomMob].health,
                availableMobs[randomMob].damage,
                availableMobs[randomMob].size*this.sizeFactor
            )
            mob.innitMob()
            this.mobsToSpawn.push(mob)
        }
    }
    draw() {
        this.ticksToTime()
        let width = 500
        let height = 30

        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 8
        ctx.roundRect(canvas.width/2 - width/2, 80, width, height, height)
        ctx.stroke()
        ctx.closePath()
        ctx.clip()

        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 5
        ctx.roundRect(canvas.width/2 - width/2, 80, width, height, height)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = "white"
        if (this.waveTick > 0) {
            ctx.roundRect(canvas.width/2-width/2, 80, width*(this.waveTick/this.waveMaxTick), height, height)
        }
        ctx.fill()
        ctx.closePath()
        
        ctx.beginPath()
        ctx.fillStyle = "red"
        if (this.intermissionTick > 0) {
            ctx.roundRect(canvas.width/2-width/2, 80, width*(this.intermissionTick/this.intermissionMaxTick), height, height)
        }
        ctx.fill()
        ctx.closePath()
        ctx.restore()
        
        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 6
        ctx.lineJoin = "round"
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.font = "35px Arial"
        ctx.textAlign = "center"
        ctx.strokeText("FLORR BASICS", canvas.width/2, 60)
        ctx.fillText("FLORR BASICS", canvas.width/2, 60)
        ctx.font = "20px Arial"
        ctx.strokeText("Wave: " + this.wave, canvas.width/2, 80+20/3+height/2)
        ctx.fillText("Wave: " + this.wave, canvas.width/2, 80+20/3+height/2)
        ctx.font = "15px Arial"
        ctx.strokeText("Enemies: " + mobs.length, canvas.width/2, 130)
        ctx.fillText("Enemies: " + mobs.length, canvas.width/2, 130)
        ctx.textAlign = "left"
        ctx.strokeText(`${this.minutes}:${this.seconds<10?`0${this.seconds}`:this.seconds}`, canvas.width/2-width/2+15, 80+15/3+height/2)
        ctx.fillText(`${this.minutes}:${this.seconds<10?`0${this.seconds}`:this.seconds}`, canvas.width/2-width/2+15, 80+15/3+height/2)
        ctx.closePath()
        ctx.restore()
        
    }
    startNextWave() {
        this.waveTick = 0
        this.intermissionTick = 0
        this.intermissionStarted = false
        this.waveStarted = true
        this.waveGoing = true
        this.wave += 1
        this.mobsToSpawn = []
        this.createWave(this.wave)
    }
    update() {
        if (this.waveStarted && this.waveTick < this.waveMaxTick) {
            this.waveTick++
            this.waveGoing = true
        }
        if (this.waveTick >= this.waveMaxTick && !this.intermissionStarted) {
            this.intermissionStarted = true
            this.waveStarted = false
            this.waveGoing = false
        }
        if (this.intermissionStarted && this.intermissionTick < this.intermissionMaxTick) {
            this.intermissionTick++
        }
        if (this.waveStarted && this.waveGoing && !this.intermissionStarted) {
            if (this.spawnMobTick > 0) {
                this.spawnMobTick--
            }
            if (this.spawnMobTick <= 0) {
                this.spawnMobTick = 100 + Math.floor(Math.random()*230)
                this.spawnAmount = Math.min(this.amountInWave/10, this.mobsToSpawn.length)
                for (let i = 0; i < this.spawnAmount; i++) {
                    let mob = this.mobsToSpawn.shift()
                    mob.rarities = this.rarities
                    mobs.push(mob)
                }
            }
        }
        if ((this.intermissionStarted && (this.intermissionTick >= this.intermissionMaxTick || mobs.length <= 4))) {
            this.startNextWave()
        }
    }
}