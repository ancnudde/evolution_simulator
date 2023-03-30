function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



class Entity {
    constructor(position, size, ecosystem) {
        this.position = position;
        this.size = size;
        this.image = null;
        this.ecosystem = ecosystem;
    }

    getPosition() {
        return this.position;
    }

    getXPosition() {
        return this.position[0];
    }

    getYPosition() {
        return this.position[1];
    }

    getSize() {
        return this.size;
    }

    disappear() {
        document.getElementById('ecosystem').removeChild(this.image);
    }
}

class Animal extends Entity {
    constructor(position, size, speed, energy, image, className, ecosystem) {
        super(position, size, ecosystem);
        this.speed = speed;
        this.energy = energy;
        this.picturePath = null;
        this.image = null;
        this.picturePath = image;
        this.setImage();
        this.image.classList.add(className);
        this.printRepresentation();
    }

    setImage() {
        let imageElement = document.createElement('img');
        imageElement.classList.add('animal');
        imageElement.src = this.picturePath;
        imageElement.width = this.size;
        imageElement.height = this.size;
        imageElement.style.top = `${this.position[1]}px`;
        imageElement.style.left = `${this.position[0]}px`;
        this.image = imageElement;

    }

    printRepresentation() {
        document.getElementById('ecosystem').appendChild(this.image);
    }

    checkMove(newX, newY) {
        if (newX < 0) {
            this.image.classList.add('animal--no-transition');
            newX = this.ecosystem[0] - (this.size / 2);
        } else if (newX > this.ecosystem[0] - (this.size / 2)) {
            this.image.classList.add('animal--no-transition');
            newX = 0;
        }
        if (newY < 0) {
            this.image.classList.add('animal--no-transition');
            newY = this.ecosystem[1] - (this.size / 2);
        } else if (newY > this.ecosystem[1] - (this.size / 2)) {
            this.image.classList.add('animal--no-transition');
            newY = 0;
        }
        this.image.style.left = `${newX}px`;
        this.image.style.top = `${newY}px`;
        this.position = [newX, newY];
        let thisImage = this.image;
        if (this.image.classList.contains('animal--no-transition')) {
            setTimeout(function () {
                if (thisImage.classList.contains('animal--no-transition')) {
                    thisImage.classList.remove('animal--no-transition');
                }
            }, 100);
        }
    }

    move() {
        let xMove = getRandomInRange(-this.speed, this.speed);
        let yMove = getRandomInRange(-this.speed, this.speed);
        let newX = parseInt(this.image.style.left, 10) + xMove;
        let newY = parseInt(this.image.style.top, 10) + yMove;
        this.checkMove(newX, newY);
    }

    checkOverlapping(other) {
        let xOverlap = false;
        let yOverlap = false;
        if (other.getXPosition() < (this.getXPosition() + this.getSize()) &&
            (this.getXPosition()) < (other.getXPosition() + other.getSize())) {
            xOverlap = true;
        }
        if (other.getYPosition() < (this.getYPosition() + this.getSize())
            && this.getYPosition() < (other.getYPosition() + other.getSize())) {
            yOverlap = true;
        }
        return (xOverlap && yOverlap);
    }

    eatAliment(aliment) {
        let livingPreys = [];
        for (let i = 0; i < aliment.length; i++) {
            if (this.checkOverlapping(aliment[i])) {
                aliment[i].disappear();
            } else {
                livingPreys.push(aliment[i]);
            }
        }
        return livingPreys;
    }


}

class HungryPredator extends Animal {
    constructor(position, size, speed, energy, image, className, ecosystem) {
        super(position, size, speed, energy, image, className, ecosystem);
    }

    getClosestPrey(preys) {
        let closestPoint = [0, 0];
        let maxDistance = Infinity;
        for (let i = 0; i < preys.length; i++) {
            let distance =
                (this.getXPosition() - preys[i].getXPosition()) ** 2 +
                (this.getYPosition() - preys[i].getYPosition()) ** 2;
            if (distance < maxDistance) {
                closestPoint = [preys[i].getXPosition(), preys[i].getYPosition()];
                maxDistance = distance;
            }
        }
        return closestPoint;
    }

    move(preys) {
        let closestPoint = this.getClosestPrey(preys);
        let yDistanceBetween = closestPoint[1] - this.getYPosition();
        let xDistanceBetween = closestPoint[0] - this.getXPosition();
        let predatorPreyAngle = Math.atan2(xDistanceBetween, yDistanceBetween);
        let xMove = this.speed * Math.sin(predatorPreyAngle);
        let yMove = this.speed * Math.cos(predatorPreyAngle);
        this.checkMove(this.getXPosition() + xMove, this.getYPosition() + yMove);
    }
}

class PrudentPredator extends Animal {
    getClosestPredator(predators) {
        let closestPoint = [0, 0];
        let maxDistance = Infinity;
        for (let i = 0; i < predators.length; i++) {
            let xDistance = Math.abs(this.getXPosition() - predators[i].getXPosition());
            let yDistance = Math.abs(this.getYPosition() - predators[i].getYPosition());
            let distance =
                Math.min(xDistance, this.ecosystem[0] - xDistance) ** 2 +
                Math.min(yDistance, this.ecosystem[1] - yDistance) ** 2;
            if (distance < maxDistance) {
                closestPoint = [predators[i].getXPosition(), predators[i].getYPosition()];
                maxDistance = distance;
            }
        }
        return closestPoint;
    }

    move(preys) {
        let closestPoint = this.getClosestPredator(preys);
        let yDistanceBetween = closestPoint[1] - this.getYPosition();
        let xDistanceBetween = closestPoint[0] - this.getXPosition();
        let predatorPreyAngle = Math.atan2(xDistanceBetween, yDistanceBetween);
        let xMove = this.speed * Math.sin(predatorPreyAngle);
        let yMove = this.speed * Math.cos(predatorPreyAngle);
        let newX = Math.abs(xDistanceBetween) < this.ecosystem[0] / 2
            ? this.getXPosition() - xMove : this.getXPosition() + xMove;
        let newY = Math.abs(yDistanceBetween) < this.ecosystem[1] / 2
            ? this.getYPosition() - yMove : this.getYPosition() + yMove;
        this.checkMove(newX, newY);
    }
}