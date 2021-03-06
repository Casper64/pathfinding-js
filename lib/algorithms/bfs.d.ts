import { Graph, Neighbour } from '../graph';
import { Grid } from '../grid';
import { point, heuristic, SearchResult } from '../util';
interface BFSOptions {
    diagonal: boolean;
    heuristic: heuristic;
    passDiagonal: boolean;
    bidirectional: boolean;
}
export declare class BFS {
    diagonal: boolean;
    heuristic: heuristic;
    passDiagonal: boolean;
    bidirectional: boolean;
    constructor(options?: Partial<BFSOptions>);
    findPath(start: point, end: point, grid: Grid): SearchResult;
    findPathbs(start: point, end: point, grid: Grid): SearchResult;
    hvalue(end: point, node: Graph): number;
    getNeighbours(node: Graph, end: string, grid: Grid): Neighbour[];
}
export {};
