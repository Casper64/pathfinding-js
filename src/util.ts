import { Graph } from "./graph";

export interface point {
  x: number,
  y: number
}

export class Point implements point {
  x: number;
  y: number;
  constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get coord (): string {
    return `${this.x}:${this.y}`;
  }

  get length (): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  static get zero (): Point {
    return new Point(0, 0);
  }

  public distance (b: Point): number {
    return Point.sub(this, b).length;
  }

  public equals(p: Point): boolean {
    return this.x == p.x && this.y == p.y;
  }

  public add (p: Point): Point {
    this.x += p.x;
    this.y += p.y;
    return this;
  }

  public sub (p: Point): Point {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  }

  public static add (p1: Point, p2: Point): Point {
    return new Point(p1.x + p2.x, p1.y + p2.y);

  }

  public static sub (p1: Point, p2: Point): Point {
    return new Point(p1.x - p2.x, p1.y - p2.y);
  }
}

export const h: heuristic[] = ["manhattan", "octile", "eucledian", "chebyshev"];

export type heuristic = "manhattan" | "octile" | "eucledian" | "chebyshev";
export type CameFrom = { [key: string]: Graph } // Like a Hashmap
export type Costs = { [key: string]: number } // Like a Hashmap

export interface SearchResult {
  path: point[],
  nodes: Graph[],
  open: Graph[],
  closed: Graph[]
  length: number
}