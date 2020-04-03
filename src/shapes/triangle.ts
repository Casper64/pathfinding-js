import { Point } from "../util"
import { Polygon } from "./polygon"
import { Line } from "../maths/line"


export class Triangle extends Polygon {
  constructor (vertices: Point[]) {
    if (vertices.length != 3) throw new Error("Triangle with not 3 vertices was created!");
    vertices.sort((a, b) => a.length - b.length);
    super(vertices, "triangle");
  }

  get circumcircle () {
    let P = this.vertices[0];
    let Q = this.vertices[1];
    let R = this.vertices[2];
    let l1 = new Line(P, Q);
    let l2 = new Line(Q, R);
    let center = l1.bisectIntersect(l2); 
    let radius = center.distance(P);
    return {center, radius};
  }

  public insideCircumcircle (point: Point): boolean {
    const {center, radius} = this.circumcircle;
    let distance = point.distance(center);
    return distance <= radius;
  }
}