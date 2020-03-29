import {  Mesh } from "./mesh"
import { Point } from "../util"
import { Graph } from "../graph";

interface MeshGridMap {
  [key: string]: {
    node: Point,
    neighbours: Graph[]
  }
}

export class MeshGrid {
  meshes: Mesh[];
  convexHull: Point[];
  map: MeshGridMap = {};

  constructor (meshes: Mesh[], mapOutline: Point[]) {
    this.meshes = meshes;
    this.convexHull = mapOutline;
  }

  public get (point: Point) {
    return this.map[point.coord];
  }

  public generateMap () {
    this.map = {};
    let points: Point[] = [];
    this.meshes.forEach(m => {
      points.push(...m.vertices);
      points.push(...m.sidePoints); // enable for extra detail if the map contains a weird overhanging polygon
    });    
    // points.push(...this.convexHull);
    let triangulation = this.BowyerWatson(points); // delauney triangles

    //remove triangles who lay within obstacles
    let removables: number[] = [];
    outerloop:
    for (let i = 0; i < triangulation.length; i++) {
      let t = triangulation[i];
      for (let k = 0; k < this.meshes.length; k++) {
      let outerSame = true;
        for (let f = 0; f < 3; f++) {
          let v = t.vertices[f];
          let same = false;
          let mVertex: Point[] = []
          mVertex.push(...this.meshes[k].vertices);
          mVertex.push(...this.meshes[k].sidePoints);
          mVertex.forEach((m, im) => {
            if (v.x == m.x && v.y == m.y) same = true;
          });
          if (same == false)  outerSame = false;
        }
        if (outerSame) {
          triangulation.splice(i, 1);
          i--;
          continue outerloop;
        }
      }
    }

    // check flip side equality
    // let newMeshes: Mesh[] = [];
    // let finished = false;
    // while (triangulation.length >= 1 && !finished) {
    //   finished = true;
    //   for (let i = 0; i < triangulation.length; i++) {
    //     let t = triangulation[i];
    //     for (let j = i+1; j < triangulation.length; j++) {
    //       let t2 = triangulation[j];
    //       if (t2.containTwo([...t.vertices])) {
    //         // triangulation.splice(i, 1);
    //         let result = t.join(t2);
    //         if (result.valid) {
    //           finished = false;
    //           newMeshes.push(result.newShape);
    //           triangulation.splice(i, 1);
    //           triangulation.splice(j-1, 1);
    //           break;
    //         }
    //       }
    //     }
    //   }
    // }
    // newMeshes.push(...triangulation);

    //#region shit

    triangulation.forEach(t => {
      t.vertices.forEach(v => {
        let n: Graph[] = [];
        let sp = t.sidePoints.sort((a, b) => new Point(a.x - v.x, a.y - v.y).length - new Point(b.x - v.x, b.y - v.y).length);
        n.push(new Graph(sp[0].x, sp[0].y, false, new Point(sp[0].x - v.x, sp[0].y - v.y).length));
        n.push(new Graph(sp[1].x, sp[1].y, false, new Point(sp[1].x - v.x, sp[1].y - v.y).length));
        n.push(new Graph(sp[2].x, sp[2].y, false, new Point(sp[2].x - v.x, sp[2].y - v.y).length));
        let vt = t.vertices.sort((a, b) => new Point(a.x - v.x, a.y - v.y).length - new Point(b.x - v.x, b.y - v.y).length);
        n.push(new Graph(vt[0].x, vt[0].y, false, new Point(vt[0].x - v.x, vt[0].y - v.y).length));
        n.push(new Graph(vt[1].x, vt[1].y, false, new Point(vt[1].x - v.x, vt[1].y - v.y).length));
        n.push(new Graph(vt[2].x, vt[2].y, false, new Point(vt[2].x - v.x, vt[2].y - v.y).length));

        if (this.map[v.coord] === undefined) {
          this.map[v.coord] = {
            node: v,
            neighbours: [...n]
          }
        } else {
          this.map[v.coord].neighbours.push(...n);
        }
      });
      t.sidePoints.forEach(v => {
        let n: Graph[] = [];
        let vt = t.vertices.sort((a, b) => new Point(a.x - v.x, a.y - v.y).length - new Point(b.x - v.x, b.y - v.y).length);
        n.push(new Graph(vt[0].x, vt[0].y, false, new Point(vt[0].x - v.x, vt[0].y - v.y).length));
        n.push(new Graph(vt[1].x, vt[1].y, false, new Point(vt[1].x - v.x, vt[1].y - v.y).length));
        n.push(new Graph(vt[2].x, vt[2].y, false, new Point(vt[2].x - v.x, vt[2].y - v.y).length));
        let sp = t.sidePoints.sort((a, b) => new Point(a.x - v.x, a.y - v.y).length - new Point(b.x - v.x, b.y - v.y).length);
        n.push(new Graph(sp[0].x, sp[0].y, false, new Point(sp[0].x - v.x, sp[0].y - v.y).length));
        n.push(new Graph(sp[1].x, sp[1].y, false, new Point(sp[1].x - v.x, sp[1].y - v.y).length));
        n.push(new Graph(sp[2].x, sp[2].y, false, new Point(sp[2].x - v.x, sp[2].y - v.y).length));
        if (this.map[v.coord] === undefined) {
          this.map[v.coord] = {
            node: v,
            neighbours: [...n]
          }
        } else {
          this.map[v.coord].neighbours.push(...n);
        }
      })
    });
    Object.keys(this.map).forEach(key => {
      let done: string[] = [];
      this.map[key].neighbours = this.map[key].neighbours.filter(n => {
        for (let i = 0; i < done.length; i++) {
          if (done[i] === n.coord) return false;
        }
        done.push(n.coord);
        return true;
      });
    });
    triangulation.forEach(t => {
      points.push(...t.sidePoints);
    });
    let done: Point[] = [];
    points = points.filter(p => {
      for (let i = 0; i < done.length; i++) {
        if (done[i].x == p.x && done[i].y == p.y) return false;
      }
      done.push(p);
      return true;
    });

//#endregion

    return {triangulation, points};
    
  }

