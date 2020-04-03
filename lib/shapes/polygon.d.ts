import { Point } from "../util";
import { Vec2 } from "../maths/vector2";
export declare class Polygon {
    vertices: Point[];
    type: string;
    constructor(vertices: Point[], type?: string);
    equals(shape: Polygon): boolean;
    containsEdge(edge: Vec2): boolean;
    get sidePoints(): Point[];
    get boundingBox(): Point[];
    get edges(): Vec2[];
    get center(): Point;
    neigbourVertices(index: number): Point[];
    toPath(): string;
    overlap(shape: Polygon): boolean;
    inside(p: Point, onSideOnly?: boolean): boolean;
    containTwo(vertices: Point[]): boolean;
}
