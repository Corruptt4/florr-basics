import { ctx, allEntities } from "../../main.js";
import { entityDist } from "../../SCRIPTS/functions.js";

// CELL CLASS FOR THE GRID
class Cell {
    constructor(x, y, width, height) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.entities = []
        this.collisions = []
    }
    add(entity) {
        this.entities.push(entity)
    }
    update() {
        this.collisions = []
        for (let i = 0; i < this.entities.length; i++) {
            let e1 = this.entities[i]
            for (let j = i+1; j < this.entities.length; j++) {
                let e2 = this.entities[j]
                if (entityDist(e1, e2)) {
                    this.collisions.push([e1, e2])
                }
            }
        }
        this.entities = []
    }
}

// THE SPATIAL HASH ITSELF
export class SpatialHash {
    constructor(gridSize, mapSize) {
        this.mapSize = mapSize
        this.gridSize = gridSize ?? 16
        this.factor = 0
        this.collisions = []
        this.grid = []
    }
    innitGrid() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                let cellSize = this.mapSize/this.gridSize
                let index = y*this.gridSize+x
                this.grid[index] = new Cell(cellSize*x, cellSize*y, cellSize, cellSize)
            }
        }
    }
    draw() {
        this.grid.forEach((cell) => {
            ctx.beginPath()
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
            ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
            ctx.roundRect(cell.x, cell.y, cell.width, cell.height, 0)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
        })
    }
    clearCellEntities() {
        this.grid.forEach((cell) => { 
            cell.entities = []
        })
    }
    update() {
        this.collisions = []
        this.grid.forEach((cell) => {
            cell.update()
            this.collisions.push(...cell.collisions)
        })
    }
    addEntity(entity) {
        let cSize = this.mapSize/this.gridSize
        let cSx = Math.floor((entity.x-entity.size-this.factor)/cSize)
        let cSy = Math.floor((entity.y-entity.size-this.factor)/cSize)
        let cEx = Math.floor((entity.x+entity.size+this.factor)/cSize)
        let cEy = Math.floor((entity.y+entity.size+this.factor)/cSize)
        cSx = Math.max(0, cSx)
        cSy = Math.max(0, cSy)
        cEx = Math.min(this.gridSize-1, cEx)
        cEy = Math.min(this.gridSize-1, cEy)
        for (let x = cSx; x <= cEx; x++) {
            for (let y = cSy; y <= cEy; y++) {
                let index = y*this.gridSize+x
                this.grid[index].add(entity)
            }
        }
    }
}