  private BowyerWatson (points: Point[]) {
    let triangulation: Triangle[] = [];
    let superTriangle = this.smallestTriangle;
    triangulation.push(superTriangle);
    points.forEach((p,testIndex) => {
      let badTriangles: Triangle[] = [];
      triangulation.forEach(t => {
        if (t.insideCircumcircle(p)) {
          badTriangles.push(t);
        }
      });
      let polygon: Point[][] = [];
      badTriangles.forEach((bt, btIndex) => {
        bt.edges.forEach(edge => {
          for (let i = 0; i < badTriangles.length; i++) {
            if (i == btIndex) continue;
            if (badTriangles[i].containsEdge(edge)) return;
          }
          polygon.push(edge);
        })
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
        let nt = new Triangle([p, edge[0], edge[1]]);
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

  get smallestTriangle (): Triangle {
    let temp: Point[] = [];
    temp.push(...this.convexHull);
    let closest = temp.sort((a, b) => {
      return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    })[0];
    let highest = temp.sort((a, b) => a.y - b.y)[0];
    let lowest = temp.sort((a, b) => b.y - a.y)[0];
    let furthest = temp.sort((a, b) => b.x - a.x)[0];
    let p0 = new Point(closest.x, highest.y);
    let p1 = new Point(2*furthest.x, highest.y);
    let p2 = new Point(p0.x, 2*lowest.y);
    return new Triangle([p0, p1, p2]);
  }
}

export class Triangle extends Mesh {
  constructor (vertices: Point[]) {
    if (vertices.length != 3) throw new Error("Triangle with not 3 vertices was created!");
    super(vertices, "triangle");
  }

  public join (t: Triangle) {
    let valid = lineLength(t.edges[0][0], t.edges[0][1]) == lineLength(this.edges[0][0], this.edges[0][1]);
    if (!valid) return {valid, newShape: null}
    let joined: Point[] = [];
    joined.push(...t.vertices);
    joined.push(...this.vertices);
    let s = new Set(joined);
    let newShape = new Mesh(Array.from(s));
    return {valid, newShape}
  }

  public equals(t: Triangle) {
    let same = false;
    this.vertices.sort((a, b) => a.length - b.length);
    t.vertices.sort((a, b) => a.length - b.length);
    if ((this.vertices[0].x == t.vertices[0].x && this.vertices[0].y == t.vertices[0].y ) && (this.vertices[1].x == t.vertices[1].x && this.vertices[1].y == t.vertices[1].y) && (this.vertices[2].x == t.vertices[2].x && this.vertices[2].y == t.vertices[2].y)) same = true;
    return same;
  }

  get edges (): Point[][] {
    let e = [
      [this.vertices[0], this.vertices[1]].sort((a, b) => a.length - b.length), 
      [this.vertices[1], this.vertices[2]].sort((a, b) => a.length - b.length),
      [this.vertices[2], this.vertices[0]].sort((a, b) => a.length - b.length)
    ];
    e.sort((a, b) => lineLength(a[0], a[1]) - lineLength(b[0], b[1]));
    e.reverse();
    return e;
  }

  get sidePoints (): Point[] {
    let list: Point[] = [];
    list.push(new Point((this.vertices[0].x + this.vertices[1].x) / 2, (this.vertices[0].y + this.vertices[1].y) / 2));
    list.push(new Point((this.vertices[1].x + this.vertices[2].x) / 2, (this.vertices[1].y + this.vertices[2].y) / 2));
    list.push(new Point((this.vertices[0].x + this.vertices[2].x) / 2, (this.vertices[0].y + this.vertices[2].y) / 2));
    return list;
  }

  get boundingBox (): Point[] {
    let x = this.vertices.map(p => p.x);
    let y = this.vertices.map(p => p.y);
    return [new Point(Math.min(...x), Math.min(...y)), new Point(Math.max(...x), Math.max(...y))];
  }

  public containsEdge(edge: Point[]): boolean {
    let edges = this.edges;
    let same = false;
    edges.forEach(ed => {
      if (ed[0].x == edge[0].x && ed[0].y == edge[0].y && ed[1].x == edge[1].x && ed[1].y == edge[1].y) same = true;
      // let {a: a, b: b, c: c} = lineFromPoints(ed[0], ed[1]);
      // let {a: d, b: e, c: f} = lineFromPoints(edge[0], edge[1]);
      // if (lineLineIntersection(a, b, c, d, e, f).x == -1) same = true;
    });
    return same;
  }

  get circumcircle () {
    let P = this.vertices[0];
    let Q = this.vertices[1];
    let R = this.vertices[2];
    let {a, b, c} = lineFromPoints(P, Q);
    let {a: d, b: e, c: f} = lineFromPoints(Q, R);
    let {a: a1, b: b1, c: c1} = ppBisector(P, Q, a, b, c);
    let {a: d1, b: e1, c: f1} = ppBisector(Q, R, d, e, f);
    let center = lineLineIntersection(a1, b1, c1, d1, e1, f1);
    let radius = Math.sqrt(Math.pow(P.x - center.x, 2) + Math.pow(P.y - center.y, 2));
    return {center, radius};
  }

  public insideCircumcircle (point: Point): boolean {
    const {center, radius} = this.circumcircle;
    let distance = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
    return distance <= radius;
  }
}

export function lineFromPoints (p1: Point, p2: Point) {
  let a = p2.y - p1.y;
  let b = p1.x - p2.x;
  let c = a*p1.x + b*p1.y;
  return {a, b, c};
}

export function ppBisector (p1: Point, p2: Point, a: number, b: number, c: number) {
  let m = new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  // c = -bx + ay
  c =  -b*m.x + a*m.y;
  let temp = a;
  a = -b;
  b = temp;
  return {a, b, c};
}

export function  lineLineIntersection (a1: number, b1: number, c1: number, a2: number, b2: number, c2: number) {
  let D = a1*b2 - a2*b1;
  if (D == 0) return new Point(-1, -1);
  else return new Point((b2*c1 - b1*c2) / D, (a1*c2 - a2*c1) / D);
}

export function lineLength(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2));
}