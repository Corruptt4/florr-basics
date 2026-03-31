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
    contains(point) {
        return (
            point.x+point.size >= this.x-this.w &&
            point.x-point.size <= this.x+this.w &&
            point.y+point.size >= this.y-this.h &&
            point.y-point.size <= this.y+this.h
        )
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
    constructor(boundary) {
        this.boundary = boundary
        this.entityBoundaries = []
        this.collisions = []
        this.ranges = []
        this.points = []
        this.capacity = 4
        this.split = false
        this.splits = 0
        this.maxSplits = 3
    }
    draw() {
        if (!this.split) {
            let b = this.boundary
            ctx.beginPath()
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
            ctx.lineWidth = 3
            ctx.fillRect(b.x, b.y, b.width, b.height)
            ctx.strokeRect(b.x, b.y, b.width, b.height)
            ctx.closePath()
        }
       if (this.split) {
            if (this.nw) this.nw.draw()
            if (this.ne) this.ne.draw()
            if (this.sw) this.sw.draw()
            if (this.se) this.se.draw()
        }
        this.entityBoundaries.forEach((b) => {
            ctx.beginPath()
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
            ctx.lineWidth = 3
            ctx.strokeRect(b.x, b.y, b.width, b.height)
            ctx.closePath()
        })
    }
    update() {
        
    }
    subdivise() {
        this.split = true
        this.splits++
        let { x, y, width: w, height: h } = this.boundary
        let hw = w / 2
        let hh = h / 2

        this.nw = new QuadTree(new Rect(x, y, hw, hh))
        this.ne = new QuadTree(new Rect(x + hw, y, hw, hh))
        this.sw = new QuadTree(new Rect(x, y + hh, hw, hh))
        this.se = new QuadTree(new Rect(x + hw, y + hh, hw, hh))

        this.nw.splits = this.splits
        this.ne.splits = this.splits
        this.sw.splits = this.splits
        this.se.splits = this.splits
    }
    insert(point) {
        if (this.boundary.contains(point)) {
            return false
        }
        let oldPoints = []
        if (this.points.length < this.capacity) {
            this.points.push(point)
        } else if (this.points.length >= this.capacity && this.splits < this.maxSplits && !this.split) {
            oldPoints = this.points
            this.subdivise()
            if (this.nw.boundary.overlap(point)) {
                this.nw.insert(point)
            }
            if (this.ne.boundary.overlap(point)) {
                this.ne.insert(point)
            }
            if (this.sw.boundary.overlap(point)) {
                this.sw.insert(point)
            }
            if (this.se.boundary.overlap(point)) {
                this.se.insert(point)
            }
            oldPoints.forEach((p) => {
                if (this.nw.boundary.overlap(p)) {
                    this.nw.insert(p)
                }
                if (this.ne.boundary.overlap(p)) {
                    this.ne.insert(p)
                }
                if (this.sw.boundary.overlap(p)) {
                    this.sw.insert(p)
                }
                if (this.se.boundary.overlap(p)) {
                    this.se.insert(p)
                }
            })
        }
    }
    reset() {
        this.nw = null
        this.ne = null
        this.sw = null
        this.se = null
        this.split = false
        this.splits = 0
        this.points = []
    }
}