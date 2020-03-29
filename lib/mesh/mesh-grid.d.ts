import { Mesh } from "./mesh";
import { Point } from "../util";
import { Graph } from "../graph";
interface MeshGridMap {
    [key: string]: {
        node: Point;
        neighbours: Graph[];
    };
}
export declare class MeshGrid {
    meshes: Mesh[];
    convexHull: Point[];
    map: MeshGridMap;
    constructor(meshes: Mesh[], mapOutline: Point[]);
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
export declare class Triangle extends Mesh {
    constructor(vertices: Point[]);
    join(t: Triangle): {
        valid: false;
        newShape: null;
    } | {
        valid: true;
        newShape: Mesh;
    };
    equals(t: Triangle): boolean;
    get edges(): Point[][];
    get sidePoints(): Point[];
    get boundingBox(): Point[];
    containsEdge(edge: Point[]): boolean;
    get circumcircle(): {
        center: Point;
        radius: number;
    };
    insideCircumcircle(point: Point): boolean;
}
export declare function lineFromPoints(p1: Point, p2: Point): {
    a: number;
    b: number;
    c: number;
};
export declare function ppBisector(p1: Point, p2: Point, a: number, b: number, c: number): {
    a: number;
    b: number;
    c: number;
};
export declare function lineLineIntersection(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Point;
export declare function lineLength(p1: Point, p2: Point): number;
export {};
