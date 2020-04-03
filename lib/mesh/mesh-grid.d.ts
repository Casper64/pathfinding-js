import { Polygon } from "../shapes/polygon";
import { Point } from "../util";
import { Graph } from "../graph";
import { Triangle } from "../shapes/triangle";
interface MeshGridMap {
    [key: string]: {
        node: Point;
        neighbours: Graph[];
    };
}
export declare class MeshGrid {
    meshes: Polygon[];
    convexHull: Point[];
    map: MeshGridMap;
    constructor(meshes: Polygon[], mapOutline: Point[]);
    get(point: Point): {
        node: Point;
        neighbours: Graph[];
    };
    generateMap(): {
        triangulation: Triangle[];
        points: Point[];
    };
    private BowyerWatson;
    get smallestTriangle(): Triangle;
}
export {};
