import { Graph } from "./graph";
export interface point {
    x: number;
    y: number;
}
export declare const h: heuristic[];
export declare type heuristic = "manhattan" | "octile" | "eucledian" | "chebyshev";
export declare type CameFrom = {
    [key: string]: Graph;
};
export declare type Costs = {
    [key: string]: number;
};
export interface SearchResult {
    path: point[];
    nodes: Graph[];
    open: Graph[];
    closed: Graph[];
    length: number;
}
