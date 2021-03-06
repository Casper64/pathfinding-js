import { Graph, Neighbour } from '../graph';
import { Grid } from '../grid';
import { point, SearchResult } from '../util';
interface DijkstraOptions {
    diagonal: boolean;
    passDiagonal: boolean;
    smoothenPath: boolean;
    bidirectional: boolean;
}
export declare class Dijkstra {
    diagonal: boolean;
    passDiagonal: boolean;
    diagonalCost: number;
    bidirectional: boolean;
    constructor(options?: Partial<DijkstraOptions>);
    findPath(start: point, end: point, grid: Grid): SearchResult;
    findPathbs(start: point, end: point, grid: Grid): SearchResult;
    getNeighbours(node: Graph, end: string, grid: Grid): Neighbour[];
}
export {};
