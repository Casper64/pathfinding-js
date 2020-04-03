import { Point } from "../util";
import { Polygon } from "./polygon";
export declare class Triangle extends Polygon {
    constructor(vertices: Point[]);
    get circumcircle(): {
        center: Point;
        radius: number;
    };
    insideCircumcircle(point: Point): boolean;
}
