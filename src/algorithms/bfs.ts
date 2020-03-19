import { Graph, Neighbour } from '../graph'
import { Grid } from '../grid'
import { point, heuristic, SearchResult, CameFrom, Costs } from '../util'

interface BFSOptions {
  diagonal: boolean,
  heuristic: heuristic,
  passDiagonal: boolean
}

export class BFS {
  //options
  public diagonal: boolean;
  public heuristic: heuristic;
  public passDiagonal: boolean;
  
  constructor (options = {} as Partial<BFSOptions>) {
    this.diagonal = options.diagonal || false;
    this.heuristic = options.heuristic || "manhattan";
    this.passDiagonal = options.passDiagonal || false;
  }

  findPath (start: point, end: point, grid: Grid) {
    let current = grid.get(start.x, start.y);
    let open = [current];
    let closed: Graph[] = [];
    let came_from = {} as CameFrom;
    let cost_so_far = {} as Costs;
    let neighbours: Neighbour[] = [];
    let sc = `${start.x}:${start.y}`;
    let ec = `${end.x}:${end.y}`;
    cost_so_far[sc] = 0;
    while (open.length > 0) {
      closed.push(current);
      current = open.pop()!;

      if (current.coord === ec) { // finished
        let path: point[] = [];
        let nodes: Graph[] = [];
        while (current.coord != sc) {
          path.push({x: current.x, y: current.y});
          nodes.push(current);
          current = came_from[current.coord];
        }
        path.push({x: start.x, y: start.y});
        nodes.push(grid.get(start.x, start.y));
        path.reverse();
        nodes.reverse();
        let length = path.length;
        return {path, nodes, open, closed, length}
      }

      neighbours = this.getNeighbours(current, ec, grid);
      neighbours.forEach((n, index) => {
        let next = n[0];
        let new_cost = this.hvalue(end, next);
        if (cost_so_far[next.coord] === undefined || new_cost < cost_so_far[next.coord]) {
          cost_so_far[next.coord] = new_cost;
          came_from[next.coord] = current;
          //@ts-ignore
          open.insertSorted(next, (b: Graph, a: Graph) => {
            return cost_so_far[a.coord] - cost_so_far[b.coord];
          });
        }
      });
    }
    return {path: [], nodes: [], open, closed, length: 0};
  }

  hvalue (end: point, node: Graph): number {
    let result = 0;
    // if(this.diagonal) {
      if (this.heuristic == "octile") {
        let D = 1;
        let D2 = Math.SQRT2;
        let dx = Math.abs(node.x - end.x);
        let dy = Math.abs(node.y - end.y);
        result = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
      } else if (this.heuristic == "eucledian") {
        let D = 1;
        let dx = Math.abs(node.x - end.x);
        let dy = Math.abs(node.y - end.y);
        result = D * Math.sqrt(dx * dx + dy * dy);
      } else if (this.heuristic == "chebyshev") {
        let D = 1;
        let D2 = 1;
        let dx = Math.abs(node.x - end.x);
        let dy = Math.abs(node.y - end.y);
        result = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
      }
    // }
    else {
      result = Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
    }
    return result;
  }

  getNeighbours (node: Graph, end: string, grid: Grid): Neighbour[] {
    let nodes: Neighbour[] = [];
    let dir: number[][] = [[1,0], [0,1], [-1,0], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]];
    for (let d = 0; d < (this.diagonal ? 8 : 4); d++) {
      if (node.x + dir[d][0] > grid.width-1 || node.x + dir[d][0] < 0) continue;
      if (node.y + dir[d][1] > grid.height-1 || node.y + dir[d][1] < 0) continue;
      if (!this.passDiagonal && d > 3 && grid.get(node.x + dir[d][0], node.y).solid && grid.get(node.x, node.y + dir[d][1]).solid) continue
      let next = grid.get(node.x + dir[d][0], node.y + dir[d][1]);
      if (next.solid && next.coord !== end) continue
      nodes.push([next, d]);
    }
    return nodes;
  }
}

interface Array<Graph> {
  insertSorted(v: Graph, sortFunction: Function): Array<Graph>;
}

//@ts-ignore
Array.prototype.insertSorted = function (v: Graph, sortFunction: Function): Graph[] {
  if (this.length < 1 || sortFunction(v, this[this.length-1]) >= 0) {
    this.push(v);
    return this;
  }
  for (var  i = this.length-2; i>= 0; i--) {
    if (sortFunction(v, this[i]) >= 0) {
      this.splice(i+1, 0, v);
      return this;
    }
  }
  this.splice(0, 0, v);
  return this;
}