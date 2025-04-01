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
    }

    class PathfindingVisualization {
        /**
         * @param {Grid} grid 
         */
        constructor(grid) {
            this.grid = grid;
            this.height = grid.height;
            this.width = grid.width;

            this._nodes = ArrayUtils.createMatrix(this.height, this.width);
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    this._nodes[i][j] = new Node(j, i);
                }
            }

            this._speed = 1;
            this._open = new Array();
            this._closed = new Set();
            this._start = null;
            this._end = null;
            this._drawDelay = 3;
            this._paintTime = 0;
            this._timeouts = new Array();
        }

        setStart(x, y) {
            let oldColor = this.grid.options.tileColor;
            let newColor = "blue";
            if (this._start != null) {
                let oldX = this._start.x;
                let oldY = this._start.y;
                this.grid.tiles[oldY][oldX].style.backgroundColor = oldColor;
            }

            this._start = this._nodes[y][x];
            this.grid.tiles[y][x].style.backgroundColor = newColor;
        }

        setEnd(x, y) {
            let oldColor = this.grid.options.tileColor;
            let newColor = "blue";
            if (this._end != null) {
                let oldX = this._end.x;
                let oldY = this._end.y;
                this._paint(x, y, newColor);
                this.grid.tiles[oldY][oldX].style.backgroundColor = oldColor;
            }

            this._end = this._nodes[y][x];
            this._paint(x, y, newColor);
        }

        isObstacle(x, y) { return this._nodes[y][x].isObstacle; }

        setObstacle(x, y, state) {
            let color = this.grid.options.tileColor;
            if (state) color = "black";
            this._nodes[y][x].isObstacle = state;
            this._paint(x, y, color);
        }

        /**
         * @param {Array<Array<boolean>>} map 
         */
        setObstacles(map) {
            for (let i = 0; i < map.height; i++) {
                for (let j = 0; j < map.width; j++) {
                    if (map[i][j]) this._nodes[i][j].isObstacle = map[i][j];
                }
            }
        }

        setSpeed(value) { this._speed = value; }

        start() {
            this._reset();
            if (this._start == this._end) {
                let x = this._start.x;
                let y = this._start.y;
                this._paint(x, y, "cyan");
                return;
            }

            this._open.push(this._start);
            let endIsReached = false;
            while (this._open.length > 0) {
                let current = this._open.shift();
                this._closed.add(current);
                this._paintQueue(current.x, current.y, "cyan");
                if (current == this._end) {
                    endIsReached = true;
                    break;
                }

                let neighbours = this._getNeighbours(current.x, current.y);
                for (const next of neighbours) {

                    this._paintQueue(next.x, next.y, "orange");
                    let gCost = current.gCost + this._distance(current.x, current.y, next.x, next.y);
                    if (next.parent == null) {
                        next.gCost = gCost;
                        next.hCost = this._distance(next.x, next.y, this._end.x, this._end.y);
                        next.parent = current;
                        this._open.push(next);
                        this._open.sort((a, b) => a.fCost() - b.fCost());
                    }
                    else if (gCost < next.gCost) {
                        next.gCost = gCost;
                        next.parent = current;
                        this._open.sort((a, b) => a.fCost() - b.fCost());
                    }
                }

                this._paintQueue(current.x, current.y, "white");
            }

            if (endIsReached) {
                let current = this._end;
                this._paintQueue(current.x, current.y, "#22ff00");
                while (current != this._start) {
                    current = current.parent;
                    this._paintQueue(current.x, current.y, "#22ff00");
                }
            }
        }

        _reset() {
            for (const item of this._open) {
                this._resetNode(item);
                if (item.isObstacle) this._paint(item.x, item.y, "black");
                else this._paint(item.x, item.y, this.grid.options.tileColor);
            }

            for (const item of this._closed) {
                this._resetNode(item);
                if (item.isObstacle) this._paint(item.x, item.y, "black");
                else this._paint(item.x, item.y, this.grid.options.tileColor);
            }

            for (let i = 0; i < this._timeouts.length; i++) {
                clearTimeout(this._timeouts[i]);
            }

            this._paint(this._start.x, this._start.y, "green");
            this._paint(this._end.x, this._end.y, "green");

            this._open = new Array();
            this._closed = new Set();
            this._paintTime = 0;
            this._timeouts = new Array();
        }

        _resetNode(node) {
            node.gCost = 0;
            node.hCost = 0;
            node.parent = null;
        }

        _getNeighbours(x, y) {
            let result = new Array();

            if (y + 1 < this.height) {
                let node = this._nodes[y + 1][x];
                if (!node.isObstacle && !this._closed.has(node)) {
                    result.push(node);
                }
            }

            if (y - 1 >= 0) {
                let node = this._nodes[y - 1][x];
                if (!node.isObstacle && !this._closed.has(node)) {
                    result.push(node);
                }
            }

            if (x + 1 < this.width - 1) {
                let node = this._nodes[y][x + 1];
                if (!node.isObstacle && !this._closed.has(node)) {
                    result.push(node);
                }
            }

            if (x - 1 >= 0) {
                let node = this._nodes[y][x - 1];
                if (!node.isObstacle && !this._closed.has(node)) {
                    result.push(node);
                }
            }

            if (y + 1 < this.height && x + 1 < this.width) {
                let node = this._nodes[y + 1][x + 1];
                if (!node.isObstacle && !this._closed.has(node)) {
                    result.push(node);
                }
            }

            if (y - 1 >= 0 && x + 1 < this.width) {
                let node = this._nodes[y - 1][x + 1];
                if (!node.isObstacle && !this._closed.has(node)) {
                    result.push(node);
                }
            }

            if (y - 1 >= 0 && x - 1 >= 0) {
                let node = this._nodes[y - 1][x - 1];
                if (!node.isObstacle && !this._closed.has(node)) {
                    result.push(node);
                }
            }

            if (y + 1 < this.height && x - 1 >= 0) {
                let node = this._nodes[y + 1][x - 1];
                if (!node.isObstacle && !this._closed.has(node)) {
                    result.push(node);
                }
            }

            return result;
        }

        _paintQueue(x, y, color) {
            this._paintTime += this._drawDelay;
            let id = setTimeout(() => this.grid.tiles[y][x].style.backgroundColor = color, this._paintTime);
            this._timeouts.push(id);
        }

        _paint(x, y, color) {
            this.grid.tiles[y][x].style.backgroundColor = color;
        }

        _distance(x1, y1, x2, y2) {
            let dx = x2 - x1;
            let dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    /* --------------------------------- script --------------------------------- */
    let menuContainer = document.querySelector("[menu-container]");
    let gridContainer = document.querySelector("[grid-container]");

    let cursorMode = 0;
    document.addEventListener("dragstart", (e) => e.preventDefault());

    let height = 32;
    let width = 32;

    let options = new GridOptions();
    options.tileSizeX = 20;
    options.tileSizeY = 20;

    let grid = new Grid(height, width, options);
    gridContainer.appendChild(grid.root);

    let gridHighlight = new GridHighlight(grid);
    let pathfinder = new PathfindingVisualization(grid);

    for (let i = 0; i < grid.height; i++) {
        for (let j = 0; j < grid.width; j++) {
            let tile = grid.tiles[i][j];

            tile.addEventListener("mousedown", () => {
                if (cursorMode == 0) {
                    if (pathfinder.isObstacle(j, i)) pathfinder.setObstacle(j, i, false);
                    else pathfinder.setObstacle(j, i, true);
                }
                else if (cursorMode == 1) pathfinder.setStart(j, i);
                else if (cursorMode == 2) pathfinder.setEnd(j, i);
            });
        }
    }

    let startButton = document.querySelector(".start-btn");
    startButton.addEventListener("click", () => {
        pathfinder.setStart(0, 0);
        pathfinder.setEnd(31, 31);
        pathfinder.start();
    });
}