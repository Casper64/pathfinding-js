import { Graph } from "./graph";

export interface point {
  x: number,
  y: number
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