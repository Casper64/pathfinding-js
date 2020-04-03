"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polygon_1 = require("./polygon");
const line_1 = require("../maths/line");
class Triangle extends polygon_1.Polygon {
    constructor(vertices) {
        if (vertices.length != 3)
            throw new Error("Triangle with not 3 vertices was created!");
        vertices.sort((a, b) => a.length - b.length);
        super(vertices, "triangle");
    }
    get circumcircle() {
        let P = this.vertices[0];
        let Q = this.vertices[1];
        let R = this.vertices[2];
        let l1 = new line_1.Line(P, Q);
        let l2 = new line_1.Line(Q, R);
        let center = l1.bisectIntersect(l2);
        let radius = center.distance(P);
        return { center, radius };
    }
    insideCircumcircle(point) {
        const { center, radius } = this.circumcircle;
        let distance = point.distance(center);
        return distance <= radius;
    }
}
exports.Triangle = Triangle;
