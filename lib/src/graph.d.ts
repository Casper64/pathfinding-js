export declare type Neighbour = [Graph, number];
export declare class Graph {
    x: number;
    y: number;
    coord: string;
    solid: boolean;
    movementCost: number;
    constructor(x: number, y: number, solid: boolean, movementCost?: number);
}
