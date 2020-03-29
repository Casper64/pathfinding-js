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
    equals(p) {
        return this.x == p.x && this.y == p.y;
    }
}
exports.Point = Point;
exports.h = ["manhattan", "octile", "eucledian", "chebyshev"];
