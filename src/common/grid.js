import { ArrayUtils } from "./array-utils.js";

export class GridOptions {
    constructor(
        tileSizeX = 50,
        tileSizeY = 50,
        tileColor = "grey",
    ) {
        this.tileSizeX = tileSizeX;
        this.tileSizeY = tileSizeY;
        this.tileColor = tileColor;
    }
}

export class Grid {
    /** 
     * @param {Number} height
     * @param {Number} width
     * @param {GridOptions} options
    */
    constructor(height, width, options = null) {
        this.height = height;
        this.width = width;
        this.options = options ?? new GridOptions();

        this.root = document.createElement("div");
        this.tiles = ArrayUtils.createMatrix(height, width);
        this.highlightEnabled = true;

        this.root.style.display = "grid";
        this.root.style.gridTemplateRows = `repeat(${height}, ${this.options.tileSizeY}px)`;
        this.root.style.gridTemplateColumns = `repeat(${width}, ${this.options.tileSizeX}px)`;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let tile = document.createElement("div");
                tile.dataset.x = j;
                tile.dataset.y = i;
                tile.style.backgroundColor = this.options.tileColor;
                tile.style.border = "1px solid black";
                this.root.appendChild(tile);
                this.tiles[i][j] = tile;
            }
        }

        this.tiles[0][0].style.borderTopLeftRadius = "10px";
        this.tiles[0][width - 1].style.borderTopRightRadius = "10px";
        this.tiles[height - 1][0].style.borderBottomLeftRadius = "10px";
        this.tiles[height - 1][width - 1].style.borderBottomRightRadius = "10px";
    }
}