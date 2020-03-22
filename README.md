pathfinding-js
==============
#### A library for pathfinding in grid-based maps. ####

Introduction
------------
This library is meant to provide pathfinding algorithms which are easily to use in your own project, please note that this library is still in early stages of development.

This library is created in typescript and provides types.

There is a [demo project](https://casper64.github.io/pathfinding-js) ([repository](https://github.com/Casper64/Casper64.github.io/blob/master/pathfinding-js/src/index.ts)) to show how you could implement the library in a sort of visualisation.

Note: you can only use this library for 2d grids!

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

Basic usage
-----------
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

Advanced usage
--------------
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
