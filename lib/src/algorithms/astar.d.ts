import { Graph, Neighbour } from '../graph';
import { Grid } from '../grid';
import { point, heuristic, SearchResult } from '../util';
export interface AStarOptions {
    diagonal: boolean;
    heuristic: heuristic;
    smoothenPath: boolean;
    passDiagonal: boolean;
    bidirectional: boolean;
}
export declare class AStar {
    diagonal: boolean;
    heuristic: heuristic;
    passDiagonal: boolean;
    diagonalCost: number;
    bidirectional: boolean;
    constructor(options?: Partial<AStarOptions>);
    findPath(start: point, end: point, grid: Grid): SearchResult;
    private findPathbs;
    hvalue(end: point, node: Graph): number;
    getNeighbours(node: Graph, end: string, grid: Grid): Neighbour[];
}
