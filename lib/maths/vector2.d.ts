import { Point } from "../util";
export declare class Vec2 {
    p1: Point;
    p2: Point;
    constructor(p1: Point, p2: Point);
    get length(): number;
    get mid(): Point;
    equals(b: Vec2): boolean;
    onSegment(p: Point, q: Point, r: Point, notEdges: boolean): boolean;
    onSegment(q: Point, notEdges: boolean): boolean;
    intersect(vec: Vec2, notEdges?: boolean): boolean;
    static fromZero(p: Point): Vec2;
}
