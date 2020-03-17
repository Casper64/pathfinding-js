


export type Neighbour = [Graph, number];

export class Graph {
  public x: number;
  public y: number;
  public coord: string;
  public solid: boolean;
  public movementCost: number;

  constructor (x: number, y: number, solid: boolean, movementCost = 1) {
    this.x = x;
    this.y = y;
    this.coord = `${x}:${y}`;
    this.solid = solid;
    this.movementCost = movementCost;
  }
}
