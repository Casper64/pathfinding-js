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

  public equals(p: Point): boolean {
    return this.x == p.x && this.y == p.y;
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