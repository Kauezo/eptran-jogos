let dino = document.getElementById("dino");
let startButton = document.getElementById("startButton");
let restartButton = document.getElementById("restartButton");
let gameOverMessage = document.getElementById("gameOverMessage");
let scoreDisplay = document.getElementById("scoreDisplay");


let isMovingRight = false;
let isMovingLeft = false;
let dinoPosition = 50;
let gameInterval;
let cactusInterval;
let cactusSpeedFactor = 3;
let score = 0;



let cactuses = [];
const MAX_CACTUSES = 8;
const TRACK_POSITIONS = [55, 245, 465, 660];

let point = null;
let gameIsActive = false; // Variável para verificar se o jogo está ativo

window.onload = function() {
    dino.style.position = "absolute";
    dino.style.transform = "translate(-50%, -50%)";
    dino.style.backgroundImage = "url('../boneco1.png')";
    dino.style.backgroundSize = "cover";
    dino.style.backgroundPosition = "center";
    dino.style.backgroundRepeat = "no-repeat";
};

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        isMovingRight = true;
    } else if (event.key === "ArrowLeft") {
        isMovingLeft = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowRight") {
        isMovingRight = false;
    } else if (event.key === "ArrowLeft") {
        isMovingLeft = false;
    }
});

function createCactus() {
    if (cactuses.length >= MAX_CACTUSES) return;

    let trackIndex;
    let positionOccupied = true;
    let attempts = 0;

    while (positionOccupied && attempts < 10) {
        trackIndex = Math.floor(Math.random() * TRACK_POSITIONS.length);
        positionOccupied = cactuses.some(cactus => cactus.position === TRACK_POSITIONS[trackIndex]);
        attempts++;
    }

    if (attempts < 10) {
        let cactus = document.createElement("div");
        cactus.classList.add("cactus");
        cactus.style.width = "100px";
        cactus.style.height = "205px";

        let randomImageIndex = Math.floor(Math.random() * cactusImages.length);
        cactus.style.backgroundImage = `url('${cactusImages[randomImageIndex]}')`;
        cactus.style.backgroundSize = "cover";
        cactus.style.backgroundPosition = "center";
        cactus.style.backgroundRepeat = "no-repeat";
        cactus.style.position = "absolute";
        cactus.style.top = "0px";
        cactus.style.left = TRACK_POSITIONS[trackIndex] + "px";
        document.getElementById("gameArea").appendChild(cactus);

        cactuses.push({ element: cactus, speed: Math.random() * 3 + 2, position: TRACK_POSITIONS[trackIndex] });
    }
}

const cactusImages = [
    '../Carro1.png',
    '../Carro2.png',
    '../Carro3.png',
    '../Carro4.png',
    '../Carro5.png',
    '../Carro7.png',
    '../Carro9.png',
    '../Carro10.png',
    '../Carro11.png',
    '../Carro12.png',
    '../Carro14.png',
    '../Carro15.png',
    '../f1bebe.png',
    '../f1branca.png',
    '../f1laranjaa.png',
    '../f1roxa.png',
    '../f1vermelha.png',
];

function createPoint() {
    if (point || !gameIsActive) return;

    point = document.createElement("div");
    point.classList.add("point");
    point.style.width = "50px";
    point.style.height = "50px";
    point.style.backgroundImage = "url('../moeda.png')";
    point.style.position = "absolute";
    point.style.top = "380px";
    point.style.backgroundSize = "cover";
    point.style.backgroundPosition = "center";
    point.style.backgroundRepeat = "no-repeat";
    
    const minLeft = 100;
    const maxLeft = 700;
    point.style.left = Math.random() * (maxLeft - minLeft) + minLeft + "px";

    document.getElementById("gameArea").appendChild(point);

    pointInterval = setInterval(() => {
        let dinoRect = dino.getBoundingClientRect();
        let pointRect = point.getBoundingClientRect();

        if (
            pointRect.bottom > dinoRect.top &&
            pointRect.top < dinoRect.bottom &&
            pointRect.right > dinoRect.left &&
            pointRect.left < dinoRect.right
        ) {
            score += 10;
            scoreDisplay.innerText = `Score: ${score.toString().padStart(7, '0')}`;
            point.remove();
            point = null;
            clearInterval(pointInterval);
            
            if (gameIsActive) {
                setTimeout(createPoint, 2000);
            }
        }
    }, 20);
}

