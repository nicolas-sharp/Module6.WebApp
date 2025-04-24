import { ArrayUtils } from "../common/array-utils.js";

{
    /* --------------------------------- fields --------------------------------- */
    const colors = ["black", "green", "red", "blue", "cyan", "purple", "orange", "brown"];
    let field = document.querySelector(".field");
    let startButton = document.querySelector(".start-btn");
    let resetButton = document.querySelector(".reset-btn");

    let dots = new Array();
    let centroids = new Array();


    /* --------------------------------- methods -------------------------------- */
    function distance(a, b) {
        let dx = a.dataset.x - b.dataset.x;
        let dy = a.dataset.y - b.dataset.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function createDot(x, y, group = 0) {
        const element = document.createElement('div');
        element.dataset["x"] = x;
        element.dataset["y"] = y;
        element.dataset["group"] = group;
        element.className = "dot";
        element.style.color = colors[group];
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        field.appendChild(element);
        dots.push(element)
        return element;
    }

    function createCentroid(x, y, group = 0) {
        const element = document.createElement('div');
        element.dataset["x"] = x;
        element.dataset["y"] = y;
        element.dataset["group"] = group;
        element.className = "centroid";
        element.style.backgroundColor = colors[group];
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        field.appendChild(element);
        centroids.push(element);
        return element;
    }

    function getK() {
        const maxK = 10;
        let result = 2;
        return result;
    }

    function clusterization() {
        let k = getK();
        if (k == 0) return;

        //рандомное расположение центроидов
        for (let i = 0; i < k; i++) {
            let dot = ArrayUtils.getRandom(dots);
            let x = dot.dataset.x;
            let y = dot.dataset.y;
            createCentroid(x, y, i + 1);
        }

        //кластеризация
        for (let i = 0; i < dots.length; i++) {
            let nearest = centroids[0];
            let nearestDistance = distance(dots[i], nearest);
            for (let j = 0; j < centroids.length; j++) {
                let nextDistance = distance(dots[i], centroids[j]);
                if (nextDistance < nearestDistance) {
                    nearest = centroids[j];
                    nearestDistance = nextDistance;
                }
            }
            dots[i].style.backgroundColor = colors[nearest.dataset.group];
        }
    }

    function resetCentroids() {
        for (let i = 0; i < centroids.length; i++) {
            field.removeChild(centroids[i]);
        }
        centroids.length = 0;
    }

    function resetDots() {
        for (let i = 0; i < dots.length; i++) {
            field.removeChild(dots[i]);
        }
        dots.length = 0;
    }


    /* --------------------------------- script --------------------------------- */
    field.addEventListener("click", (event) => createDot(event.clientX, event.clientY));

    startButton.addEventListener("click", () => {
        resetCentroids();
        clusterization();
    });

    resetButton.addEventListener("click", () => {
        resetCentroids();
        resetDots();
    });
}