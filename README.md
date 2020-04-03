pathfinding-js
==============
#### A library for pathfinding in grid-based maps. ####

Introduction
------------
This library is meant to provide pathfinding algorithms which are easily to use in your own project, please note that this library is still in early stages of development.

This library is created in typescript and provides types.

I made a visualisation with this library for square grids [here](https://casper64.github.io/pathfinding-js) ([code](https://github.com/Casper64/Casper64.github.io/blob/master/pathfinding-js/src/index.ts)).
And another visualisation how the algorithms generate a navigation mesh (non square 2d plane) based on the shapes you place in the 2d grid [here](https://casper64.github.io/pathfinding-js/navmesh) ([code](https://github.com/Casper64/Casper64.github.io/blob/master/pathfinding-js/navmesh/src/index.ts)) (working on implementing this in 3D!).

Note: This library is still in early stages of development so function and class names could change in the future!

Installation
------------
You can use it with Node.js and install the library with `npm`
```bash
npm install @cetfox24/pathfinding-js
```

Then, in your project:
```javascript
var pf = require('@cetfox24/pathfinding-js');
```

Or with typescript:
```typescript
import * as pf from "@cetfox24/pathfinding-js"
```

Alternatively you can copy the build file (build/@cetfox-pathfinding-js.min.js):
```html
<script src="/@cetfox24-pathfinding-js.min.js"></script>
<script>
// pf is defined as a global variable
var grid = new pf.Grid(10, 8);
</script></script>
```

Basic usage 2d square grids
---------------------------
Create a grid of width 10 and height 8:
```javascript
let grid = new pf.Grid(10, 8);
```
On creation all the nodes in the grid are empty, that means you could walk on them. To set a node to a solid 
or empty the node use the `setSolid` method.

For example, if you want to set the node on position (2, 4) solid, where the x coordinate is 2 and y coordinate is 4:
```javascript
grid.setSolid(2, 4, true);
```
There are several algorithms:
* Best-first-search: `BFS`
* Dijkstra's algorithm: `Dijkstra`
* A* algorithm: `AStar`

For example, to use the A* algorithm:
```javascript
let finder = new pf.AStar();
let result = finder.findPath({x: 1, y: 1}, {x: 9, y: 6}, grid);
let path = result.path;
```
In this example the A* algorithm finds the best path between the nodes (1, 1) and (9, 6).

For the `grid` defined previously `result.path` will be:
```javascript
[ {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 1, y: 6}, {x: 2, y: 6},
  {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6}, {x: 8, y: 6}, {x: 9, y: 6} ]
```

Advanced usage 2d square grids
------------------------------
Options can be passed in the constructor of the finder:
```javascript
let finder = new pf.AStar({
  diagonal: true,
  heuristic: 'eucledian',
  smoothenPath: true,
  bidirectional: true
});
```
In this example the A* algorithm searches from the start and from the end (bidirectional search), is allowed to go diagonal and smoothens the path and also uses the Eucledian heuristic function.

Usage for non-square 2d grids
-----------------------------
Define the outlay of your map:
```javascript
let mapVertices = [new pf.Point(0, 0), new pf.Point(100, 0), new pf.Point(100, 1000), new pf.Point(0, 100)];
let outlay = new pf.Polygon(mapVertices);
```
Next instantiate some object that should be in the map. They could be any polygon, but the algorithm Bowyer-Watson algorithm used in this library works best for convex polygons. Meaning that the shapes don't have large indents and they cannot overlap. For example:
```javascript
let object1Vertices = [new pf.Point(10, 10), new pf.Point(30, 5), new pf.Point(20, 20)];
let object1 = new pf.Polygon(object1Vertices);
let object2Vertices = [new pf.Point(40, 20), new pf.Point(70, 20), new pf.Point(70, 50), new pf.Point(40, 50)];
let object2 = new pf.Polygon(object2Vertices);
let object3Vertices = [new pf.Point(10, 90), new pf.Point(30, 60), new pf.Point(60, 60), new pf.Point(70, 80), new pf.Point(30, 95)];
let object3 = new pf.Polygon(object3Vertices);
let object4Vertices = [new pf.Point(85, 40), new pf.Point(95, 40), new pf.Point(95, 70), new pf.Point(85, 70)];
let object4 = new pf.Polygon(object4Vertices);

let grid = new pf.MeshGrid([object1, object2, object3, object4], outlay.vertices);
grid.generateMap();
```
The generation of the map takes a bit of time (around 500ms on a normal computer with 40 objects with 4 vertices), depending on how many objects you put in the grid. But when the map is generated the very fast A* algorithm saves you time and finds the path faster than with 2d square grids!. You have to use the A* algorithm in the following way:
```javascript
let finder = new pf.Astar(); // no options needed
let result = finder.findPathMesh(new pf.Point(2, 4), new pf.Point(95, 95), grid);
// result.path is the same path of points as with 'Astar.findPath'
```
The path given by 'Astar.findPathMesh' is not perfect, but close to perfect. In this case speed outweighs precision. 
Funny: The algorithms works better if you put more object into the map!