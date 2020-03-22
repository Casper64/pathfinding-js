"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Graph {
    constructor(x, y, solid, movementCost = 1) {
        this.x = x;
        this.y = y;
        this.coord = `${x}:${y}`;
        this.solid = solid;
        this.movementCost = movementCost;
    }
}
exports.Graph = Graph;
