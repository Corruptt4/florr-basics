import { ctx } from "../../main.js";

export class Rect {
    constructor(x, y, width, height, selfEntity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.selfEntity = selfEntity
        this.collisions = []
        this.detected = []
    }
    collisionCheck() {
        this.collisions = []
        this.detected.forEach((e) => {
            let dx = e.x - this.selfEntity.x
            let dy = e.y - this.selfEntity.y
            let r = e.size + this.selfEntity.size

            let dist = dx*dx+dy*dy

            if (dist <= (r*r)) {
                this.collisions.push([e, this.selfEntity])
            }
        })
        return this.collisions
    }
    overlap(p) {
        let cX = Math.max(this.x, Math.min(p.x, this.x + this.width))
        let cY = Math.max(this.y, Math.min(p.y, this.y + this.height))

        let dx = cX - p.x
        let dy = cY - p.y

        let dist = dx*dx+dy*dy
        let r = p.size*p.size

        return dist <= r
    }
}

export class QuadTree {
    constructor() {
        this.entityBoundaries = []
        this.collisions = []
        this.points = []
    }
    draw() {
        this.entityBoundaries.forEach((b) => {
            ctx.beginPath()
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
            ctx.lineWidth = 3
            ctx.strokeRect(b.x, b.y, b.width, b.height)
            ctx.closePath()
        })
    }
    update() {
        this.collisions = []
        this.entityBoundaries.forEach((b) => {
           this.points.forEach((p) => {
                if (p != b.selfEntity) {
                    if (b.overlap(p)) {
                        b.detected.push(p)
                    }
                    this.collisions.push(...b.collisionCheck(p, b))
                }
            })
        })
    }
    insert(point) {
        let en = point.size*2 + 50
        let entityBoundary = new Rect(point.x - en/2, point.y - en/2, en, en, point)
        this.entityBoundaries.push(entityBoundary)
        this.points.push(point)
    }
    reset() {
        this.entityBoundaries.forEach((b) => {
            b.detected = []
            b.collisions = []
        })
        this.points = []
        this.entityBoundaries = []
    }
}