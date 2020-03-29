import { Graph, Neighbour } from '../graph'
import { Grid } from '../grid'
import { point, heuristic, CameFrom, Costs, SearchResult, Point } from '../util'
import { MeshGrid, lineLength } from '../mesh/mesh-grid';

export interface AStarOptions {
  diagonal: boolean,
  heuristic: heuristic,
  smoothenPath: boolean,
  passDiagonal: boolean,
  bidirectional: boolean
}

export class AStar {
  //options
  public diagonal: boolean;
  public heuristic: heuristic;
  public passDiagonal: boolean;
  public diagonalCost = 1;
  public bidirectional: boolean;

  constructor (options = {} as Partial<AStarOptions>) {
    this.diagonal = options.diagonal || false;
    this.heuristic = options.heuristic || "manhattan";
    this.passDiagonal = options.passDiagonal || false;
    this.bidirectional = options.bidirectional || false;
    if (options.smoothenPath) this.diagonalCost = Math.SQRT2;
  }

  findPath (start: point, end: point, grid: Grid): SearchResult {
    if (this.bidirectional) return this.findPathbs(start, end, grid);
    let current = grid.get(start.x, start.y);
    let open = [current]; // All the nodes that are open for examination
    let closed: Graph[] = []; // All the nodes that are examined
    let f_score = {} as Costs; // The movement cost g(x) + heuristic value h(x, end)
    let cost_so_far = {} as Costs; // the movement cost in total g(x)
    let came_from = {} as CameFrom; // hasmap to store where every node came from
    let neighbours: Neighbour[] = [];
    let sc = `${start.x}:${start.y}`;
    let ec = `${end.x}:${end.y}`;
    f_score[sc] = 0;
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
        let new_cost = cost_so_far[current.coord] + next.movementCost + (n[1] > 3 ? this.diagonalCost-1 : 0);
        if (cost_so_far[next.coord] === undefined || new_cost < cost_so_far[next.coord]) {
          let h = this.hvalue(end, next);
          cost_so_far[next.coord] = new_cost;
          f_score[next.coord] = new_cost + h;
          came_from[next.coord] = current;
          //@ts-ignore
          open.insertSorted(next, (b: Graph, a: Graph) => {
            return f_score[a.coord] - f_score[b.coord];
          })
        }
      })
    }

    return {path: [], nodes: [], open, closed, length: 0};
  }

  public findPathMesh (sp: Point, ep: Point, grid: MeshGrid) {
    this.heuristic = 'octile';
    interface cf {
      [key: string]: Point
    }
    interface cost {
      [key: string]: number
    }
    let start = Object.keys(grid.map).map(key => grid.map[key].node).sort((a, b) => this.hvalue(sp, a) - this.hvalue(sp, b))[0];
    let end = Object.keys(grid.map).map(key => grid.map[key].node).sort((a, b) => this.hvalue(ep, a) - this.hvalue(ep, b))[0];
    let current = grid.map[start.coord].node;
    let open = [current]; // All the nodes that are open for examination
    let closed: Point[] = []; // All the nodes that are examined
    let f_score = {} as cost; // The movement cost g(x) + heuristic value h(x, end)
    let cost_so_far = {} as cost; // the movement cost in total g(x)
    let came_from = {} as cf; // hasmap to store where every node came from
    let neighbours: Graph[] = [];
    f_score[start.coord] = 0;
    cost_so_far[start.coord] = 0;
    while (open.length > 0) {
      closed.push(current);
      current = open.pop()!;

      if (current.coord === end.coord) { // finished
        let path: Point[] = [];
        while (current.coord != start.coord) {
          path.push(current);
          current = came_from[current.coord];
        }
        for (let i = 0; i < path.length; i++) {
          current = new Point(path[i].x, path[i].y);
          let corner = false;
          grid.meshes.forEach(m => {
            m.vertices.forEach(v => {
              if (current.equals(v)) corner = true;
            });
          });
          if (!corner) { // define better
            path.splice(i, 1);
            i--;
          }          
        }
        path.push(start, sp);
        path.reverse();
        path.push(end, ep)

        let length = path.length;
        return {path, open, closed, length}
      }

      neighbours = grid.get(current).neighbours;
      neighbours.forEach((next) => {
        let new_cost = cost_so_far[current.coord] + next.movementCost;
        if (cost_so_far[next.coord] === undefined || new_cost < cost_so_far[next.coord]) {
          let h = this.hvalue(end, next);
          cost_so_far[next.coord] = new_cost;
          f_score[next.coord] = new_cost + h;
          came_from[next.coord] = current;
          //@ts-ignore
          open.insertSorted(next, (b: Point, a: Point) => {
            return f_score[a.coord] - f_score[b.coord];
          })
        }
      })
    }

    return {path: [], nodes: [], open, closed, length: 0};
  }

  private findPathbs (start: point, end: point, grid: Grid): SearchResult {
    let current: Graph[] = [grid.get(start.x, start.y), grid.get(end.x, end.y)];
    let open: Graph[][] = [[], []];
    let closed: Graph[] = [];
    let f_score: Costs[] = [{}, {}]; // Different in bidirectional search: g(x) + h(x, y), g(y), 
    let g_score: Costs[] = [{}, {}]; // where g(x) is from x to start and g(y) is from y to end
    let came_from: CameFrom[] = [{}, {}];
    let sc = `${start.x}:${start.y}`;
    let ec = `${end.x}:${end.y}`;
    let neighbours: Neighbour[][] = [[], []];
    f_score[0][sc] = 0;
    f_score[1][ec] = 0;
    g_score[0][sc] = 0;
    g_score[1][ec] = 0;
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
        path.pop();
        path.push(...path2);
        
        let newOpen: Graph[] = [];
        newOpen.push(...open[0]);
        newOpen.push(...open[1]);
        return {path: path, nodes: [], open: newOpen, closed, length: 0};
      }

      neighbours = [this.getNeighbours(current[0], ec, grid), this.getNeighbours(current[1], sc, grid)];
      neighbours.forEach((direction, d) => {
        direction.forEach(n => {
          let next = n[0];
          let nc = g_score[d][current[d].coord] + next.movementCost + (n[1] > 3 ? this.diagonalCost-1 : 0);
          if (g_score[d][next.coord] === undefined || nc < g_score[d][next.coord]) {
            let h = this.hvalue(current[1-d], next);
            g_score[d][next.coord] = nc;
            f_score[d][next.coord] = nc + h + g_score[1-d][current[1-d].coord];
            came_from[d][next.coord] = current[d];
            //@ts-ignore
            open[d].insertSorted(next, (b: Graph, a: Graph) => {
              return f_score[d][a.coord] - f_score[d][b.coord];
            });
          }
        });
      });
    }
    let newOpen: Graph[] = [];
    newOpen.push(...open[0]);
    newOpen.push(...open[1]);
    return {path: [], nodes: [], open: newOpen, closed, length: 0};
  }

  hvalue (end: point, node: Graph | Point): number {
    let result = 0;
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
    else { // Manhattan distance is the best for non diagonal movement
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