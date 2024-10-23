// Lista completa de 15 palavras
const allWords = [
    "TRÂNSITO", "CARRO", "PLACA", "RODOVIA", "PEDESTRE", "TREM", 
    "SINAL", "MULTA", "VELOCIDADE", "BICICLETA", "FAIXA", "RADAR", 
    "MOTO", "TRAFÉGO", "TRANSPORTE"
];

let grid = Array(13).fill().map(() => Array(13).fill(''));
let words = [];
let foundWords = new Set();
let isSelecting = false;
let startCell = null;
let currentCell = null;
let selectedCells = new Set();
let lastHighlightedCells = new Set();

// Função para selecionar aleatoriamente 8 palavras únicas da lista
function getRandomWords(wordArray, numWords) {
    let selectedWords = [];
    let usedIndices = new Set();

    while (selectedWords.length < numWords) {
        let randomIndex = Math.floor(Math.random() * wordArray.length);
        if (!usedIndices.has(randomIndex)) {
            selectedWords.push(wordArray[randomIndex]);
            usedIndices.add(randomIndex);
        }
    }

    return selectedWords;
}

function initializeGame() {
    // Limpar o estado anterior do jogo
    grid = Array(13).fill().map(() => Array(13).fill(''));
    words = [];
    foundWords = new Set();
    lastHighlightedCells = new Set();
    isSelecting = false;
    startCell = null;
    currentCell = null;
    
    // Iniciar novo jogo
    words = getRandomWords(allWords, 8);
    placeWords(words);
}

function getOffsets(direction) {
    const offsets = [
        [0, 1],   // horizontal right
        [1, 0],   // vertical down
        [1, 1],   // diagonal down-right
        [-1, 1],  
        [0, -1], 
        [-1, 0],  
        [-1, -1], 
        [1, -1]   
    ];
    return offsets[direction];
}

function canPlaceWord(word, startRow, startCol, direction) {
    const [rowOffset, colOffset] = getOffsets(direction);
    const wordLength = word.length;

    if (
        startRow + rowOffset * (wordLength - 1) < 0 ||
        startRow + rowOffset * (wordLength - 1) >= 13 ||
        startCol + colOffset * (wordLength - 1) < 0 ||
        startCol + colOffset * (wordLength - 1) >= 13
    ) {
        return false;
    }

    for (let i = 0; i < wordLength; i++) {
        const row = startRow + rowOffset * i;
        const col = startCol + colOffset * i;
        const currentCell = grid[row][col];
        
        if (currentCell !== '' && currentCell !== word[i]) {
            return false;
        }
    }

    return true;
}


function placeWord(word, startRow, startCol, direction) {
    const [rowOffset, colOffset] = getOffsets(direction);
    
    for (let i = 0; i < word.length; i++) {
        const row = startRow + rowOffset * i;
        const col = startCol + colOffset * i;
        grid[row][col] = word[i];
    }
}

function fillEmptySpaces() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 13; j++) {
            if (grid[i][j] === '') {
                const randomLetter = letters[Math.floor(Math.random() * letters.length)];
                grid[i][j] = randomLetter;
            }
        }
    }
}

function renderWordList() {
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';
    words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        if (foundWords.has(word)) {
            listItem.classList.add('found-word');
        }
        wordList.appendChild(listItem);
    });
}

function placeWords(words) {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            let row = Math.floor(Math.random() * 13);
            let col = Math.floor(Math.random() * 13);
            let direction = Math.floor(Math.random() * 8);

            if (canPlaceWord(word, row, col, direction)) {
                placeWord(word, row, col, direction);
                placed = true;
            }
        }
    });
    fillEmptySpaces();
    renderGrid();
    renderWordList();
}

// Funções para lidar com o toque
function handleTouchStart(event) {
    const cell = event.target;
    if (cell.tagName === 'TD') {
        isSelecting = true;
        startCell = cell;
        clearSelection();
        highlightCell(cell);
        updateSelection();
    }
}

