import { Graph, Neighbour } from '../graph';
import { Grid } from '../grid';
import { point } from '../util';
export declare type heuristic = "manhattan" | "octile" | "eucledian" | "chebyshev";
export declare type CameFrom = {
    [key: string]: Graph;
};
export declare type Costs = {
    [key: string]: number;
};
export interface AStarOptions {
    diagonal: boolean;
    heuristic: heuristic;
    smoothenPath: boolean;
    passDiagonal: boolean;
}
export interface AStarResult {
    path: point[];
    nodes: Graph[];
    open: Graph[];
    closed: Graph[];
    length: number;
}
export declare class AStar {
    diagonal: boolean;
    heuristic: heuristic;
    smooth: boolean;
    passDiagonal: any;
    diagonalCost: number;
    constructor(options?: Partial<AStarOptions>);
    findPath(start: point, end: point, grid: Grid): AStarResult;
    hvalue(end: point, node: Graph): number;
    getNeighbours(node: Graph, end: string, grid: Grid): Neighbour[];
}
