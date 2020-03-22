"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dijkstra {
    constructor(options = {}) {
        this.diagonalCost = 1;
        this.diagonal = options.diagonal || false;
        this.passDiagonal = options.passDiagonal || false;
        if (options.smoothenPath)
            this.diagonalCost = Math.SQRT2;
    }
    findPath(start, end, grid) {
        let current = grid.get(start.x, start.y);
        let open = [current];
        let closed = [];
        let came_from = {};
        let cost_so_far = {};
        let neighbours = [];
        let sc = `${start.x}:${start.y}`;
        let ec = `${end.x}:${end.y}`;
        cost_so_far[sc] = 0;
        while (open.length > 0) {
            closed.push(current);
            current = open.pop();
            if (current.coord === ec) { // finished
                let path = [];
                let nodes = [];
                while (current.coord != sc) {
                    path.push({ x: current.x, y: current.y });
                    nodes.push(current);
                    current = came_from[current.coord];
                }
                path.push({ x: start.x, y: start.y });
                nodes.push(grid.get(start.x, start.y));
                path.reverse();
                nodes.reverse();
                let length = path.length;
                return { path, nodes, open, closed, length };
            }
            neighbours = this.getNeighbours(current, ec, grid);
            neighbours.forEach((n, index) => {
                let next = n[0];
                let new_cost = cost_so_far[current.coord] + next.movementCost + (n[1] > 3 ? this.diagonalCost - 1 : 0);
                if (cost_so_far[next.coord] === undefined || new_cost < cost_so_far[next.coord]) {
                    cost_so_far[next.coord] = new_cost;
                    came_from[next.coord] = current;
                    //@ts-ignore
                    open.insertSorted(next, (b, a) => {
                        return cost_so_far[a.coord] - cost_so_far[b.coord];
                    });
                }
            });
        }
        return { path: [], nodes: [], open, closed, length: 0 };
    }
    getNeighbours(node, end, grid) {
        let nodes = [];
        let dir = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (let d = 0; d < (this.diagonal ? 8 : 4); d++) {
            if (node.x + dir[d][0] > grid.width - 1 || node.x + dir[d][0] < 0)
                continue;
            if (node.y + dir[d][1] > grid.height - 1 || node.y + dir[d][1] < 0)
                continue;
            if (!this.passDiagonal && d > 3 && grid.get(node.x + dir[d][0], node.y).solid && grid.get(node.x, node.y + dir[d][1]).solid)
                continue;
            let next = grid.get(node.x + dir[d][0], node.y + dir[d][1]);
            if (next.solid && next.coord !== end)
                continue;
            nodes.push([next, d]);
        }
        return nodes;
    }
}
exports.Dijkstra = Dijkstra;
//@ts-ignore
Array.prototype.insertSorted = function (v, sortFunction) {
    if (this.length < 1 || sortFunction(v, this[this.length - 1]) >= 0) {
        this.push(v);
        return this;
    }
    for (var i = this.length - 2; i >= 0; i--) {
        if (sortFunction(v, this[i]) >= 0) {
            this.splice(i + 1, 0, v);
            return this;
        }
    }
    this.splice(0, 0, v);
    return this;
};
