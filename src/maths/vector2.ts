import { Point } from "../util";
import { Line } from "./line";

export class Vec2 {
  public p1: Point;
  public p2: Point;

  constructor (p1: Point, p2: Point) {
    this.p1= p1;
    this.p2 = p2;
  }

  get length (): number {
    return this.p1.distance(this.p2);
  }

  get mid (): Point {
    let x = (this.p1.x + this.p2.x) / 2;
    let y = (this.p1.y + this.p2.y) / 2;
    return new Point(x, y);
  }

  public equals (b: Vec2): boolean {
    let a = this;
    return (a.p1.equals(b.p1) && a.p2.equals(b.p2));
  }

  public onSegment (p: Point, q: Point, r: Point, notEdges: boolean): boolean;
  public onSegment (q: Point, notEdges: boolean): boolean;
  public onSegment(...args: any[]): boolean {
    let p: Point, q: Point, r: Point, notEdges: boolean;
    if (args.length > 1) {
      p = args[0];
      q = args[1];
      r = args[2];
      notEdges = args[3];
    } else {
      p = this.p1;
      q = args[0];
      r = this.p2;
      notEdges = args[1];
    }
    if (notEdges) {
      if(q.x < Math.max(p.x, r.x) && q.x > Math.min(p.x, r.x) && q.y < Math.max(p.y, r.y) && q.y > Math.min(p.y, r.y)) return true;
    }
    else if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) return true; 
    return false; 
  }

  public intersect (vec: Vec2, notEdges = false): boolean {
    let p1 = this.p1;
    let q1 = this.p2;
    let p2 = vec.p1;
    let q2 = vec.p2;

    const orientation = (p: Point, q: Point, r: Point): number => {
      let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y); 
      if (val == 0) return 0; // colinear 
      return (val > 0) ? 1 : 2; // clock or counterclock wise 
    }

    // Find the four orientations needed for  
    // general and special cases 
    let o1 = orientation(p1, q1, p2); 
    let o2 = orientation(p1, q1, q2); 
    let o3 = orientation(p2, q2, p1); 
    let o4 = orientation(p2, q2, q1); 
    // console.log(o1, o2, o3, o4)
    // General case 
    if (o1 != o2 && o3 != o4) {
      let l1 = new Line(this.p1, this.p2);
      let l2 = new Line(vec.p1, vec.p2);
      let intersection = l1.intersect(l2);
      // console.log(intersection, notEdges, l1, l2 )
      if (notEdges) {
        if (p1.equals(intersection) || p2.equals(intersection) || q1.equals(intersection) || q2.equals(intersection)) return false;
      }
      let onSegments = l1.on(intersection) && l2.on(intersection);
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
  }

  static fromZero (p: Point): Vec2 {
    return new Vec2(Point.zero, p);
  }
}
