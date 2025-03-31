import { ArrayUtils } from "../common/array-utils.js";
import { Grid, GridOptions } from "../common/grid.js";
import { GridHighlight, GridHighlightOptions } from "../common/grid-highlight.js";

{
    /* ---------------------------------- types --------------------------------- */
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.gCost = 0.0;
            this.hCost = 0.0;
            this.isObstacle = false;
            this.parent = null;
        }

        fCost() { return this.gCost + this.hCost };

        reset() {
            this.gCost = 0;
            this.hCost = 0;
            this.parent = null;
        }
    }

    class Pathfinder {
        constructor(height, width) {
            this.height = height;
            this.width = width;
            this.nodes = ArrayUtils.createMatrix(height, width, new Node());
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    this.nodes[i][j] = new Node(j, i);
                }
            }

            this.speed = 1;
            this.open = new Array();
            this.closed = new Set();
            this.start = null;
            this.end = null;
        }

        // reset() {
        //     this.closed.forEach((value) => )
        //     for (let i = 0; i < this.closed.size; i++) {
        //         Set

        //     }
        // }

        find() {

        }
    }

    class MazeFactory
    {
        
    }

    /* --------------------------------- script --------------------------------- */
    let menuContainer = document.querySelector("[menu-container]");
    let gridContainer = document.querySelector("[grid-container]");

    let coursorMode = 0;
    document.addEventListener("dragstart", (e) => e.preventDefault());

    let height = 32;
    let width = 32;

    let options = new GridOptions();
    options.tileSizeX = 20;
    options.tileSizeY = 20;

    let grid = new Grid(height, width, options);
    gridContainer.appendChild(grid.root);

    let gridHighlight = new GridHighlight(grid);
    let pathfinder = new Pathfinder(height, width);

    for (let i = 0; i < grid.height; i++) {
        for (let j = 0; j < grid.width; j++) {
            let tile = grid.tiles[i][j];

            tile.addEventListener("mousedown", () => {
                if (coursorMode == 0) {
                    let isObstacle = pathfinder.nodes[i][j].isObstacle;
                    if (isObstacle) tile.style.backgroundColor = options.tileColor;
                    else tile.style.backgroundColor = "black";
                    pathfinder.nodes[i][j].isObstacle = !isObstacle;
                }
                else if (coursorMode == 1) {
                    if (pathfinder.start != null) {
                        let node = pathfinder.start;
                        grid.getTile(node.y, node.x).style.backgroundColor = options.tileColor;
                        grid.getTile(i, j).style.backgroundColor = "green";
                    }
                    pathfinder.start = pathfinder.nodes[i][j];
                }
            });
        }
    }
}