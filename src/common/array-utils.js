export const ArrayUtils =
{
    /**
     * @param {Number} height 
     * @param {Number} width
     */
    createMatrix(height, width, defaultValue = null) {
        let result = new Array(height);
        for (let i = 0; i < height; i++) {
            result[i] = new Array(width);
            for (let j = 0; j < width; j++) {
                result[i][j] = defaultValue;
            }
        }
        return result;
    },

    /**
     * @param {Array} array 
     * @returns
     */
    getRandom(array) { return array[Math.floor(Math.random() * array.length)]; }
}