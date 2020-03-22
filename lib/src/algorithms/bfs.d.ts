import { Graph, Neighbour } from '../graph';
import { Grid } from '../grid';
import { point, heuristic } from '../util';
interface BFSOptions {
    diagonal: boolean;
    heuristic: heuristic;
    passDiagonal: boolean;
}
export declare class BFS {
    diagonal: boolean;
    heuristic: heuristic;
    passDiagonal: boolean;
    constructor(options?: Partial<BFSOptions>);
    findPath(start: point, end: point, grid: Grid): {
        path: point[];
        nodes: Graph[];
        open: Graph[];
        closed: Graph[];
        length: number;
    };
    hvalue(end: point, node: Graph): number;
    getNeighbours(node: Graph, end: string, grid: Grid): Neighbour[];
}
export {};
