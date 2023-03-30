let predators = [];
let preys = [];

function setIntervalX(callback, delay, reps) {
    let x = 0;
    var intervalID = setInterval(function () {
        callback();
        if (++x === reps) {
            window.clearInterval(intervalID);
        }
    }, delay);
}

function makeTimeStep() {
    for (let i = 0; i < preys.length; i++) {
        preys[i].move(predators);
    }
    for (let j = 0; j < predators.length; j++) {
        predators[j].move(preys);
    }
    for (let j = 0; j < predators.length; j++) {
        preys = predators[j].eatAliment(preys);
    }
};


window.onload = function () {
    var ecosystemWidth = document.getElementById('ecosystem').clientWidth;
    var ecosystemHeight = document.getElementById('ecosystem').clientHeight;
    var ecosystem = [ecosystemWidth, ecosystemHeight];
    for (let i = 0; i < 250; i++) {
        let size = getRandomInRange(20, 30);
        let positionX = getRandomInRange(100, 700);
        let positionY = getRandomInRange(100, 700);
        let speed = getRandomInRange(5, 20);
        let energy = getRandomInRange(90, 110);
        let prey = new Animal([positionX, positionY], size, speed, energy, 'prey.svg', 'prey', ecosystem);
        preys.push(prey);
    }
    for (let i = 0; i < 250; i++) {
        let size = getRandomInRange(20, 30);
        let positionX = getRandomInRange(100, 700);
        let positionY = getRandomInRange(100, 700);
        let speed = getRandomInRange(5, 20);
        let energy = getRandomInRange(90, 110);
        let prey = new PrudentPredator([positionX, positionY], size, speed, energy, 'prey_flying.svg', 'prey', ecosystem);
        preys.push(prey);
    }
    for (let i = 0; i < 3; i++) {
        let size = getRandomInRange(20, 30);
        let positionX = getRandomInRange(100, 700);
        let positionY = getRandomInRange(100, 700);
        let speed = getRandomInRange(5, 20);
        let energy = getRandomInRange(90, 110);
        let predator = new HungryPredator([positionX, positionY], size, speed, energy, 'predator.svg', 'predator', ecosystem);
        predators.push(predator);
    }
    setIntervalX(makeTimeStep, 300, 100);
};