function handleTouchMove(event) {
    const cell = event.target;
    if (isSelecting && cell.tagName === 'TD') {
        currentCell = cell;
        updateSelection();
    }
}

function handleTouchEnd(event) {
    if (isSelecting) {
        isSelecting = false;
        checkSelection();
        if (!isWordFound()) {
            clearSelection();
        }
    }
}

// Função para lidar com seleção de palavras
function handleSelection(event) {
    const cell = event.target;
    if (cell.tagName === 'TD') {
        cell.classList.toggle('selected');
        // Aqui pode ser adicionado mais lógica, se necessário
    }
}


function handleMouseDown(event) {
    if (event.target.tagName === 'TD') {
        isSelecting = true;
        startCell = event.target;
        clearSelection();
        highlightCell(event.target);
    }
}

function handleMouseUp(event) {
    if (isSelecting) {
        isSelecting = false;
        
    }
}

function handleMouseOver(event) {
    if (isSelecting && event.target.tagName === 'TD') {
        currentCell = event.target;
        updateSelection(); // Atualiza a seleção enquanto o mouse está movendo
    }
}

document.querySelectorAll('#crossword td').forEach(function(cell) {
    cell.addEventListener('click', handleSelection);
    cell.addEventListener('touchstart', handleSelection); // Adiciona evento de toque
});

function handleSelection(event) {
    // Aqui vai a lógica para selecionar as palavras
    const cell = event.target;
    cell.classList.toggle('selected');
}

function updateSelection() {
    if (!startCell || !currentCell) return;

    lastHighlightedCells.forEach(cell => {
        cell.classList.remove('selected');
    });
    lastHighlightedCells.clear();

    const startRow = parseInt(startCell.dataset.row);
    const startCol = parseInt(startCell.dataset.col);
    const endRow = parseInt(currentCell.dataset.row);
    const endCol = parseInt(currentCell.dataset.col);

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (Math.abs(rowDiff) === Math.abs(colDiff) || rowDiff === 0 || colDiff === 0) {
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
        const rowStep = steps === 0 ? 0 : rowDiff / steps;
        const colStep = steps === 0 ? 0 : colDiff / steps;

        for (let i = 0; i <= steps; i++) {
            const row = Math.round(startRow + i * rowStep);
            const col = Math.round(startCol + i * colStep);
            const cell = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('selected');
                lastHighlightedCells.add(cell);
            }
        }
    }
}

function getSelectedWord() {
    const cells = Array.from(lastHighlightedCells);
    cells.sort((a, b) => {
        const rowDiff = parseInt(a.dataset.row) - parseInt(b.dataset.row);
        return rowDiff !== 0 ? rowDiff : parseInt(a.dataset.col) - parseInt(b.dataset.col);
    });
    return cells.map(cell => cell.textContent).join('');
}

function checkSelection() {
    const selectedWord = getSelectedWord();
    const reversedWord = selectedWord.split('').reverse().join('');
    
    const correctWord = words.includes(selectedWord) ? selectedWord : 
                       words.includes(reversedWord) ? words[words.indexOf(reversedWord)] : null;

    if (correctWord) {
        foundWords.add(correctWord);
        lastHighlightedCells.forEach(cell => {
            cell.classList.remove('selected');
            cell.classList.add('found');
        });
        updateWordList();
        updateMessage(`Você encontrou a palavra: ${correctWord}`);

        if (foundWords.size === words.length) {
            updateMessage("Parabéns! Você encontrou todas as palavras!");
        }
        return true;
    }
    return false;
}

function isWordFound() {
    const selectedWord = getSelectedWord();
    const reversedWord = selectedWord.split('').reverse().join('');
    return words.includes(selectedWord) || words.includes(reversedWord);
}

function clearSelection() {
    lastHighlightedCells.forEach(cell => {
        if (!cell.classList.contains('found')) {
            cell.classList.remove('selected');
        }
    });
    lastHighlightedCells.clear();
}

function updateWordList() {
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';
    words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        if (foundWords.has(word)) {
            listItem.classList.add('found-word');
        }
        wordList.appendChild(listItem);
    });
}

function updateMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
}

function highlightCell(cell) {
    if (!cell.classList.contains('found')) {
        cell.classList.add('selected');
        lastHighlightedCells.add(cell);
    }
}

function showInitialScreen() {
    const initialScreen = document.getElementById('initial-screen');
    const gameScreen = document.getElementById('game-screen');
    const instructionsScreen = document.getElementById('instructions-screen');
    
    initialScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    instructionsScreen.classList.add('hidden');
}

function showGameScreen() {
    const initialScreen = document.getElementById('initial-screen');
    const gameScreen = document.getElementById('game-screen');
    const instructionsScreen = document.getElementById('instructions-screen');
    
    initialScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    instructionsScreen.classList.add('hidden');
    initializeGame();
}
function reiniciarJogo() {
    initializeGame();
    
    document.getElementById('message').textContent = "Selecione as palavras na grade!";
}

function showInstructionsScreen() {
    const initialScreen = document.getElementById('initial-screen');
    const gameScreen = document.getElementById('game-screen');
    const instructionsScreen = document.getElementById('instructions-screen');
    
    initialScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    instructionsScreen.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('start-game');
    const instructionsButton = document.getElementById('settings-button');
    const backToMenuButton = document.getElementById('back-to-menu');
    const voltarButton = document.getElementById('voltar');

    instructionsButton.textContent = "Instruções";

    // Removendo event listeners antigos
    startGameButton.removeEventListener('click', showGameScreen);
    instructionsButton.removeEventListener('click', showInstructionsScreen);
    backToMenuButton.removeEventListener('click', showInitialScreen);
    voltarButton.removeEventListener('click', showInitialScreen);

    // Adicionando novos event listeners
    startGameButton.addEventListener('click', showGameScreen);
    instructionsButton.addEventListener('click', showInstructionsScreen);
    backToMenuButton.addEventListener('click', showInitialScreen);
    voltarButton.addEventListener('click', showInitialScreen);
});

// Lidar com seleção de palavras ao tocar nas células
function handleSelection(event) {
    const cell = event.target;
    if (cell.tagName === 'TD') { // Garante que o toque é em uma célula
        cell.classList.toggle('selected');
        // Aqui pode ser adicionado mais lógica, se necessário
    }
}

function handleMouseDown(event) {
    if (event.target.tagName === 'TD') {
        isSelecting = true;
        startCell = event.target;
        clearSelection();
        highlightCell(event.target);
        updateSelection();
    }
}

function handleTouchStart(event) {
    if (event.target.tagName === 'TD') {
        isSelecting = true;
        startCell = event.target;
        clearSelection();
        highlightCell(event.target);
    }
}

function handleMouseUp(event) {
    if (isSelecting) {
        isSelecting = false;
        checkSelection();
        if (!isWordFound()) {
            clearSelection();
        }
    }
}

function handleTouchEnd(event) {
    if (isSelecting) {
        isSelecting = false;
       

    }
}

function handleMouseOver(event) {
    if (isSelecting && event.target.tagName === 'TD') {
        currentCell = event.target;
        updateSelection();
    }
}

function handleTouchMove(event) {
    if (isSelecting && event.target.tagName === 'TD') {
        currentCell = event.target;
        updateSelection();
    }
}

// Ao renderizar a grade
function renderGrid() {
    const table = document.getElementById('crossword');
    table.innerHTML = '';

    // Remover os eventos antigos
    table.removeEventListener('mousedown', handleMouseDown);
    table.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchend', handleTouchEnd);
    table.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('touchmove', handleTouchMove);

    // Adicionar novos eventos
    table.addEventListener('mousedown', handleMouseDown);
    table.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    table.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('touchmove', handleTouchMove);
    table.addEventListener('selectstart', (e) => e.preventDefault());

    // Adiciona as células à tabela
    for (let i = 0; i < 13; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < 13; j++) {
            let cell = document.createElement('td');
            cell.textContent = grid[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}