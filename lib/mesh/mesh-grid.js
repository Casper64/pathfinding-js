"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const graph_1 = require("../graph");
const triangle_1 = require("../shapes/triangle");
class MeshGrid {
    constructor(meshes, mapOutline) {
        this.map = {};
        this.meshes = meshes;
        this.convexHull = mapOutline;
    }
    get(point) {
        return this.map[point.coord];
    }
    generateMap() {
        this.map = {};
        let points = [];
        this.meshes.forEach(m => {
            points.push(...m.vertices);
            points.push(m.center);
        });
        points.push(...this.convexHull);
        let triangulation = this.BowyerWatson(points); // delauney triangles
        //remove triangles who lay within obstacles
        for (let i = 0; i < triangulation.length; i++) {
            let t = triangulation[i];
            for (let j = 0; j < this.meshes.length; j++) {
                if (this.meshes[j].overlap(t)) {
                    triangulation.splice(i, 1);
                    i--;
                }
            }
        }
        //#region shit
        triangulation.forEach(t => {
            t.vertices.forEach(v => {
                let n = [];
                let sp = t.sidePoints.sort((a, b) => new util_1.Point(a.x - v.x, a.y - v.y).length - new util_1.Point(b.x - v.x, b.y - v.y).length);
                n.push(new graph_1.Graph(sp[0].x, sp[0].y, false, sp[0].distance(v)));
                n.push(new graph_1.Graph(sp[1].x, sp[1].y, false, sp[1].distance(v)));
                n.push(new graph_1.Graph(sp[2].x, sp[2].y, false, sp[2].distance(v)));
                let vt = t.vertices.sort((a, b) => new util_1.Point(a.x - v.x, a.y - v.y).length - new util_1.Point(b.x - v.x, b.y - v.y).length);
                n.push(new graph_1.Graph(vt[0].x, vt[0].y, false, vt[0].distance(v)));
                n.push(new graph_1.Graph(vt[1].x, vt[1].y, false, vt[1].distance(v)));
                n.push(new graph_1.Graph(vt[2].x, vt[2].y, false, vt[2].distance(v)));
                if (this.map[v.coord] === undefined) {
                    this.map[v.coord] = {
                        node: v,
                        neighbours: [...n]
                    };
                }
                else {
                    this.map[v.coord].neighbours.push(...n);
                }
            });
            t.sidePoints.forEach(v => {
                let n = [];
                let vt = t.vertices.sort((a, b) => new util_1.Point(a.x - v.x, a.y - v.y).length - new util_1.Point(b.x - v.x, b.y - v.y).length);
                n.push(new graph_1.Graph(vt[0].x, vt[0].y, false, vt[0].distance(v)));
                n.push(new graph_1.Graph(vt[1].x, vt[1].y, false, vt[1].distance(v)));
                n.push(new graph_1.Graph(vt[2].x, vt[2].y, false, vt[2].distance(v)));
                let sp = t.sidePoints.sort((a, b) => new util_1.Point(a.x - v.x, a.y - v.y).length - new util_1.Point(b.x - v.x, b.y - v.y).length);
                n.push(new graph_1.Graph(sp[0].x, sp[0].y, false, sp[0].distance(v)));
                n.push(new graph_1.Graph(sp[1].x, sp[1].y, false, sp[1].distance(v)));
                n.push(new graph_1.Graph(sp[2].x, sp[2].y, false, sp[2].distance(v)));
                if (this.map[v.coord] === undefined) {
                    this.map[v.coord] = {
                        node: v,
                        neighbours: [...n]
                    };
                }
                else {
                    this.map[v.coord].neighbours.push(...n);
                }
            });
        });
        Object.keys(this.map).forEach(key => {
            let done = [];
            this.map[key].neighbours = this.map[key].neighbours.filter(n => {
                for (let i = 0; i < done.length; i++) {
                    if (done[i] === n.coord)
                        return false;
                }
                done.push(n.coord);
                return true;
            });
        });
        points.length = 0;
        this.meshes.forEach(mesh => {
            mesh.vertices.forEach((v, index) => {
                let neighbours = mesh.neigbourVertices(index);
                if (this.map[v.coord] === undefined) {
                    this.map[v.coord] = {
                        neighbours: [],
                        node: v
                    };
                }
                let mapNeighbours = this.map[v.coord].neighbours.map(n => n.coord);
                neighbours.forEach(n => {
                    if (!mapNeighbours.includes(n.coord)) {
                        let graph = new graph_1.Graph(n.x, n.y, false, v.distance(n));
                        this.map[v.coord].neighbours.push(graph);
                    }
                });
            });
        });
        Object.keys(this.map).forEach((key, index) => {
            points.push(this.map[key].node);
        });
        //#endregion
        return { triangulation, points };
    }
    BowyerWatson(points) {
        let triangulation = [];
        let superTriangle = this.smallestTriangle;
        triangulation.push(superTriangle);
        points.forEach((p, testIndex) => {
            // if (testIndex == 1) console.log(...triangulation);
            let badTriangles = [];
            triangulation.forEach(t => {
                if (t.insideCircumcircle(p)) {
                    badTriangles.push(t);
                }
            });
            let polygon = [];
            badTriangles.forEach((bt, btIndex) => {
                bt.edges.forEach(edge => {
                    for (let i = 0; i < badTriangles.length; i++) {
                        if (i == btIndex)
                            continue;
                        if (badTriangles[i].containsEdge(edge))
                            return;
                    }
                    polygon.push(edge);
                });
            });
            for (let i = 0; i < badTriangles.length; i++) {
                let bt = badTriangles[i];
                for (let j = 0; j < triangulation.length; j++) {
                    let t = triangulation[j];
                    if (t.equals(bt)) {
                        triangulation.splice(j, 1);
                        j--;
                    }
                }
            }
            polygon.forEach(edge => {
                let nt = new triangle_1.Triangle([p, edge.p1, edge.p2]);
                triangulation.push(nt);
            });
        });
        let p0 = superTriangle.vertices[0];
        let p1 = superTriangle.vertices[1];
        let p2 = superTriangle.vertices[2];
        for (let i = 0; i < triangulation.length; i++) {
            let t = triangulation[i];
            for (let j = 0; j < 3; j++) {
                let v = t.vertices[j];
                if ((v.x == p0.x && v.y == p0.y) || (v.x == p1.x && v.y == p1.y) || (v.x == p2.x && v.y == p2.y)) {
                    triangulation.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
        return triangulation;
    }
    get smallestTriangle() {
        let temp = [];
        temp.push(...this.convexHull);
        let closest = temp.sort((a, b) => {
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        })[0];
        let highest = temp.sort((a, b) => a.y - b.y)[0];
        let lowest = temp.sort((a, b) => b.y - a.y)[0];
        let furthest = temp.sort((a, b) => b.x - a.x)[0];
        let p0 = new util_1.Point(0, 0);
        let p1 = new util_1.Point(2 * furthest.x, highest.y);
        let p2 = new util_1.Point(p0.x, 2 * lowest.y);
        return new triangle_1.Triangle([p0, p1, p2]);
    }
}
exports.MeshGrid = MeshGrid;
