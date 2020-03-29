import { Graph, Neighbour } from '../graph';
import { Grid } from '../grid';
import { point, heuristic, SearchResult, Point } from '../util';
import { MeshGrid } from '../mesh/mesh-grid';
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
    findPathMesh(sp: Point, ep: Point, grid: MeshGrid): {
        path: Point[];
        open: Point[];
        closed: Point[];
        length: number;
        nodes?: undefined;
    } | {
        path: never[];
        nodes: never[];
        open: Point[];
        closed: Point[];
        length: number;
    };
    private findPathbs;
    hvalue(end: point, node: Graph | Point): number;
    getNeighbours(node: Graph, end: string, grid: Grid): Neighbour[];
}