function moveCactuses() {
    cactusInterval = setInterval(() => {
        cactuses.forEach((cactus, index) => {
            let cactusPosition = parseInt(cactus.element.style.top);
            cactusPosition += cactus.speed * cactusSpeedFactor;

            if (cactusPosition >= 900) {
                cactus.element.remove();
                cactuses.splice(index, 1);
            } else {
                cactus.element.style.top = cactusPosition + "px";

                let dinoRect = dino.getBoundingClientRect();
                let cactusRect = cactus.element.getBoundingClientRect();

                if (
                    cactusRect.bottom > dinoRect.top &&
                    cactusRect.top < dinoRect.bottom &&
                    cactusRect.right > dinoRect.left &&
                    cactusRect.left < dinoRect.right
                ) {
                    gameOver();
                }
            }
        });

        if (Math.random() < 0.02) {
            createCactus();
        }
    }, 20);
}

function increaseCactusSpeed() {
    setInterval(() => {
        if (gameIsActive) {
            cactusSpeedFactor += 0.5; // Aumenta a velocidade dos cactos
        }
    }, 30000); // Aumenta a velocidade a cada 10 segundos
}

function moveDino() {
    if (isMovingRight && dinoPosition < 100) {
        dinoPosition += 1.3;
    } else if (isMovingLeft && dinoPosition > 0) {
        dinoPosition -= 1.3;
    }
    dino.style.left = dinoPosition + "%";
}

function startGame() {
    gameIsActive = true; // Ativa o jogo
    startButton.style.display = "none";
    gameOverMessage.style.display = "none";
    restartButton.style.display = "none";
    cactuses.forEach(cactus => cactus.element.remove());
    cactuses = [];
    cactusSpeedFactor = 1; // Reinicia a velocidade dos cactos
    score = 0;
    scoreDisplay.innerText = `Score: ${score.toString().padStart(7, '0')}`;

    dino.style.position = "absolute";
    dino.style.left = "50%";
    dino.style.top = "50%";
    dino.style.transform = "translate(-50%, -50%)";

    moveCactuses();
    increaseCactusSpeed(); // Inicia o aumento da velocidade
    gameInterval = setInterval(moveDino, 20);
    createPoint();
}

function gameOver() {
    gameIsActive = false; // Desativa o jogo
    clearInterval(gameInterval);
    clearInterval(cactusInterval);
    clearInterval(pointInterval);
    gameOverMessage.style.display = "block";
    restartButton.style.display = "block";
    
    if (point) {
        point.remove();
        point = null;
    }
}

function restartGame() {
    dinoPosition = 50;
    startGame();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

function getSelectedCharacter() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('character');
}

// Exemplo de como você pode usar o personagem selecionado
window.onload = function() {
    const selectedCharacter = getSelectedCharacter();
    
    let dino = document.getElementById("dino");

    if (selectedCharacter === "char1") {
        dino.style.backgroundImage = "url('../boneco2.png')";
    } else if (selectedCharacter === "char2") {
        dino.style.backgroundImage = "url('../boneco1.png')";
    } else if (selectedCharacter === "char3") {
        dino.style.backgroundImage = "url('../Boneco3.png')";
    } else if (selectedCharacter === "char4") {
        dino.style.backgroundImage = "url('../Boneco4.png')";
    }
    dino.style.backgroundSize = "cover";
    dino.style.backgroundPosition = "center";
};

