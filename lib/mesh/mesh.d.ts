import { Point } from "../util";
export declare class Mesh {
    vertices: Point[];
    type: string;
    constructor(vertices: Point[], type?: string);
    get sidePoints(): Point[];
    get boundingBox(): Point[];
    get edges(): Point[][];
    toPath(): string;
    inside(p: Point): boolean;
    containTwo(vertices: Point[]): boolean;
}
