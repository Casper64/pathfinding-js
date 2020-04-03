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
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __spreadArrays = (this && this.__spreadArrays) || function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };
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
        var Point = /** @class */ (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            Object.defineProperty(Point.prototype, "coord", {
                get: function () {
                    return this.x + ":" + this.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point.prototype, "length", {
                get: function () {
                    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point, "zero", {
                get: function () {
                    return new Point(0, 0);
                },
                enumerable: true,
                configurable: true
            });
            Point.prototype.distance = function (b) {
                return Point.sub(this, b).length;
            };
            Point.prototype.equals = function (p) {
                return this.x == p.x && this.y == p.y;
            };
            Point.prototype.add = function (p) {
                this.x += p.x;
                this.y += p.y;
                return this;
            };
            Point.prototype.sub = function (p) {
                this.x -= p.x;
                this.y -= p.y;
                return this;
            };
            Point.add = function (p1, p2) {
                return new Point(p1.x + p2.x, p1.y + p2.y);
            };
            Point.sub = function (p1, p2) {
                return new Point(p1.x - p2.x, p1.y - p2.y);
            };
            return Point;
        }());
        exports.Point = Point;
        exports.h = ["manhattan", "octile", "eucledian", "chebyshev"];
    });
    define("maths/line", ["require", "exports", "maths/vector2", "util"], function (require, exports, vector2_1, util_1) {
        "use strict";
        exports.__esModule = true;
        var Line = /** @class */ (function () {
            function Line(p1, p2) {
                this.p1 = p1;
                this.p2 = p2;
                this.segment = new vector2_1.Vec2(p1, p2);
                this.update();
            }
            Line.prototype.update = function () {
                var p1, p2;
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
            };
            Line.prototype.perpendicular = function () {
                var m = new vector2_1.Vec2(this.p1, this.p2).mid;
                var c = -this.b * m.x + this.a * m.y;
                var a = -this.b;
                var b = this.a;
                return { a: a, b: b, c: c };
            };
            Line.prototype.bisectIntersect = function (l2) {
                var l1 = this;
                var p1 = this.perpendicular();
                var p2 = l2.perpendicular();
                var D = p1.a * p2.b - p2.a * p1.b;
                // the lines are parallel
                if (D == 0)
                    return new util_1.Point(-1, -1);
                var x = (p2.b * p1.c - p1.b * p2.c) / D;
                var y = (p1.a * p2.c - p2.a * p1.c) / D;
                return new util_1.Point(x, y);
            };
            Line.prototype.intersect = function (l2) {
                var D = this.a * l2.b - l2.a * this.b;
                // the lines are parallel
                if (D == 0)
                    return new util_1.Point(-1, -1);
                var x = (l2.b * this.c - this.b * l2.c) / D;
                var y = (this.a * l2.c - l2.a * this.c) / D;
                return new util_1.Point(x, y);
            };
            Line.prototype.on = function (point) {
                // ax + by = c
                // by = c - ax
                // y = (c/b) - (a/b)x
                if (this.b == 0)
                    return this.p1.x == point.x;
                var y = (this.c / this.b) - (this.a / this.b) * point.x;
                return Math.fround(y) === Math.fround(point.y);
            };
            return Line;
        }());
        exports.Line = Line;
    });
    define("maths/vector2", ["require", "exports", "util", "maths/line"], function (require, exports, util_2, line_1) {
        "use strict";
        exports.__esModule = true;
        var Vec2 = /** @class */ (function () {
            function Vec2(p1, p2) {
                this.p1 = p1;
                this.p2 = p2;
            }
            Object.defineProperty(Vec2.prototype, "length", {
                get: function () {
                    return this.p1.distance(this.p2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec2.prototype, "mid", {
                get: function () {
                    var x = (this.p1.x + this.p2.x) / 2;
                    var y = (this.p1.y + this.p2.y) / 2;
                    return new util_2.Point(x, y);
                },
                enumerable: true,
                configurable: true
            });
            Vec2.prototype.equals = function (b) {
                var a = this;
                return (a.p1.equals(b.p1) && a.p2.equals(b.p2));
            };
            Vec2.prototype.onSegment = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var p, q, r, notEdges;
                if (args.length > 1) {
                    p = args[0];
                    q = args[1];
                    r = args[2];
                    notEdges = args[3];
                }
                else {
                    p = this.p1;
                    q = args[0];
                    r = this.p2;
                    notEdges = args[1];
                }
                if (notEdges) {
                    if (q.x < Math.max(p.x, r.x) && q.x > Math.min(p.x, r.x) && q.y < Math.max(p.y, r.y) && q.y > Math.min(p.y, r.y))
                        return true;
                }
                else if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
                    return true;
                return false;
            };
            Vec2.prototype.intersect = function (vec, notEdges) {
                if (notEdges === void 0) { notEdges = false; }
                var p1 = this.p1;
                var q1 = this.p2;
                var p2 = vec.p1;
                var q2 = vec.p2;
                var orientation = function (p, q, r) {
                    var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
                    if (val == 0)
                        return 0; // colinear 
                    return (val > 0) ? 1 : 2; // clock or counterclock wise 
                };
                // Find the four orientations needed for  
                // general and special cases 
                var o1 = orientation(p1, q1, p2);
                var o2 = orientation(p1, q1, q2);
                var o3 = orientation(p2, q2, p1);
                var o4 = orientation(p2, q2, q1);
                // console.log(o1, o2, o3, o4)
                // General case 
                if (o1 != o2 && o3 != o4) {
                    var l1 = new line_1.Line(this.p1, this.p2);
                    var l2 = new line_1.Line(vec.p1, vec.p2);
                    var intersection = l1.intersect(l2);
                    // console.log(intersection, notEdges, l1, l2 )
                    if (notEdges) {
                        if (p1.equals(intersection) || p2.equals(intersection) || q1.equals(intersection) || q2.equals(intersection))
                            return false;
                    }
                    var onSegments = l1.on(intersection) && l2.on(intersection);
                    return onSegments;
                }
                // Special Cases 
                // p1, q1 and p2 are colinear and 
                // p2 lies on segment p1q1 
                if (o1 == 0 && this.onSegment(p1, p2, q1, notEdges)) {
                    return true;
                }
                // p1, q1 and p2 are colinear and 
                // q2 lies on segment p1q1 
                if (o2 == 0 && this.onSegment(p1, q2, q1, notEdges)) {
                    return true;
                }
                // p2, q2 and p1 are colinear and 
                // p1 lies on segment p2q2 
                if (o3 == 0 && this.onSegment(p2, p1, q2, notEdges)) {
                    return true;
                }
                // p2, q2 and q1 are colinear and 
                // q1 lies on segment p2q2 
                if (o4 == 0 && this.onSegment(p2, q1, q2, notEdges)) {
                    return true;
                }
                // Doesn't fall in any of the above cases 
                return false;
            };
            Vec2.fromZero = function (p) {
                return new Vec2(util_2.Point.zero, p);
            };
            return Vec2;
        }());
        exports.Vec2 = Vec2;
    });
    define("shapes/polygon", ["require", "exports", "util", "maths/vector2"], function (require, exports, util_3, vector2_2) {
        "use strict";
        exports.__esModule = true;
        var Polygon = /** @class */ (function () {
            function Polygon(vertices, type) {
                if (type === void 0) { type = "mesh"; }
                this.vertices = vertices;
                this.type = type;
            }
            Polygon.prototype.equals = function (shape) {
                if (shape.vertices.length != this.vertices.length)
                    return false;
                var string1 = this.vertices.map(function (p) { return p; }).sort(function (a, b) { return a.length - b.length; }).map(function (p) { return p.coord; }).toString();
                var string2 = shape.vertices.map(function (p) { return p; }).sort(function (a, b) { return a.length - b.length; }).map(function (p) { return p.coord; }).toString();
                return string1 === string2;
            };
            Polygon.prototype.containsEdge = function (edge) {
                var edges = this.edges;
                var same = false;
                edges.forEach(function (ed) {
                    if (ed.p1.x == edge.p1.x && ed.p1.y == edge.p1.y && ed.p2.x == edge.p2.x && ed.p2.y == edge.p2.y)
                        same = true;
                });
                return same;
            };
            Object.defineProperty(Polygon.prototype, "sidePoints", {
                get: function () {
                    var list = [];
                    for (var i = 1; i < this.vertices.length; i++) {
                        var m = new util_3.Point((this.vertices[i - 1].x + this.vertices[i].x) / 2, (this.vertices[i - 1].y + this.vertices[i].y) / 2);
                        list.push(m);
                    }
                    list.push(new util_3.Point((this.vertices[0].x + this.vertices[this.vertices.length - 1].x) / 2, (this.vertices[0].y + this.vertices[this.vertices.length - 1].y) / 2));
                    return list;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Polygon.prototype, "boundingBox", {
                get: function () {
                    var x = this.vertices.map(function (p) { return p.x; });
                    var y = this.vertices.map(function (p) { return p.y; });
                    return [new util_3.Point(Math.min.apply(Math, x), Math.min.apply(Math, y)), new util_3.Point(Math.max.apply(Math, x), Math.max.apply(Math, y))];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Polygon.prototype, "edges", {
                get: function () {
                    var e = [];
                    for (var i = 0; i < this.vertices.length - 1; i++) {
                        e.push(new vector2_2.Vec2(this.vertices[i], this.vertices[i + 1]));
                    }
                    e.push(new vector2_2.Vec2(this.vertices[0], this.vertices[this.vertices.length - 1]));
                    return e;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Polygon.prototype, "center", {
                get: function () {
                    var x = this.vertices.map(function (v) { return v.x; }).reduce(function (acc, c) { return acc += c; });
                    var y = this.vertices.map(function (v) { return v.y; }).reduce(function (acc, c) { return acc += c; });
                    return new util_3.Point(x / this.vertices.length, y / this.vertices.length);
                },
                enumerable: true,
                configurable: true
            });
            Polygon.prototype.neigbourVertices = function (index) {
                var n = [];
                if (index == 0) {
                    n.push(this.vertices[this.vertices.length - 1]);
                    n.push(this.vertices[1]);
                }
                else if (index == this.vertices.length - 1) {
                    n.push(this.vertices[index - 1]);
                    n.push(this.vertices[0]);
                }
                else {
                    n.push(this.vertices[index - 1]);
                    n.push(this.vertices[index + 1]);
                }
                return n;
            };
            Polygon.prototype.toPath = function () {
                var result = "M" + this.vertices[0].x + "," + this.vertices[0].y;
                for (var i = 1; i < this.vertices.length; i++) {
                    result += "L" + this.vertices[i].x + "," + this.vertices[i].y;
                }
                result += "Z";
                return result;
            };
            Polygon.prototype.overlap = function (shape) {
                var _this = this;
                if (shape.vertices.every(function (v) { return _this.inside(v); }))
                    return true;
                if (shape.edges.some(function (edge) { return _this.edges.some(function (edge2) { return edge2.intersect(edge, true); }); }))
                    return true;
                return false;
            };
            Polygon.prototype.inside = function (p, onSideOnly) {
                if (onSideOnly === void 0) { onSideOnly = false; }
                // Given three colinear points p, q, r, the function checks if 
                // point q lies on line segment 'pr' 
                var onSegment = function (p, q, r) {
                    if (q.x <= Math.max(p.x, r.x) &&
                        q.x >= Math.min(p.x, r.x) &&
                        q.y <= Math.max(p.y, r.y) &&
                        q.y >= Math.min(p.y, r.y)) {
                        return true;
                    }
                    return false;
                };
                var orientation = function (p, q, r) {
                    var val = (q.y - p.y) * (r.x - q.x)
                        - (q.x - p.x) * (r.y - q.y);
                    if (val == 0) {
                        return 0; // colinear 
                    }
                    return (val > 0) ? 1 : 2; // clock or counterclock wise 
                };
                // The function that returns true if line segment 'p1q1' and 'p2q2' intersect.
                var doIntersect = function (p1, q1, p2, q2) {
                    // Find the four orientations needed for  
                    // general and special cases 
                    var o1 = orientation(p1, q1, p2);
                    var o2 = orientation(p1, q1, q2);
                    var o3 = orientation(p2, q2, p1);
                    var o4 = orientation(p2, q2, q1);
                    // General case 
                    if (o1 != o2 && o3 != o4) {
                        return true;
                    }
                    // Special Cases 
                    // p1, q1 and p2 are colinear and 
                    // p2 lies on segment p1q1 
                    if (o1 == 0 && onSegment(p1, p2, q1)) {
                        return true;
                    }
                    // p1, q1 and p2 are colinear and 
                    // q2 lies on segment p1q1 
                    if (o2 == 0 && onSegment(p1, q2, q1)) {
                        return true;
                    }
                    // p2, q2 and p1 are colinear and 
                    // p1 lies on segment p2q2 
                    if (o3 == 0 && onSegment(p2, p1, q2)) {
                        return true;
                    }
                    // p2, q2 and q1 are colinear and 
                    // q1 lies on segment p2q2 
                    if (o4 == 0 && onSegment(p2, q1, q2)) {
                        return true;
                    }
                    // Doesn't fall in any of the above cases 
                    return false;
                };
                var extreme = new util_3.Point(9999999999, p.y);
                if (onSideOnly)
                    extreme = new util_3.Point(Infinity, p.y);
                // Count intersections of the above line  
                // with sides of polygon 
                var count = 0;
                var i = 0;
                do {
                    var next = (i + 1) % this.vertices.length;
                    // Check if the line segment from 'p' to  
                    // 'extreme' intersects with the line  
                    // segment from 'polygon[i]' to 'polygon[next]' 
                    if (doIntersect(this.vertices[i], this.vertices[next], p, extreme)) {
                        // If the point 'p' is colinear with line  
                        // segment 'i-next', then check if it lies  
                        // on segment. If it lies, return true, otherwise false 
                        if (orientation(this.vertices[i], p, this.vertices[next]) == 0) {
                            return onSegment(this.vertices[i], p, this.vertices[next]);
                        }
                        count++;
                    }
                    i = next;
                } while (i != 0);
                // Return true if count is odd, false otherwise 
                return (count % 2 == 1); // Same as (count%2 == 1)
            };
            Polygon.prototype.containTwo = function (vertices) {
                var joined = [];
                joined.push.apply(joined, vertices);
                joined.push.apply(joined, this.vertices);
                var s = new Set(joined);
                if (joined.length - s.size == 2)
                    return true;
                else
                    return false;
            };
            return Polygon;
        }());
        exports.Polygon = Polygon;
        function shoelace(v) {
            var area = 0;
            var sum1 = 0;
            var sum2 = 0;
            for (var i = 0; i < v.length - 1; i++) {
                sum1 += v[i].x * v[i + 1].y;
                sum2 += v[i + 1].x * v[i].y;
            }
            sum1 += v[v.length - 1].x * v[0].y;
            sum2 += v[0].x * v[v.length - 1].y;
            area = Math.abs(sum1 - sum2) / 2;
            return area;
        }
    });
    define("shapes/triangle", ["require", "exports", "shapes/polygon", "maths/line"], function (require, exports, polygon_1, line_2) {
        "use strict";
        exports.__esModule = true;
        var Triangle = /** @class */ (function (_super) {
            __extends(Triangle, _super);
            function Triangle(vertices) {
                var _this = this;
                if (vertices.length != 3)
                    throw new Error("Triangle with not 3 vertices was created!");
                vertices.sort(function (a, b) { return a.length - b.length; });
                _this = _super.call(this, vertices, "triangle") || this;
                return _this;
            }
            Object.defineProperty(Triangle.prototype, "circumcircle", {
                get: function () {
                    var P = this.vertices[0];
                    var Q = this.vertices[1];
                    var R = this.vertices[2];
                    var l1 = new line_2.Line(P, Q);
                    var l2 = new line_2.Line(Q, R);
                    var center = l1.bisectIntersect(l2);
                    var radius = center.distance(P);
                    return { center: center, radius: radius };
                },
                enumerable: true,
                configurable: true
            });
            Triangle.prototype.insideCircumcircle = function (point) {
                var _a = this.circumcircle, center = _a.center, radius = _a.radius;
                var distance = point.distance(center);
                return distance <= radius;
            };
            return Triangle;
        }(polygon_1.Polygon));
        exports.Triangle = Triangle;
    });
    define("mesh/mesh-grid", ["require", "exports", "util", "graph", "shapes/triangle"], function (require, exports, util_4, graph_2, triangle_1) {
        "use strict";
        exports.__esModule = true;
        var MeshGrid = /** @class */ (function () {
            function MeshGrid(meshes, mapOutline) {
                this.map = {};
                this.meshes = meshes;
                this.convexHull = mapOutline;
            }
            MeshGrid.prototype.get = function (point) {
                return this.map[point.coord];
            };
            MeshGrid.prototype.generateMap = function () {
                var _this = this;
                this.map = {};
                var points = [];
                this.meshes.forEach(function (m) {
                    points.push.apply(points, m.vertices);
                    points.push(m.center);
                });
                points.push.apply(points, this.convexHull);
                var triangulation = this.BowyerWatson(points); // delauney triangles
                //remove triangles who lay within obstacles
                for (var i = 0; i < triangulation.length; i++) {
                    var t = triangulation[i];
                    for (var j = 0; j < this.meshes.length; j++) {
                        if (this.meshes[j].overlap(t)) {
                            triangulation.splice(i, 1);
                            i--;
                        }
                    }
                }
                //#region shit
                triangulation.forEach(function (t) {
                    t.vertices.forEach(function (v) {
                        var _a;
                        var n = [];
                        var sp = t.sidePoints.sort(function (a, b) { return new util_4.Point(a.x - v.x, a.y - v.y).length - new util_4.Point(b.x - v.x, b.y - v.y).length; });
                        n.push(new graph_2.Graph(sp[0].x, sp[0].y, false, sp[0].distance(v)));
                        n.push(new graph_2.Graph(sp[1].x, sp[1].y, false, sp[1].distance(v)));
                        n.push(new graph_2.Graph(sp[2].x, sp[2].y, false, sp[2].distance(v)));
                        var vt = t.vertices.sort(function (a, b) { return new util_4.Point(a.x - v.x, a.y - v.y).length - new util_4.Point(b.x - v.x, b.y - v.y).length; });
                        n.push(new graph_2.Graph(vt[0].x, vt[0].y, false, vt[0].distance(v)));
                        n.push(new graph_2.Graph(vt[1].x, vt[1].y, false, vt[1].distance(v)));
                        n.push(new graph_2.Graph(vt[2].x, vt[2].y, false, vt[2].distance(v)));
                        if (_this.map[v.coord] === undefined) {
                            _this.map[v.coord] = {
                                node: v,
                                neighbours: __spreadArrays(n)
                            };
                        }
                        else {
                            (_a = _this.map[v.coord].neighbours).push.apply(_a, n);
                        }
                    });
                    t.sidePoints.forEach(function (v) {
                        var _a;
                        var n = [];
                        var vt = t.vertices.sort(function (a, b) { return new util_4.Point(a.x - v.x, a.y - v.y).length - new util_4.Point(b.x - v.x, b.y - v.y).length; });
                        n.push(new graph_2.Graph(vt[0].x, vt[0].y, false, vt[0].distance(v)));
                        n.push(new graph_2.Graph(vt[1].x, vt[1].y, false, vt[1].distance(v)));
                        n.push(new graph_2.Graph(vt[2].x, vt[2].y, false, vt[2].distance(v)));
                        var sp = t.sidePoints.sort(function (a, b) { return new util_4.Point(a.x - v.x, a.y - v.y).length - new util_4.Point(b.x - v.x, b.y - v.y).length; });
                        n.push(new graph_2.Graph(sp[0].x, sp[0].y, false, sp[0].distance(v)));
                        n.push(new graph_2.Graph(sp[1].x, sp[1].y, false, sp[1].distance(v)));
                        n.push(new graph_2.Graph(sp[2].x, sp[2].y, false, sp[2].distance(v)));
                        if (_this.map[v.coord] === undefined) {
                            _this.map[v.coord] = {
                                node: v,
                                neighbours: __spreadArrays(n)
                            };
                        }
                        else {
                            (_a = _this.map[v.coord].neighbours).push.apply(_a, n);
                        }
                    });
                });
                Object.keys(this.map).forEach(function (key) {
                    var done = [];
                    _this.map[key].neighbours = _this.map[key].neighbours.filter(function (n) {
                        for (var i = 0; i < done.length; i++) {
                            if (done[i] === n.coord)
                                return false;
                        }
                        done.push(n.coord);
                        return true;
                    });
                });
                points.length = 0;
                this.meshes.forEach(function (mesh) {
                    mesh.vertices.forEach(function (v, index) {
                        var neighbours = mesh.neigbourVertices(index);
                        if (_this.map[v.coord] === undefined) {
                            _this.map[v.coord] = {
                                neighbours: [],
                                node: v
                            };
                        }
                        var mapNeighbours = _this.map[v.coord].neighbours.map(function (n) { return n.coord; });
                        neighbours.forEach(function (n) {
                            if (!mapNeighbours.includes(n.coord)) {
                                var graph = new graph_2.Graph(n.x, n.y, false, v.distance(n));
                                _this.map[v.coord].neighbours.push(graph);
                            }
                        });
                    });
                });
                Object.keys(this.map).forEach(function (key, index) {
                    points.push(_this.map[key].node);
                });
                //#endregion
                return { triangulation: triangulation, points: points };
            };
            MeshGrid.prototype.BowyerWatson = function (points) {
                var triangulation = [];
                var superTriangle = this.smallestTriangle;
                triangulation.push(superTriangle);
                points.forEach(function (p, testIndex) {
                    // if (testIndex == 1) console.log(...triangulation);
                    var badTriangles = [];
                    triangulation.forEach(function (t) {
                        if (t.insideCircumcircle(p)) {
                            badTriangles.push(t);
                        }
                    });
                    var polygon = [];
                    badTriangles.forEach(function (bt, btIndex) {
                        bt.edges.forEach(function (edge) {
                            for (var i = 0; i < badTriangles.length; i++) {
                                if (i == btIndex)
                                    continue;
                                if (badTriangles[i].containsEdge(edge))
                                    return;
                            }
                            polygon.push(edge);
                        });
                    });
                    for (var i = 0; i < badTriangles.length; i++) {
                        var bt = badTriangles[i];
                        for (var j = 0; j < triangulation.length; j++) {
                            var t = triangulation[j];
                            if (t.equals(bt)) {
                                triangulation.splice(j, 1);
                                j--;
                            }
                        }
                    }
                    polygon.forEach(function (edge) {
                        var nt = new triangle_1.Triangle([p, edge.p1, edge.p2]);
                        triangulation.push(nt);
                    });
                });
                var p0 = superTriangle.vertices[0];
                var p1 = superTriangle.vertices[1];
                var p2 = superTriangle.vertices[2];
                for (var i = 0; i < triangulation.length; i++) {
                    var t = triangulation[i];
                    for (var j = 0; j < 3; j++) {
                        var v = t.vertices[j];
                        if ((v.x == p0.x && v.y == p0.y) || (v.x == p1.x && v.y == p1.y) || (v.x == p2.x && v.y == p2.y)) {
                            triangulation.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
                return triangulation;
            };
            Object.defineProperty(MeshGrid.prototype, "smallestTriangle", {
                get: function () {
                    var temp = [];
                    temp.push.apply(temp, this.convexHull);
                    var closest = temp.sort(function (a, b) {
                        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
                    })[0];
                    var highest = temp.sort(function (a, b) { return a.y - b.y; })[0];
                    var lowest = temp.sort(function (a, b) { return b.y - a.y; })[0];
                    var furthest = temp.sort(function (a, b) { return b.x - a.x; })[0];
                    var p0 = new util_4.Point(0, 0);
                    var p1 = new util_4.Point(2 * furthest.x, highest.y);
                    var p2 = new util_4.Point(p0.x, 2 * lowest.y);
                    return new triangle_1.Triangle([p0, p1, p2]);
                },
                enumerable: true,
                configurable: true
            });
            return MeshGrid;
        }());
        exports.MeshGrid = MeshGrid;
    });
    define("algorithms/astar", ["require", "exports", "util", "maths/vector2"], function (require, exports, util_5, vector2_3) {
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
            AStar.prototype.findPathMesh = function (sp, ep, grid) {
                var _this = this;
                this.heuristic = 'octile';
                var start = Object.keys(grid.map).map(function (key) { return grid.map[key].node; }).sort(function (a, b) { return _this.hvalue(sp, a) - _this.hvalue(sp, b); })[0];
                var end = Object.keys(grid.map).map(function (key) { return grid.map[key].node; }).sort(function (a, b) { return _this.hvalue(ep, a) - _this.hvalue(ep, b); })[0];
                var current = grid.map[start.coord].node;
                var open = [current]; // All the nodes that are open for examination
                var closed = []; // All the nodes that are examined
                var f_score = {}; // The movement cost g(x) + heuristic value h(x, end)
                var cost_so_far = {}; // the movement cost in total g(x)
                var came_from = {}; // hasmap to store where every node came from
                var neighbours = [];
                f_score[start.coord] = 0;
                cost_so_far[start.coord] = 0;
                while (open.length > 0) {
                    closed.push(current);
                    current = open.pop();
                    if (current.coord === end.coord) { // finished
                        var path = [];
                        while (current.coord != start.coord) {
                            path.push(current);
                            current = came_from[current.coord];
                        }
                        path.push(start);
                        // path.splice(0, 0, end);
                        // for (let i = 0; i < path.length; i++) {
                        //   current = new Point(path[i].x, path[i].y);
                        //   let corner = false;
                        //   grid.meshes.forEach(m => {
                        //     m.vertices.forEach(v => {
                        //       if (current.equals(v)) corner = true;
                        //     });
                        //   });
                        //   if (!corner) { // define better
                        //     path.splice(i, 1);
                        //     i--;
                        //   }          
                        // }
                        // console.log(...path)
                        path.push(sp);
                        path.splice(0, 0, ep);
                        var prev = undefined;
                        var _loop_1 = function (i) {
                            current = new util_5.Point(path[i].x, path[i].y);
                            if (i + 2 >= path.length)
                                return out_i_1 = i, "break";
                            var next = new util_5.Point(path[i + 2].x, path[i + 2].y);
                            var vec = new vector2_3.Vec2(current, next);
                            if (grid.meshes.every(function (mesh) { return mesh.edges.every(function (edge) {
                                return !edge.intersect(vec, true) && !mesh.sidePoints.some(function (sp) { return sp.equals(vec.p1) || sp.equals(vec.p2); });
                            }); })) {
                                var evaluating_1 = path[i + 1];
                                if (prev != undefined && grid.meshes.some(function (mesh) { return (mesh.vertices.some(function (v) { return v.equals(evaluating_1); })) || mesh.sidePoints.some(function (v) { return v.equals(evaluating_1); }); })
                                    && grid.meshes.some(function (mesh) { return (mesh.vertices.some(function (v) { return v.equals(next); })) || mesh.sidePoints.some(function (v) { return v.equals(next); }); })) {
                                    prev = current;
                                    return out_i_1 = i, "continue";
                                }
                                prev = path.splice(i + 1, 1)[0];
                                i--;
                            }
                            else
                                prev = current;
                            out_i_1 = i;
                        };
                        var out_i_1;
                        for (var i = 0; i < path.length; i++) {
                            var state_1 = _loop_1(i);
                            i = out_i_1;
                            if (state_1 === "break")
                                break;
                        }
                        path.push(sp);
                        path.reverse();
                        path.push(ep);
                        if (grid.meshes.every(function (mesh) { return mesh.edges.every(function (edge) { return !edge.intersect(new vector2_3.Vec2(sp, ep), true); }); }))
                            path = [sp, ep];
                        var length_2 = path.length;
                        return { path: path, open: open, closed: closed, length: length_2 };
                    }
                    neighbours = grid.get(current).neighbours;
                    neighbours.forEach(function (next) {
                        var new_cost = cost_so_far[current.coord] + next.movementCost;
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
                        var length_3 = path.length;
                        return { path: path, nodes: nodes, open: open, closed: closed, length: length_3 };
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
                        var length_4 = path.length;
                        return { path: path, nodes: nodes, open: open, closed: closed, length: length_4 };
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
    define("index", ["require", "exports", "grid", "graph", "util", "algorithms/astar", "algorithms/bfs", "algorithms/dijkstra", "mesh/mesh-grid", "./shapes", "./maths"], function (require, exports, grid_1, graph_3, util_6, astar_1, bfs_1, dijkstra_1, mesh_grid_1, Shapes, Math) {
        "use strict";
        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }
        exports.__esModule = true;
        __export(grid_1);
        __export(graph_3);
        __export(util_6);
        __export(astar_1);
        __export(bfs_1);
        __export(dijkstra_1);
        __export(mesh_grid_1);
        exports.Shapes = Shapes;
        exports.Math = Math;
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