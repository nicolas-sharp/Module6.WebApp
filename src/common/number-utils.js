export const NumberUtils =
{
    /**
     * @param {Number} min 
     * @param {Number} max 
     * @returns {Number}
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * @param {Number} min 
     * @param {Number} max 
     * @returns {Number}
    */
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
}