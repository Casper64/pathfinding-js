import { Graph } from "./graph";
export interface point {
    x: number;
    y: number;
}
export declare class Point implements point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    get coord(): string;
    get length(): number;
    equals(p: Point): boolean;
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
