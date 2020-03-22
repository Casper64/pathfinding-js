"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AStar {
    constructor(options = {}) {
        this.diagonalCost = 1;
        this.diagonal = options.diagonal || false;
        this.heuristic = options.heuristic || "manhattan";
        this.passDiagonal = options.passDiagonal || false;
        this.bidirectional = options.bidirectional || false;
        if (options.smoothenPath)
            this.diagonalCost = Math.SQRT2;
    }
    findPath(start, end, grid) {
        if (this.bidirectional)
            return this.findPathbs(start, end, grid);
        let current = grid.get(start.x, start.y);
        let open = [current];
        let closed = [];
        let f_score = {};
        let cost_so_far = {};
        let came_from = {};
        let neighbours = [];
        let sc = `${start.x}:${start.y}`;
        let ec = `${end.x}:${end.y}`;
        f_score[sc] = 0;
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
                    let h = this.hvalue(end, next);
                    cost_so_far[next.coord] = new_cost;
                    f_score[next.coord] = new_cost + h;
                    came_from[next.coord] = current;
                    //@ts-ignore
                    open.insertSorted(next, (b, a) => {
                        return f_score[a.coord] - f_score[b.coord];
                    });
                }
            });
        }
        return { path: [], nodes: [], open, closed, length: 0 };
    }
    findPathbs(start, end, grid) {
        let current = [grid.get(start.x, start.y), grid.get(end.x, end.y)];
        let open = [[], []];
        let closed = [];
        let f_score = [{}, {}];
        let g_score = [{}, {}];
        let came_from = [{}, {}];
        let sc = `${start.x}:${start.y}`;
        let ec = `${end.x}:${end.y}`;
        let neighbours = [[], []];
        f_score[0][sc] = 0;
        f_score[1][ec] = 0;
        g_score[0][sc] = 0;
        g_score[1][ec] = 0;
        while (open[0].length > 0 && open[1].length > 0) {
            closed.push(current[0], current[1]);
            current = [open[0].pop(), open[1].pop()];
            if (came_from[0][current[1].coord] !== undefined || came_from[1][current[0].coord] !== undefined) {
                console.log(came_from, current);
                let newOpen = [];
                newOpen.push(...open[0]);
                newOpen.push(...open[1]);
                return { path: [], nodes: [], open: newOpen, closed, length: 0 };
            }
            neighbours = [this.getNeighbours(current[0], ec, grid), this.getNeighbours(current[1], sc, grid)];
            neighbours.forEach((direction, d) => {
                direction.forEach(n => {
                    let next = n[0];
                    let nc = g_score[d][current[d].coord] + next.movementCost + (n[1] > 3 ? this.diagonalCost - 1 : 0);
                    if (g_score[d][next.coord] === undefined || nc < g_score[d][next.coord]) {
                        let h = this.hvalue(d == 0 ? end : start, next);
                        g_score[d][next.coord] = nc;
                        f_score[d][next.coord] = nc + h;
                        came_from[d][next.coord] = current[d];
                        //@ts-ignore
                        open.insertSorted(next, (b, a) => {
                            return f_score[d][a.coord] - f_score[d][b.coord];
                        });
                    }
                });
            });
        }
        console.log("failed!");
        let newOpen = [];
        newOpen.push(...open[0]);
        newOpen.push(...open[1]);
        return { path: [], nodes: [], open: newOpen, closed, length: 0 };
    }
    hvalue(end, node) {
        let result = 0;
        // if(this.diagonal) {
        if (this.heuristic == "octile") {
            let D = 1;
            let D2 = Math.SQRT2;
            let dx = Math.abs(node.x - end.x);
            let dy = Math.abs(node.y - end.y);
            result = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
        }
        else if (this.heuristic == "eucledian") {
            let D = 1;
            let dx = Math.abs(node.x - end.x);
            let dy = Math.abs(node.y - end.y);
            result = D * Math.sqrt(dx * dx + dy * dy);
        }
        else if (this.heuristic == "chebyshev") {
            let D = 1;
            let D2 = 1;
            let dx = Math.abs(node.x - end.x);
            let dy = Math.abs(node.y - end.y);
            result = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
        }
        // }
        else {
            result = Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
        }
        return result;
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
exports.AStar = AStar;
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
