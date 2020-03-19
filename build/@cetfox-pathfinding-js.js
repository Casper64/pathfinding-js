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
            return Grid;
        }());
        exports.Grid = Grid;
    });
    define("util", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
    });
    define("algorithms/astar", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
        var h = ["manhattan", "octile", "eucledian", "chebyshev"];
        var AStar = /** @class */ (function () {
            function AStar(options) {
                if (options === void 0) { options = {}; }
                this.diagonalCost = 1;
                this.diagonal = options.diagonal || false;
                this.heuristic = options.heuristic || "manhattan";
                this.smooth = options.smoothenPath || false;
                this.passDiagonal = options.passDiagonal || false;
                if (this.smooth)
                    this.diagonalCost = Math.SQRT2;
            }
            AStar.prototype.findPath = function (start, end, grid) {
                var _this = this;
                var current = grid.get(start.x, start.y);
                var open = [current];
                var closed = [];
                var f_score = {};
                var cost_so_far = {};
                var came_from = {};
                var neighbours = [];
                var sc = start.x + ":" + start.y;
                var ec = end.x + ":" + end.y;
                f_score[sc] = 0;
                cost_so_far[sc] = 0;
                while (true) {
                    closed.push(current);
                    if (open.length > 0) {
                        current = open.pop();
                        if (current.coord === ec) { // finished
                            var path = [];
                            var nodes = [];
                            var index = 0;
                            while (current.coord != sc) {
                                path.push({ x: current.x, y: current.y });
                                nodes.push(current);
                                current = came_from[current.coord];
                                index++;
                            }
                            path.push({ x: start.x, y: start.y });
                            nodes.push(grid.get(start.x, start.y));
                            path.reverse();
                            nodes.reverse();
                            var length_1 = path.length;
                            return { path: path, nodes: nodes, open: open, closed: closed, length: length_1 };
                        }
                        neighbours = this.getNeighbours(current, ec, grid);
                    }
                    else { // failed
                        console.log('failed!');
                        return { path: [], nodes: [], open: open, closed: closed, length: 0 };
                    }
                    neighbours.forEach(function (n, index) {
                        var next = n[0];
                        var new_cost = cost_so_far[current.coord] + next.movementCost + (n[1] > 3 ? _this.diagonalCost - 1 : 0);
                        if (cost_so_far[next.coord] === undefined || new_cost < cost_so_far[next.coord]) {
                            var h_1 = _this.hvalue(end, next);
                            cost_so_far[next.coord] = new_cost;
                            f_score[next.coord] = new_cost + h_1;
                            came_from[next.coord] = current;
                            //@ts-ignore
                            open.insertSorted(next, function (b, a) {
                                return f_score[a.coord] - f_score[b.coord];
                            });
                        }
                    });
                }
            };
            AStar.prototype.hvalue = function (end, node) {
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
    define("index", ["require", "exports", "grid", "graph", "algorithms/astar"], function (require, exports, grid_1, graph_2, astar_1) {
        "use strict";
        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }
        exports.__esModule = true;
        __export(grid_1);
        __export(graph_2);
        __export(astar_1);
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