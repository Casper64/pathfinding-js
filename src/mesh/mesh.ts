import { Point } from "../util"
import { Triangle, lineFromPoints, lineLineIntersection } from "./mesh-grid"

export class Mesh {
  vertices: Point[];
  type: string;

  constructor (vertices: Point[], type = "mesh") {
    this.vertices = vertices;
    this.type = type;
  }

  get sidePoints (): Point[] {
    let list: Point[] = [];
    for (let i = 1; i < this.vertices.length; i++) {
      let m = new Point((this.vertices[i-1].x + this.vertices[i].x) / 2, (this.vertices[i-1].y + this.vertices[i].y) / 2);
      list.push(m);
    }
    list.push(new Point((this.vertices[0].x + this.vertices[this.vertices.length-1].x) / 2, (this.vertices[0].y + this.vertices[this.vertices.length-1].y) / 2));
    return list;
  }

  get boundingBox (): Point[] {
    let x = this.vertices.map(p => p.x);
    let y = this.vertices.map(p => p.y);
    return [new Point(Math.min(...x), Math.min(...y)), new Point(Math.max(...x), Math.max(...y))];
  }

  get edges (): Point[][] {
    let e: Point[][] = [];
    for (let i = 0; i < this.vertices.length-1; i++) {
      e.push([this.vertices[i], this.vertices[i+1]]);
    }
    e.push([this.vertices[0], this.vertices[this.vertices.length-1]]);
    return e;
  }

  public toPath (): string {
    let result = `M${this.vertices[0].x},${this.vertices[0].y}`;
    for (let i = 1; i < this.vertices.length; i++) {
      result += `L${this.vertices[i].x},${this.vertices[i].y}`;
    }
    result += "Z";
    return result;
  }

  public inside (p: Point): boolean {
    // Given three colinear points p, q, r, the function checks if 
    // point q lies on line segment 'pr' 
    const onSegment = (p: Point, q: Point, r: Point): boolean => {
      if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) return true;
      else return false;
    }
    const orientation = (p: Point, q: Point, r: Point): number => {
      let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
      if (val == 0) return 0; // colinear
      return val > 0 ? 1 : 2; // clock or counterclockwise
    }
    // The function that returns true if line segment 'p1q1' and 'p2q2' intersect.
    const doIntersect = (p1: Point, q1: Point, p2: Point, q2: Point): boolean => {
      let o1 = orientation(p1, q1, p2);
      let o2 = orientation(p1, q1, q2);
      let o3 = orientation(p2, q2, p1);
      let o4 = orientation(p2, q1, q1);
      // General case
      if (o1 != o2 && o3 != o4) return true;
      // Special Cases 
      // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
      if (o1 == 0 && onSegment(p1, p2, q1)) return true; 
      // p1, q1 and p2 are colinear and q2 lies on segment p1q1 
      if (o2 == 0 && onSegment(p1, q2, q1)) return true; 
      // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
      if (o3 == 0 && onSegment(p2, p1, q2)) return true; 
      // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
      if (o4 == 0 && onSegment(p2, q1, q2)) return true; 
      return false; // Doesn't fall in any of the above cases 
    }

    let extreme = new Point(Infinity, p.y);
    let count = 0;
    let i = 0;
    let n = this.vertices.length;
    do {
      let next = (i+1)%n;
      // Check if the line segment from 'p' to 'extreme' intersects 
      // with the line segment from 'polygon[i]' to 'polygon[next]'
      if (doIntersect(this.vertices[i], this.vertices[next], p, extreme)) {
        // If the point 'p' is colinear with line segment 'i-next', 
        // then check if it lies on segment. If it lies, return true, 
        // otherwise false 
        if (orientation(this.vertices[i], p, this.vertices[next]) == 0) { // colinear
          return onSegment(this.vertices[i], p, this.vertices[next]);
        }
        count++;
      }
      i = next;
    } while (i != 0);
    return (count % 2 == 1); // odd number of intersections
  }

  public containTwo (vertices: Point[]): boolean {
    let joined: Point[] = [];
    joined.push(...vertices);
    joined.push(...this.vertices);
    let s = new Set(joined);
    if (joined.length - s.size == 2) return true
    else return false
  }

}

function shoelace (v: Point[]): number {
  let area = 0;
  let sum1 = 0;
  let sum2 = 0;
  for (let i = 0; i < v.length-1; i++) {
    sum1 += v[i].x*v[i+1].y;
    sum2 += v[i+1].x*v[i].y;
  }
  sum1 += v[v.length-1].x*v[0].y;
  sum2 += v[0].x*v[v.length-1].y;
  area = Math.abs(sum1 - sum2) / 2;
  return area;
}