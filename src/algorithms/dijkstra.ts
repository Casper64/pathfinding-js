import { Graph, Neighbour } from '../graph'
import { Grid } from '../grid'
import { point, SearchResult, CameFrom, Costs } from '../util'

interface DijkstraOptions {
  diagonal: boolean,
  passDiagonal: boolean,
  smoothenPath: boolean,
  bidirectional: boolean
}

export class Dijkstra {
  //options
  public diagonal: boolean;
  public passDiagonal: boolean;
  public diagonalCost = 1;
  public bidirectional: boolean;
  
  constructor (options = {} as Partial<DijkstraOptions>) {
    this.diagonal = options.diagonal || false;
    this.passDiagonal = options.passDiagonal || false;
    if (options.smoothenPath) this.diagonalCost = Math.SQRT2;
    this.bidirectional = options.bidirectional || false;
  }

  findPath (start: point, end: point, grid: Grid):  SearchResult {
    if (this.bidirectional) return this.findPathbs(start, end, grid);
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
      neighbours.forEach((n) => {
        let next = n[0];
        let new_cost = cost_so_far[current.coord] + next.movementCost + (n[1] > 3 ? this.diagonalCost-1 : 0);
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

  findPathbs (start: point, end: point, grid: Grid): SearchResult {
    let current: Graph[] = [grid.get(start.x, start.y), grid.get(end.x, end.y)];
    let open: Graph[][] = [[], []];
    let closed: Graph[] = [];
    let cost_so_far: Costs[] = [{}, {}];
    let came_from: CameFrom[] = [{}, {}];
    let neighbours: Neighbour[][] = [[], []];
    let sc = `${start.x}:${start.y}`;
    let ec = `${end.x}:${end.y}`;
    cost_so_far[0][sc] = 0;
    cost_so_far[1][ec] = 0;
    open = [[grid.get(start.x, start.y)], [grid.get(end.x, end.y)]];
    while (open[0].length > 0 && open[1].length > 0) {
      closed.push(current[0], current[1]);
      current = [open[0].pop()!, open[1].pop()!];

      if (came_from[0][current[1].coord] !== undefined || came_from[1][current[0].coord] !== undefined) {
        let d = Number(came_from[0][current[1].coord] !== undefined);
        let path: point[] = [];
        let nodes: Graph[] = [];
        let path2: point[] = [];
        let connecting = {x: current[d].x, y: current[d].y};
        while (current[d]) {
          path.push({x: current[d].x, y: current[d].y});
          current[d] = came_from[1-d][current[d].coord];
        }
        current[1-d] = grid.get(connecting.x, connecting.y);
        while (current[1-d]) {
          path2.push({x: current[1-d].x, y: current[1-d].y});
          current[1-d] = came_from[d][current[1-d].coord];
        }
        path.reverse();
        path.push(...path2);
        
        let newOpen: Graph[] = [];
        newOpen.push(...open[0]);
        newOpen.push(...open[1]);
        return {path: path, nodes: [], open: newOpen, closed, length: 0};
      }

      neighbours = [this.getNeighbours(current[0], ec, grid), this.getNeighbours(current[1], sc, grid)];
      neighbours.forEach((direction, d) => {
        direction.forEach((n) => {
          let next = n[0];
          let new_cost = cost_so_far[d][current[d].coord] + next.movementCost + (n[1] > 3 ? this.diagonalCost-1 : 0);
          if (cost_so_far[d][next.coord] === undefined || new_cost < cost_so_far[d][next.coord]) {
            cost_so_far[d][next.coord] = new_cost;
            came_from[d][next.coord] = current[d];
            //@ts-ignore
            open[d].insertSorted(next, (b: Graph, a: Graph) => {
              return cost_so_far[d][a.coord] - cost_so_far[d][b.coord];
            });
          };
        });
      });
    }
    let newOpen: Graph[] = [];
    newOpen.push(...open[0]);
    newOpen.push(...open[1]);
    return {path: [], nodes: [], open: newOpen, closed, length: 0};
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