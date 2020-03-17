import { Graph  } from './graph'

export class Grid {
  public width: number;
  public height: number;
  public matrix: number[][] = [];
  public map: Graph[][] = [];

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.matrix = new Array(height).fill(new Array(width).fill(0));
    this.fill(this.matrix);
  }

  public get (x: number, y: number): Graph {
    return this.map[y][x];
  }

  public set (x: number, y: number, value: Graph) {
    this.map[y][x] = value;
  }

  public setSolid(x: number, y: number, solid: boolean) {
    this.matrix[y][x] = Number(solid);
    this.map[y][x].solid = solid;
  }

  public fill (matrix: number[][]) {
    let empty = this.map.length == 0;
    for (let y = 0; y < matrix.length; y++) {
      if (empty) this.map.push([]);
      else this.map[y].length = 0;
      for (let x = 0; x < matrix[y].length; x++) {
        let node = new Graph(x, y, Boolean(matrix[y][x]));
        this.map[y].push(node);
      }
    }
  }
}