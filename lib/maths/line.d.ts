import { Vec2 } from "./vector2";
import { Point } from "../util";
export declare class Line {
    p1: Point;
    p2: Point;
    segment: Vec2;
    a: number;
    b: number;
    c: number;
    constructor(p1: Point, p2: Point);
    update(): void;
    perpendicular(): {
        a: number;
        b: number;
        c: number;
    };
    bisectIntersect(l2: Line): Point;
    intersect(l2: Line): Point;
    on(point: Point): boolean;
}
