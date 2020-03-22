var pf = (function () {
    var defines = {};
    var entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies: dependencies, factory: factory };
        entry[0] = name;
    }
    define("require", ["exports"], function (exports) {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: function (name) { return resolve(name); } });
    });
    define("graph", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
        var Graph = /** @class */ (function () {
            function Graph(x, y, solid, movementCost) {
                if (movementCost === void 0) { movementCost = 1; }
                this.x = x;
                this.y = y;
                this.coord = x + ":" + y;
                this.solid = solid;
                this.movementCost = movementCost;
            }
            return Graph;
        }());
        exports.Graph = Graph;
    });
    define("grid", ["require", "exports", "graph"], function (require, exports, graph_1) {
        "use strict";
        exports.__esModule = true;
        var Grid = /** @class */ (function () {
            function Grid(width, height) {
                this.matrix = [];
                this.map = [];
                this.width = width;
                this.height = height;
                this.matrix = new Array(height).fill(new Array(width).fill(0));
                this.fill(this.matrix);
            }
            Grid.prototype.get = function (x, y) {
                return this.map[y][x];
            };
            Grid.prototype.set = function (x, y, value) {
                this.map[y][x] = value;
            };
            Grid.prototype.setSolid = function (x, y, solid) {
                this.matrix[y][x] = Number(solid);
                this.map[y][x].solid = solid;
            };
            Grid.prototype.fill = function (matrix) {
                var empty = this.map.length == 0;
                for (var y = 0; y < matrix.length; y++) {
                    if (empty)
                        this.map.push([]);
                    else
                        this.map[y].length = 0;
                    for (var x = 0; x < matrix[y].length; x++) {
                        var node = new graph_1.Graph(x, y, Boolean(matrix[y][x]));
                        this.map[y].push(node);
                    }
                }
            };
            Grid.prototype.random = function (chance) {
                var _this = this;
                if (chance === void 0) { chance = 0.7; }
                this.matrix.forEach(function (row, y) {
                    row.forEach(function (val, x) {
                        var v = Number(Math.random() > chance);
                        if (v)
                            _this.setSolid(x, y, true);
                        else
                            _this.setSolid(x, y, false);
                        _this.matrix[y][x] = v;
                    });
                });
                return this.matrix;
            };
            return Grid;
        }());
        exports.Grid = Grid;
    });
    define("util", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
        exports.h = ["manhattan", "octile", "eucledian", "chebyshev"];
    });
    define("algorithms/astar", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
        var AStar = /** @class */ (function () {
            function AStar(options) {
                if (options === void 0) { options = {}; }
                this.diagonalCost = 1;
                this.diagonal = options.diagonal || false;
                this.heuristic = options.heuristic || "manhattan";
                this.passDiagonal = options.passDiagonal || false;
                this.bidirectional = options.bidirectional || false;
                if (options.smoothenPath)
                    this.diagonalCost = Math.SQRT2;
            }
            AStar.prototype.findPath = function (start, end, grid) {
                var _this = this;
                if (this.bidirectional)
                    return this.findPathbs(start, end, grid);
                var current = grid.get(start.x, start.y);
                var open = [current]; // All the nodes that are open for examination
                var closed = []; // All the nodes that are examined
                var f_score = {}; // The movement cost g(x) + heuristic value h(x, end)
                var cost_so_far = {}; // the movement cost in total g(x)
                var came_from = {}; // hasmap to store where every node came from
                var neighbours = [];
                var sc = start.x + ":" + start.y;
                var ec = end.x + ":" + end.y;
                f_score[sc] = 0;
                cost_so_far[sc] = 0;
                while (open.length > 0) {
                    closed.push(current);
                    current = open.pop();
                    if (current.coord === ec) { // finished
                        var path = [];
                        var nodes = [];
                        while (current.coord != sc) {
                            path.push({ x: current.x, y: current.y });
                            nodes.push(current);
                            current = came_from[current.coord];
                        }
                        path.push({ x: start.x, y: start.y });
                        nodes.push(grid.get(start.x, start.y));
                        path.reverse();
                        nodes.reverse();
                        var length_1 = path.length;
                        return { path: path, nodes: nodes, open: open, closed: closed, length: length_1 };
                    }
                    neighbours = this.getNeighbours(current, ec, grid);
                    neighbours.forEach(function (n, index) {
                        var next = n[0];
                        var new_cost = cost_so_far[current.coord] + next.movementCost + (n[1] > 3 ? _this.diagonalCost - 1 : 0);
                        if (cost_so_far[next.coord] === undefined || new_cost < cost_so_far[next.coord]) {
                            var h = _this.hvalue(end, next);
                            cost_so_far[next.coord] = new_cost;
                            f_score[next.coord] = new_cost + h;
                            came_from[next.coord] = current;
                            //@ts-ignore
                            open.insertSorted(next, function (b, a) {
                                return f_score[a.coord] - f_score[b.coord];
                            });
                        }
                    });
                }
                return { path: [], nodes: [], open: open, closed: closed, length: 0 };
            };
            AStar.prototype.findPathbs = function (start, end, grid) {
                var _this = this;
                var current = [grid.get(start.x, start.y), grid.get(end.x, end.y)];
                var open = [[], []];
                var closed = [];
                var f_score = [{}, {}]; // Different in bidirectional search: g(x) + h(x, y), g(y), 
                var g_score = [{}, {}]; // where g(x) is from x to start and g(y) is from y to end
                var came_from = [{}, {}];
                var sc = start.x + ":" + start.y;
                var ec = end.x + ":" + end.y;
                var neighbours = [[], []];
                f_score[0][sc] = 0;
                f_score[1][ec] = 0;
                g_score[0][sc] = 0;
                g_score[1][ec] = 0;
                open = [[grid.get(start.x, start.y)], [grid.get(end.x, end.y)]];
                while (open[0].length > 0 && open[1].length > 0) {
                    closed.push(current[0], current[1]);
                    current = [open[0].pop(), open[1].pop()];
                    if (came_from[0][current[1].coord] !== undefined || came_from[1][current[0].coord] !== undefined) {
                        var d = Number(came_from[0][current[1].coord] !== undefined);
                        var path = [];
                        var nodes = [];
                        var path2 = [];
                        var connecting = { x: current[d].x, y: current[d].y };
                        while (current[d]) {
                            path.push({ x: current[d].x, y: current[d].y });
                            current[d] = came_from[1 - d][current[d].coord];
                        }
                        current[1 - d] = grid.get(connecting.x, connecting.y);
                        while (current[1 - d]) {
                            path2.push({ x: current[1 - d].x, y: current[1 - d].y });
                            current[1 - d] = came_from[d][current[1 - d].coord];
                        }
                        path.reverse();
                        path.pop();
                        path.push.apply(path, path2);
                        var newOpen_1 = [];
                        newOpen_1.push.apply(newOpen_1, open[0]);
                        newOpen_1.push.apply(newOpen_1, open[1]);
                        return { path: path, nodes: [], open: newOpen_1, closed: closed, length: 0 };
                    }
                    neighbours = [this.getNeighbours(current[0], ec, grid), this.getNeighbours(current[1], sc, grid)];
                    neighbours.forEach(function (direction, d) {
                        direction.forEach(function (n) {
                            var next = n[0];
                            var nc = g_score[d][current[d].coord] + next.movementCost + (n[1] > 3 ? _this.diagonalCost - 1 : 0);
                            if (g_score[d][next.coord] === undefined || nc < g_score[d][next.coord]) {
                                var h = _this.hvalue(current[1 - d], next);
                                g_score[d][next.coord] = nc;
                                f_score[d][next.coord] = nc + h + g_score[1 - d][current[1 - d].coord];
                                came_from[d][next.coord] = current[d];
                                //@ts-ignore
                                open[d].insertSorted(next, function (b, a) {
                                    return f_score[d][a.coord] - f_score[d][b.coord];
                                });
                            }
                        });
                    });
                }
                var newOpen = [];
                newOpen.push.apply(newOpen, open[0]);
                newOpen.push.apply(newOpen, open[1]);
                return { path: [], nodes: [], open: newOpen, closed: closed, length: 0 };
            };
            AStar.prototype.hvalue = function (end, node) {
                var result = 0;
                if (this.heuristic == "octile") {
                    var D = 1;
                    var D2 = Math.SQRT2;
                    var dx = Math.abs(node.x - end.x);
                    var dy = Math.abs(node.y - end.y);
                    result = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
                }
                else if (this.heuristic == "eucledian") {
                    var D = 1;
                    var dx = Math.abs(node.x - end.x);
                    var dy = Math.abs(node.y - end.y);
                    result = D * Math.sqrt(dx * dx + dy * dy);
                }
                else if (this.heuristic == "chebyshev") {
                    var D = 1;
                    var D2 = 1;
                    var dx = Math.abs(node.x - end.x);
                    var dy = Math.abs(node.y - end.y);
                    result = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
                }
                else { // Manhattan distance is the best for non diagonal movement
                    result = Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
                }
                return result;
            };
            AStar.prototype.getNeighbours = function (node, end, grid) {
                var nodes = [];
                var dir = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
                for (var d = 0; d < (this.diagonal ? 8 : 4); d++) {
                    if (node.x + dir[d][0] > grid.width - 1 || node.x + dir[d][0] < 0)
                        continue;
                    if (node.y + dir[d][1] > grid.height - 1 || node.y + dir[d][1] < 0)
                        continue;
                    if (!this.passDiagonal && d > 3 && grid.get(node.x + dir[d][0], node.y).solid && grid.get(node.x, node.y + dir[d][1]).solid)
                        continue;
                    var next = grid.get(node.x + dir[d][0], node.y + dir[d][1]);
                    if (next.solid && next.coord !== end)
                        continue;
                    nodes.push([next, d]);
                }
                return nodes;
            };
            return AStar;
        }());
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
    });
    define("algorithms/bfs", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
        var BFS = /** @class */ (function () {
            function BFS(options) {
                if (options === void 0) { options = {}; }
                this.diagonal = options.diagonal || false;
                this.heuristic = options.heuristic || "manhattan";
                this.passDiagonal = options.passDiagonal || false;
                this.bidirectional = options.bidirectional || false;
            }
            BFS.prototype.findPath = function (start, end, grid) {
                var _this = this;
                if (this.bidirectional)
                    return this.findPathbs(start, end, grid);
                var current = grid.get(start.x, start.y);
                var open = [current];
                var closed = [];
                var came_from = {};
                var cost_so_far = {};
                var neighbours = [];
                var sc = start.x + ":" + start.y;
                var ec = end.x + ":" + end.y;
                cost_so_far[sc] = 0;
                while (open.length > 0) {
                    closed.push(current);
                    current = open.pop();
                    if (current.coord === ec) { // finished
                        var path = [];
                        var nodes = [];
                        while (current.coord != sc) {
                            path.push({ x: current.x, y: current.y });
                            nodes.push(current);
                            current = came_from[current.coord];
                        }
                        path.push({ x: start.x, y: start.y });
                        nodes.push(grid.get(start.x, start.y));
                        path.reverse();
                        nodes.reverse();
                        var length_2 = path.length;
                        return { path: path, nodes: nodes, open: open, closed: closed, length: length_2 };
                    }
                    neighbours = this.getNeighbours(current, ec, grid);
                    neighbours.forEach(function (n, index) {
                        var next = n[0];
                        var new_cost = _this.hvalue(end, next);
                        if (cost_so_far[next.coord] === undefined || new_cost < cost_so_far[next.coord]) {
                            cost_so_far[next.coord] = new_cost;
                            came_from[next.coord] = current;
                            //@ts-ignore
                            open.insertSorted(next, function (b, a) {
                                return cost_so_far[a.coord] - cost_so_far[b.coord];
                            });
                        }
                    });
                }
                return { path: [], nodes: [], open: open, closed: closed, length: 0 };
            };
            BFS.prototype.findPathbs = function (start, end, grid) {
                var _this = this;
                var current = [grid.get(start.x, start.y), grid.get(end.x, end.y)];
                var open = [[], []];
                var closed = [];
                var cost_so_far = [{}, {}];
                var came_from = [{}, {}];
                var neighbours = [[], []];
                var sc = start.x + ":" + start.y;
                var ec = end.x + ":" + end.y;
                cost_so_far[0][sc] = 0;
                cost_so_far[1][ec] = 0;
                open = [[grid.get(start.x, start.y)], [grid.get(end.x, end.y)]];
                while (open[0].length > 0 && open[1].length > 0) {
                    closed.push(current[0], current[1]);
                    current = [open[0].pop(), open[1].pop()];
                    if (came_from[0][current[1].coord] !== undefined || came_from[1][current[0].coord] !== undefined) {
                        var d = Number(came_from[0][current[1].coord] !== undefined);
                        var path = [];
                        var nodes = [];
                        var path2 = [];
                        var connecting = { x: current[d].x, y: current[d].y };
                        while (current[d]) {
                            path.push({ x: current[d].x, y: current[d].y });
                            current[d] = came_from[1 - d][current[d].coord];
                        }
                        current[1 - d] = grid.get(connecting.x, connecting.y);
                        while (current[1 - d]) {
                            path2.push({ x: current[1 - d].x, y: current[1 - d].y });
                            current[1 - d] = came_from[d][current[1 - d].coord];
                        }
                        path.reverse();
                        path.push.apply(path, path2);
                        var newOpen_2 = [];
                        newOpen_2.push.apply(newOpen_2, open[0]);
                        newOpen_2.push.apply(newOpen_2, open[1]);
                        return { path: path, nodes: [], open: newOpen_2, closed: closed, length: 0 };
                    }
                    neighbours = [this.getNeighbours(current[0], ec, grid), this.getNeighbours(current[1], sc, grid)];
                    neighbours.forEach(function (direction, d) {
                        direction.forEach(function (n) {
                            var next = n[0];
                            var new_cost = _this.hvalue(d == 0 ? end : start, next);
                            if (cost_so_far[d][next.coord] === undefined || new_cost < cost_so_far[d][next.coord]) {
                                cost_so_far[d][next.coord] = new_cost;
                                came_from[d][next.coord] = current[d];
                                //@ts-ignore
                                open[d].insertSorted(next, function (b, a) {
                                    return cost_so_far[d][a.coord] - cost_so_far[d][b.coord];
                                });
                            }
                            ;
                        });
                    });
                }
                var newOpen = [];
                newOpen.push.apply(newOpen, open[0]);
                newOpen.push.apply(newOpen, open[1]);
                return { path: [], nodes: [], open: newOpen, closed: closed, length: 0 };
            };
            BFS.prototype.hvalue = function (end, node) {
                var result = 0;
                // if(this.diagonal) {
                if (this.heuristic == "octile") {
                    var D = 1;
                    var D2 = Math.SQRT2;
                    var dx = Math.abs(node.x - end.x);
                    var dy = Math.abs(node.y - end.y);
                    result = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
                }
                else if (this.heuristic == "eucledian") {
                    var D = 1;
                    var dx = Math.abs(node.x - end.x);
                    var dy = Math.abs(node.y - end.y);
                    result = D * Math.sqrt(dx * dx + dy * dy);
                }
                else if (this.heuristic == "chebyshev") {
                    var D = 1;
                    var D2 = 1;
                    var dx = Math.abs(node.x - end.x);
                    var dy = Math.abs(node.y - end.y);
                    result = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
                }
                // }
                else {
                    result = Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
                }
                return result;
            };
            BFS.prototype.getNeighbours = function (node, end, grid) {
                var nodes = [];
                var dir = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
                for (var d = 0; d < (this.diagonal ? 8 : 4); d++) {
                    if (node.x + dir[d][0] > grid.width - 1 || node.x + dir[d][0] < 0)
                        continue;
                    if (node.y + dir[d][1] > grid.height - 1 || node.y + dir[d][1] < 0)
                        continue;
                    if (!this.passDiagonal && d > 3 && grid.get(node.x + dir[d][0], node.y).solid && grid.get(node.x, node.y + dir[d][1]).solid)
                        continue;
                    var next = grid.get(node.x + dir[d][0], node.y + dir[d][1]);
                    if (next.solid && next.coord !== end)
                        continue;
                    nodes.push([next, d]);
                }
                return nodes;
            };
            return BFS;
        }());
        exports.BFS = BFS;
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
    });
    define("algorithms/dijkstra", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
        var Dijkstra = /** @class */ (function () {
            function Dijkstra(options) {
                if (options === void 0) { options = {}; }
                this.diagonalCost = 1;
                this.diagonal = options.diagonal || false;
                this.passDiagonal = options.passDiagonal || false;
                if (options.smoothenPath)
                    this.diagonalCost = Math.SQRT2;
                this.bidirectional = options.bidirectional || false;
            }
            Dijkstra.prototype.findPath = function (start, end, grid) {
                var _this = this;
                if (this.bidirectional)
                    return this.findPathbs(start, end, grid);
                var current = grid.get(start.x, start.y);
                var open = [current];
                var closed = [];
                var came_from = {};
                var cost_so_far = {};
                var neighbours = [];
                var sc = start.x + ":" + start.y;
                var ec = end.x + ":" + end.y;
                cost_so_far[sc] = 0;
                while (open.length > 0) {
                    closed.push(current);
                    current = open.pop();
                    if (current.coord === ec) { // finished
                        var path = [];
                        var nodes = [];
                        while (current.coord != sc) {
                            path.push({ x: current.x, y: current.y });
                            nodes.push(current);
                            current = came_from[current.coord];
                        }
                        path.push({ x: start.x, y: start.y });
                        nodes.push(grid.get(start.x, start.y));
                        path.reverse();
                        nodes.reverse();
                        var length_3 = path.length;
                        return { path: path, nodes: nodes, open: open, closed: closed, length: length_3 };
                    }
                    neighbours = this.getNeighbours(current, ec, grid);
                    neighbours.forEach(function (n) {
                        var next = n[0];
                        var new_cost = cost_so_far[current.coord] + next.movementCost + (n[1] > 3 ? _this.diagonalCost - 1 : 0);
                        if (cost_so_far[next.coord] === undefined || new_cost < cost_so_far[next.coord]) {
                            cost_so_far[next.coord] = new_cost;
                            came_from[next.coord] = current;
                            //@ts-ignore
                            open.insertSorted(next, function (b, a) {
                                return cost_so_far[a.coord] - cost_so_far[b.coord];
                            });
                        }
                    });
                }
                return { path: [], nodes: [], open: open, closed: closed, length: 0 };
            };
            Dijkstra.prototype.findPathbs = function (start, end, grid) {
                var _this = this;
                var current = [grid.get(start.x, start.y), grid.get(end.x, end.y)];
                var open = [[], []];
                var closed = [];
                var cost_so_far = [{}, {}];
                var came_from = [{}, {}];
                var neighbours = [[], []];
                var sc = start.x + ":" + start.y;
                var ec = end.x + ":" + end.y;
                cost_so_far[0][sc] = 0;
                cost_so_far[1][ec] = 0;
                open = [[grid.get(start.x, start.y)], [grid.get(end.x, end.y)]];
                while (open[0].length > 0 && open[1].length > 0) {
                    closed.push(current[0], current[1]);
                    current = [open[0].pop(), open[1].pop()];
                    if (came_from[0][current[1].coord] !== undefined || came_from[1][current[0].coord] !== undefined) {
                        var d = Number(came_from[0][current[1].coord] !== undefined);
                        var path = [];
                        var nodes = [];
                        var path2 = [];
                        var connecting = { x: current[d].x, y: current[d].y };
                        while (current[d]) {
                            path.push({ x: current[d].x, y: current[d].y });
                            current[d] = came_from[1 - d][current[d].coord];
                        }
                        current[1 - d] = grid.get(connecting.x, connecting.y);
                        while (current[1 - d]) {
                            path2.push({ x: current[1 - d].x, y: current[1 - d].y });
                            current[1 - d] = came_from[d][current[1 - d].coord];
                        }
                        path.reverse();
                        path.push.apply(path, path2);
                        var newOpen_3 = [];
                        newOpen_3.push.apply(newOpen_3, open[0]);
                        newOpen_3.push.apply(newOpen_3, open[1]);
                        return { path: path, nodes: [], open: newOpen_3, closed: closed, length: 0 };
                    }
                    neighbours = [this.getNeighbours(current[0], ec, grid), this.getNeighbours(current[1], sc, grid)];
                    neighbours.forEach(function (direction, d) {
                        direction.forEach(function (n) {
                            var next = n[0];
                            var new_cost = cost_so_far[d][current[d].coord] + next.movementCost + (n[1] > 3 ? _this.diagonalCost - 1 : 0);
                            if (cost_so_far[d][next.coord] === undefined || new_cost < cost_so_far[d][next.coord]) {
                                cost_so_far[d][next.coord] = new_cost;
                                came_from[d][next.coord] = current[d];
                                //@ts-ignore
                                open[d].insertSorted(next, function (b, a) {
                                    return cost_so_far[d][a.coord] - cost_so_far[d][b.coord];
                                });
                            }
                            ;
                        });
                    });
                }
                var newOpen = [];
                newOpen.push.apply(newOpen, open[0]);
                newOpen.push.apply(newOpen, open[1]);
                return { path: [], nodes: [], open: newOpen, closed: closed, length: 0 };
            };
            Dijkstra.prototype.getNeighbours = function (node, end, grid) {
                var nodes = [];
                var dir = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
                for (var d = 0; d < (this.diagonal ? 8 : 4); d++) {
                    if (node.x + dir[d][0] > grid.width - 1 || node.x + dir[d][0] < 0)
                        continue;
                    if (node.y + dir[d][1] > grid.height - 1 || node.y + dir[d][1] < 0)
                        continue;
                    if (!this.passDiagonal && d > 3 && grid.get(node.x + dir[d][0], node.y).solid && grid.get(node.x, node.y + dir[d][1]).solid)
                        continue;
                    var next = grid.get(node.x + dir[d][0], node.y + dir[d][1]);
                    if (next.solid && next.coord !== end)
                        continue;
                    nodes.push([next, d]);
                }
                return nodes;
            };
            return Dijkstra;
        }());
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
    });
    define("index", ["require", "exports", "grid", "graph", "util", "algorithms/astar", "algorithms/bfs", "algorithms/dijkstra"], function (require, exports, grid_1, graph_2, util_1, astar_1, bfs_1, dijkstra_1) {
        "use strict";
        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }
        exports.__esModule = true;
        __export(grid_1);
        __export(graph_2);
        __export(util_1);
        __export(astar_1);
        __export(bfs_1);
        __export(dijkstra_1);
    });
    
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            var dependencies = ['exports'];
            var factory = function (exports) {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies: dependencies, factory: factory };
        }
    }
    var instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        var define = get_define(name);
        instances[name] = {};
        var dependencies = define.dependencies.map(function (name) { return resolve(name); });
        define.factory.apply(define, dependencies);
        var exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports["default"] : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();