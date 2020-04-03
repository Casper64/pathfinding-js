import { Vec2 } from "./vector2"
import { Point, point } from "../util"

export class Line {
  public p1: Point;
  public p2: Point;
  public segment: Vec2;
  // Line in the from ax + by = c
  public a: number;
  public b: number;
  public c: number;

  public constructor(p1: Point, p2: Point) {
    this.p1= p1;
    this.p2 = p2;
    this.segment = new Vec2(p1, p2);
    this.update();
  }

  public update (): void {
    let p1, p2;
    if (this.p1.x > this.p2.x) {
      p1 = this.p2;
      p2 = this.p1;
    } else {
      p1 = this.p1;
      p2 = this.p2;
    }
    this.a = p2.y - p1.y;
    this.b = p1.x - p2.x;
    this.c = this.a*p2.x + this.b*p2.y;
  }

  public perpendicular () {
    let m = new Vec2(this.p1, this.p2).mid;
    let c =  -this.b*m.x + this.a*m.y;
    let a = -this.b;
    let b = this.a;
    return {a, b, c}
  }

  public bisectIntersect (l2: Line): Point {
    let l1 = this;
    let p1 = this.perpendicular();
    let p2 = l2.perpendicular();

    let D = p1.a*p2.b - p2.a*p1.b;
    // the lines are parallel
    if (D == 0) return new Point(-1, -1);
    let x = (p2.b*p1.c - p1.b*p2.c) / D;
    let y = (p1.a*p2.c - p2.a*p1.c) / D;
    return new Point(x, y);
  }

  public intersect (l2: Line): Point {
    let D = this.a*l2.b - l2.a*this.b;
    // the lines are parallel
    if (D == 0) return new Point(-1, -1);
    let x = (l2.b*this.c - this.b*l2.c) / D;
    let y = (this.a*l2.c - l2.a*this.c) / D;
    return new Point(x, y);
  }

  public on (point: Point): boolean {
    // ax + by = c
    // by = c - ax
    // y = (c/b) - (a/b)x
    if (this.b == 0) return this.p1.x == point.x;
    let y = (this.c/this.b) - (this.a/this.b)*point.x;
    return Math.fround(y) === Math.fround(point.y);
  }

}