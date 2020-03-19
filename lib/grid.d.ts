import { Graph } from './graph';
export declare class Grid {
    width: number;
    height: number;
    matrix: number[][];
    map: Graph[][];
    constructor(width: number, height: number);
    get(x: number, y: number): Graph;
    set(x: number, y: number, value: Graph): void;
    setSolid(x: number, y: number, solid: boolean): void;
    fill(matrix: number[][]): void;
}
