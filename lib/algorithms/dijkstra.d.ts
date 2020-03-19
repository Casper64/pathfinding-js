import { Graph, Neighbour } from '../graph';
import { Grid } from '../grid';
import { point } from '../util';
interface DijkstraOptions {
    diagonal: boolean;
    passDiagonal: boolean;
    smoothenPath: boolean;
}
export declare class Dijkstra {
    diagonal: boolean;
    passDiagonal: boolean;
    diagonalCost: number;
    constructor(options?: Partial<DijkstraOptions>);
    findPath(start: point, end: point, grid: Grid): {
        path: point[];
        nodes: Graph[];
        open: Graph[];
        closed: Graph[];
        length: number;
    };
    getNeighbours(node: Graph, end: string, grid: Grid): Neighbour[];
}
export {};
