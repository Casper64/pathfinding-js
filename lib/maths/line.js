"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = require("./vector2");
const util_1 = require("../util");
class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.segment = new vector2_1.Vec2(p1, p2);
        this.update();
    }
    update() {
        let p1, p2;
        if (this.p1.x > this.p2.x) {
            p1 = this.p2;
            p2 = this.p1;
        }
        else {
            p1 = this.p1;
            p2 = this.p2;
        }
        this.a = p2.y - p1.y;
        this.b = p1.x - p2.x;
        this.c = this.a * p2.x + this.b * p2.y;
    }
    perpendicular() {
        let m = new vector2_1.Vec2(this.p1, this.p2).mid;
        let c = -this.b * m.x + this.a * m.y;
        let a = -this.b;
        let b = this.a;
        return { a, b, c };
    }
    bisectIntersect(l2) {
        let l1 = this;
        let p1 = this.perpendicular();
        let p2 = l2.perpendicular();
        let D = p1.a * p2.b - p2.a * p1.b;
        // the lines are parallel
        if (D == 0)
            return new util_1.Point(-1, -1);
        let x = (p2.b * p1.c - p1.b * p2.c) / D;
        let y = (p1.a * p2.c - p2.a * p1.c) / D;
        return new util_1.Point(x, y);
    }
    intersect(l2) {
        let D = this.a * l2.b - l2.a * this.b;
        // the lines are parallel
        if (D == 0)
            return new util_1.Point(-1, -1);
        let x = (l2.b * this.c - this.b * l2.c) / D;
        let y = (this.a * l2.c - l2.a * this.c) / D;
        return new util_1.Point(x, y);
    }
    on(point) {
        // ax + by = c
        // by = c - ax
        // y = (c/b) - (a/b)x
        if (this.b == 0)
            return this.p1.x == point.x;
        let y = (this.c / this.b) - (this.a / this.b) * point.x;
        return Math.fround(y) === Math.fround(point.y);
    }
}
exports.Line = Line;
