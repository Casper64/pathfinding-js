"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
class Grid {
    constructor(width, height) {
        this.matrix = [];
        this.map = [];
        this.width = width;
        this.height = height;
        this.matrix = new Array(height).fill(new Array(width).fill(0));
        this.fill(this.matrix);
    }
    get(x, y) {
        return this.map[y][x];
    }
    set(x, y, value) {
        this.map[y][x] = value;
    }
    setSolid(x, y, solid) {
        this.matrix[y][x] = Number(solid);
        this.map[y][x].solid = solid;
    }
    fill(matrix) {
        let empty = this.map.length == 0;
        for (let y = 0; y < matrix.length; y++) {
            if (empty)
                this.map.push([]);
            else
                this.map[y].length = 0;
            for (let x = 0; x < matrix[y].length; x++) {
                let node = new graph_1.Graph(x, y, Boolean(matrix[y][x]));
                this.map[y].push(node);
            }
        }
    }
}
exports.Grid = Grid;
