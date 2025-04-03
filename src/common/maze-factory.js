import { ArrayUtils } from "./array-utils.js";
import { NumberUtils } from "./number-utils.js";

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class MazeFactory {
    /**
     * @param {Number} height 
     * @param {Number} width 
     */
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.result = ArrayUtils.createMatrix(height, width, true);
        this._visited = ArrayUtils.createMatrix(height, width, false);

        // function makeTransition(x, y) {
        //     this.result[y][x] = false;
        //     this._visited[y][x] = true;
        //     let directons = new Array(
        //         new Vector2(2, 0),
        //         new Vector2(0, -2),
        //         new Vector2(-2, 0),
        //         new Vector2(0, 2)
        //     )

        //     while (directons.length > 0) {
        //         let index = NumberUtils.randomInt(0, directons.length);
        //         let dir = directons[index];
        //         directons.splice(index, 1);
        //         let notVisited = !this._visited[y + dir.y][x + dir.x];
        //         let xInRange = x + dir.x >= 0 && x + dir.x < width;
        //         let yInRange = y + dir.y >= 0 && y + dir.y < height;
        //         if (notVisited && xInRange && yInRange) {
        //             let xWall = x + Math.round(dir.x / 2);
        //             let yWall = y + Math.round(dir.y / 2);
        //             this.result[yWall][xWall] = false;
        //             makeTransition(x + dir.x, y + dir.y);
        //         }
        //     }
        // }

        let xStart = NumberUtils.randomInt(0, width);
        let yStart = NumberUtils.randomInt(0, height);
        this._makeTransition(xStart, yStart);
    }

    _makeTransition(x, y) {
        this.result[y][x] = false;
        this._visited[y][x] = true;

        let directons = new Array(
            new Vector2(2, 0),
            new Vector2(0, -2),
            new Vector2(-2, 0),
            new Vector2(0, 2)
        )

        while (directons.length > 0) {
            let index = NumberUtils.randomInt(0, directons.length - 1);
            let dir = directons[index];
            directons.splice(index, 1);
            let xInRange = x + dir.x >= 0 && x + dir.x < this.width;
            let yInRange = y + dir.y >= 0 && y + dir.y < this.height;
            if (xInRange && yInRange) {
                if (!this._visited[y + dir.y][x + dir.x]) {
                    let xWall = x + Math.round(dir.x / 2);
                    let yWall = y + Math.round(dir.y / 2);
                    this.result[yWall][xWall] = false;
                    this._makeTransition(x + dir.x, y + dir.y);
                }
            }
        }
    }
}