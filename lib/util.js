"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get coord() {
        return `${this.x}:${this.y}`;
    }
    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    static get zero() {
        return new Point(0, 0);
    }
    distance(b) {
        return Point.sub(this, b).length;
    }
    equals(p) {
        return this.x == p.x && this.y == p.y;
    }
    add(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }
    sub(p) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    }
    static add(p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    }
    static sub(p1, p2) {
        return new Point(p1.x - p2.x, p1.y - p2.y);
    }
}
exports.Point = Point;
exports.h = ["manhattan", "octile", "eucledian", "chebyshev"];
