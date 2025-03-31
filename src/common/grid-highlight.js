export class GridHighlightOptions {
    constructor(color = "yellow", opacity = "0.5") {
        this.color = color;
        this.opacity = opacity;
    }
}

export class GridHighlight {
    /**
     * @param {Grid} grid 
     * @param {GridHighlightOptions} options
     */
    constructor(grid, options = null) {
        this.isEnabled = true;
        options = options ?? new GridHighlightOptions();

        for (let i = 0; i < grid.height; i++) {
            for (let j = 0; j < grid.width; j++) {
                let tile = grid.tiles[i][j];
                let highlight = document.createElement("div");
                highlight.style.height = "100%";
                highlight.style.width = "100%";
                highlight.style.backgroundColor = options.color;
                highlight.style.opacity = 0;

                highlight.style.borderTopLeftRadius = tile.style.borderTopLeftRadius;
                highlight.style.borderTopRightRadius = tile.style.borderTopRightRadius;
                highlight.style.borderBottomLeftRadius = tile.style.borderBottomLeftRadius;
                highlight.style.borderBottomRightRadius = tile.style.borderBottomRightRadius;

                tile.appendChild(highlight);

                highlight.addEventListener("mouseenter", () => {
                    if (this.isEnabled) highlight.style.opacity = options.opacity;
                    else highlight.style.opacity = 0;
                });

                highlight.addEventListener("mouseleave", () => {
                    if (this.isEnabled) highlight.style.opacity = 0;
                });
            }
        }
    }
}