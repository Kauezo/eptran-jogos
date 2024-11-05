// const palavrasTransito = [
//     { palavra: 'semáforo', dica: 'Sinal de trânsito com luzes' },
//     { palavra: 'pedestre', dica: 'Pessoa que caminha nas ruas' },
//     { palavra: 'sinalização', dica: 'Placas e indicações nas vias' },
//     { palavra: 'automóvel', dica: 'Veículo motorizado de quatro rodas' },
//     { palavra: 'bicicleta', dica: 'Meio de transporte com duas rodas' },
//     { palavra: 'faixa', dica: 'Local onde pedestres atravessam' },
//     { palavra: 'capacete', dica: 'Equipamento de segurança para a cabeça' },
//     { palavra: 'carona', dica: 'Transporte de um passageiro por um motorista' },
//     { palavra: 'transito', dica: 'Movimento de veículos nas vias' },
//     { palavra: 'ciclovia', dica: 'Via exclusiva para ciclistas' },
//     { palavra: 'motorista', dica: 'Pessoa que dirige um veículo' },
//     { palavra: 'estacionamento', dica: 'Lugar destinado ao estacionamento de veículos' },
//     { palavra: 'multas', dica: 'Penalizações financeiras por infrações de trânsito' },
//     { palavra: 'rotatória', dica: 'Interseção onde os veículos circulam em torno de um ponto central' },
//     { palavra: 'tráfego', dica: 'Trânsito lento e congestionado' },
//     { palavra: 'trânsito', dica: 'Movimentação de veículos e pedestres nas ruas' }
// ];


// let palavraEscolhida = '';
// let palavraNormalizada = ''; // Palavra sem acentos
// let palavraDisplay = [];
// let dicaEscolhida = '';
// let tentativasErradas = 0;
// const maxTentativas = 6;

// // Elementos do DOM
// const wordDisplay = document.getElementById('wordDisplay');
// const lettersContainer = document.getElementById('letters');
// const message = document.getElementById('message');
// const dicaDisplay = document.createElement('p');
// document.body.insertBefore(dicaDisplay, document.querySelector('.game-container'));
// const roadCanvas = document.getElementById('roadCanvas');
// const ctx = roadCanvas.getContext('2d');
// const startButton = document.getElementById('startButton');
// const nextButton = document.getElementById('nextButton');
// const restartButton = document.getElementById('restartButton');

// // Desenho do carro e poste
// let carroPosicaoX = 50;
// const carroPosicaoY = 140;
// const carroLargura = 50;
// const carroAltura = 40;
// const posteX = 500;
// const posteY = 100;
// const posteLargura = 20;
// const posteAltura = 100;

// // Função para desenhar a estrada, carro e poste
// function desenharCenario() {
//     ctx.clearRect(0, 0, roadCanvas.width, roadCanvas.height);
    
//     // Desenhar estrada
//     ctx.fillStyle = 'gray';
//     ctx.fillRect(0, 170, roadCanvas.width, 30);
    
//     // Desenhar carro
//     ctx.fillStyle = 'blue';
//     ctx.fillRect(carroPosicaoX, carroPosicaoY, carroLargura, carroAltura);
    
//     // Desenhar poste
//     ctx.fillStyle = 'yellow';
//     ctx.fillRect(posteX, posteY, posteLargura, posteAltura);
// }

// // Função para normalizar uma string (remover acentos)
// function normalizarString(str) {
//     return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// }

// let ultimaPalavraEscolhida = ''; // Armazena a última palavra escolhida

// function selecionarPalavra() {
//     let index;
    
//     do {
//         index = Math.floor(Math.random() * palavrasTransito.length);
//     } while (palavrasTransito[index].palavra === ultimaPalavraEscolhida); // Garante que a palavra não seja a mesma
    
//     const { palavra, dica } = palavrasTransito[index];
//     palavraEscolhida = palavra.toUpperCase();
//     palavraNormalizada = normalizarString(palavraEscolhida); // Normaliza para comparações
//     dicaEscolhida = dica;
//     palavraDisplay = Array(palavraEscolhida.length).fill('_');
//     wordDisplay.textContent = palavraDisplay.join(' ');
//     dicaDisplay.textContent = `Dica: ${dicaEscolhida}`;

//     ultimaPalavraEscolhida = palavra; // Armazena a palavra escolhida atual
// }

// // O restante do seu código permanece o mesmo

// // ...

// // Função para criar os botões das letras
// function criarLetras() {
//     const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
//     lettersContainer.innerHTML = '';
//     alfabeto.forEach(letra => {
//         const button = document.createElement('div');
//         button.classList.add('letter');
//         button.textContent = letra;
//         button.addEventListener('click', () => escolherLetra(letra, button));
//         lettersContainer.appendChild(button);
//     });
// }

// // Função para escolher uma letra
// function escolherLetra(letra, button) {
//     button.classList.add('disabled');
//     button.removeEventListener('click', escolherLetra);

//     const letraNormalizada = normalizarString(letra); // Normalizar a letra escolhida

//     if (palavraNormalizada.includes(letraNormalizada)) {
//         palavraEscolhida.split('').forEach((char, index) => {
//             if (normalizarString(char) === letraNormalizada) {
//                 palavraDisplay[index] = char; // Exibe a letra original, incluindo o acento
//             }
//         });
//         wordDisplay.textContent = palavraDisplay.join(' ');
        
//         // Verificar se o jogador ganhou
//         if (!palavraDisplay.includes('_')) {
//             message.textContent = 'Parabéns, você ganhou!';
//             desabilitarLetras();
//             nextButton.style.display = 'block';
//         }
//     } else {
//         tentativasErradas++;
//         moverCarro();
        
//         if (tentativasErradas === maxTentativas) {
//             message.textContent = 'Você perdeu! O carro bateu no poste.';
//             desabilitarLetras();
//             wordDisplay.textContent = palavraEscolhida; // Mostra a palavra completa ao perder
//             restartButton.style.display = 'block';
//         }
//     }
// }

// // Função para mover o carro após erro
// function moverCarro() {
//     const distancia = (posteX - carroLargura - carroPosicaoX) / (maxTentativas - tentativasErradas + 1);
//     carroPosicaoX += distancia;
//     desenharCenario();
// }

// // Função para desabilitar todas as letras
// function desabilitarLetras() {
//     const letras = document.querySelectorAll('.letter');
//     letras.forEach(letra => {
//         letra.classList.add('disabled');
//         letra.removeEventListener('click', escolherLetra);
//     });
// }

// // Função para inicializar o jogo
// function iniciarJogo() {
//     selecionarPalavra();
//     criarLetras();
//     desenharCenario();
//     message.textContent = '';
//     carroPosicaoX = 50;
//     tentativasErradas = 0;
//     startButton.style.display = 'none';
//     nextButton.style.display = 'none';
//     restartButton.style.display = 'none';
// }

// // Evento para iniciar o jogo
// startButton.addEventListener('click', iniciarJogo);

// // Evento para começar a próxima palavra
// nextButton.addEventListener('click', iniciarJogo);

// // Evento para reiniciar o jogo
// restartButton.addEventListener('click', iniciarJogo);

// const carroImagem = new Image();
// carroImagem.src = 'car_texture.png.png'; // Caminho para a imagem do carro
// let imagemCarroCarregada = false;

// // Função para desenhar a estrada, carro e poste
// function desenharCenario() {
//     ctx.clearRect(0, 0, roadCanvas.width, roadCanvas.height);
    
//     // Desenhar estrada
//     ctx.fillStyle = 'gray';
//     ctx.fillRect(0, 170, roadCanvas.width, 30);
    
//     // Desenhar carro (usando textura)
//     if (imagemCarroCarregada) {
//         ctx.drawImage(carroImagem, carroPosicaoX, carroPosicaoY, carroLargura, carroAltura);
//     } else {
//         // Se a imagem não estiver carregada, desenhe um retângulo azul
//         ctx.fillStyle = 'blue';
//         ctx.fillRect(carroPosicaoX, carroPosicaoY, carroLargura, carroAltura);
//     }
    
//     // Desenhar poste
//     ctx.fillStyle = 'yellow';
//     ctx.fillRect(posteX, posteY, posteLargura, posteAltura);
// }

// // Evento que verifica quando a imagem do carro foi carregada
// carroImagem.onload = function() {
//     imagemCarroCarregada = true; // A imagem foi carregada
//     desenharCenario(); // Redesenha o cenário
// }; 

const palavrasTransito = [
    { palavra: 'semáforo', dica: 'Sinal de trânsito com luzes' },
    { palavra: 'pedestre', dica: 'Pessoa que caminha nas ruas' },
    { palavra: 'sinalização', dica: 'Placas e indicações nas vias' },
    { palavra: 'automóvel', dica: 'Veículo motorizado de quatro rodas' },
    { palavra: 'bicicleta', dica: 'Meio de transporte com duas rodas' },
    { palavra: 'faixa', dica: 'Local onde pedestres atravessam' },
    { palavra: 'capacete', dica: 'Equipamento de segurança para a cabeça' },
    { palavra: 'carona', dica: 'Transporte de um passageiro por um motorista' },
    { palavra: 'transito', dica: 'Movimento de veículos nas vias' },
    { palavra: 'ciclovia', dica: 'Via exclusiva para ciclistas' },
    { palavra: 'motorista', dica: 'Pessoa que dirige um veículo' },
    { palavra: 'estacionamento', dica: 'Lugar destinado ao estacionamento de veículos' },
    { palavra: 'multas', dica: 'Penalizações financeiras por infrações de trânsito' },
    { palavra: 'rotatória', dica: 'Interseção onde os veículos circulam em torno de um ponto central' },
    { palavra: 'tráfego', dica: 'Trânsito lento e congestionado' },
    { palavra: 'trânsito', dica: 'Movimentação de veículos e pedestres nas ruas' }
];

let palavraEscolhida = '';
let palavraNormalizada = '';
let palavraDisplay = [];
let dicaEscolhida = '';
let tentativasErradas = 0;
const maxTentativas = 6;
let acertos = 0; // Contador de acertos
let totalPalavras = 0; // Contador de palavras

// Elementos do DOM
const wordDisplay = document.getElementById('wordDisplay');
const lettersContainer = document.getElementById('letters');
const message = document.getElementById('message');
const dicaDisplay = document.createElement('p');
document.body.insertBefore(dicaDisplay, document.querySelector('.game-container'));
const roadCanvas = document.getElementById('roadCanvas');
const ctx = roadCanvas.getContext('2d');
const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('nextButton');
const restartButton = document.getElementById('restartButton');

// Desenho do carro e poste
let carroPosicaoX = 50;
const carroPosicaoY = 120;
const carroLargura = 100;
const carroAltura = 100;
const posteX = 450;
const posteY = 30;
const posteLargura = 120;
const posteAltura = 190;

// Função para desenhar a estrada, carro e poste
function desenharCenario() {
    ctx.clearRect(0, 0, roadCanvas.width, roadCanvas.height);
    
    // Desenhar estrada
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 170, roadCanvas.width, 30);
    
    // Desenhar carro
    if (imagemCarroCarregada) {
        ctx.drawImage(carroImagem, carroPosicaoX, carroPosicaoY, carroLargura, carroAltura);
    } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(carroPosicaoX, carroPosicaoY, carroLargura, carroAltura);
    }
    
    // Desenhar poste
    ctx.fillStyle = 'yellow';
    ctx.fillRect(posteX, posteY, posteLargura, posteAltura);
}

// Função para normalizar uma string (remover acentos)
function normalizarString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

let ultimaPalavraEscolhida = ''; // Armazena a última palavra escolhida

function selecionarPalavra() {
    let index;
    
    do {
        index = Math.floor(Math.random() * palavrasTransito.length);
    } while (palavrasTransito[index].palavra === ultimaPalavraEscolhida); // Garante que a palavra não seja a mesma
    
    const { palavra, dica } = palavrasTransito[index];
    palavraEscolhida = palavra.toUpperCase();
    palavraNormalizada = normalizarString(palavraEscolhida);
    dicaEscolhida = dica;
    palavraDisplay = Array(palavraEscolhida.length).fill('_');
    wordDisplay.textContent = palavraDisplay.join(' ');
    dicaDisplay.textContent = `Dica: ${dicaEscolhida}`;

    ultimaPalavraEscolhida = palavra; // Armazena a palavra escolhida atual
    totalPalavras++; // Aumenta o contador de palavras
}

// Função para criar os botões das letras
function criarLetras() {
    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    lettersContainer.innerHTML = '';
    alfabeto.forEach(letra => {
        const button = document.createElement('div');
        button.classList.add('letter');
        button.textContent = letra;
        button.addEventListener('click', () => escolherLetra(letra, button));
        lettersContainer.appendChild(button);
    });
}

// Função para escolher uma letra
function escolherLetra(letra, button) {
    button.classList.add('disabled');
    button.removeEventListener('click', escolherLetra);

    const letraNormalizada = normalizarString(letra);

    if (palavraNormalizada.includes(letraNormalizada)) {
        palavraEscolhida.split('').forEach((char, index) => {
            if (normalizarString(char) === letraNormalizada) {
                palavraDisplay[index] = char;
            }
        });
        wordDisplay.textContent = palavraDisplay.join(' ');
        
        // Verificar se o jogador ganhou
        if (!palavraDisplay.includes('_')) {
            message.textContent = 'Parabéns, você ganhou!';
            acertos++; // Incrementa acertos
            desabilitarLetras();
            nextButton.style.display = 'block';
        }
    } else {
        tentativasErradas++;
        moverCarro();
        
        if (tentativasErradas === maxTentativas) {
            message.textContent = 'Você perdeu! O carro bateu no poste.';
            desabilitarLetras();
            wordDisplay.textContent = palavraEscolhida; // Mostra a palavra completa ao perder
            restartButton.style.display = 'block';
        }
    }
}

// Função para mover o carro após erro
function moverCarro() {
    const distancia = (posteX - carroLargura - carroPosicaoX) / (maxTentativas - tentativasErradas + 1);
    carroPosicaoX += distancia;
    desenharCenario();
}

// Função para desabilitar todas as letras
function desabilitarLetras() {
    const letras = document.querySelectorAll('.letter');
    letras.forEach(letra => {
        letra.classList.add('disabled');
        letra.removeEventListener('click', escolherLetra);
    });
}

// Função para inicializar o jogo
function iniciarJogo() {
    selecionarPalavra();
    criarLetras();
    desenharCenario();
    message.textContent = '';
    carroPosicaoX = 50;
    tentativasErradas = 0;
    startButton.style.display = 'none';
    nextButton.style.display = 'none';
    restartButton.style.display = 'none';
}

// Evento para iniciar o jogo
startButton.addEventListener('click', iniciarJogo);

// Evento para começar a próxima palavra
nextButton.addEventListener('click', () => {
    if (totalPalavras < palavrasTransito.length) {
        iniciarJogo();
    } else {
        // Mostra a pontuação final
        message.textContent = `Fim do jogo! Você acertou ${acertos} de ${totalPalavras} palavras.`;
        nextButton.style.display = 'none';
        restartButton.style.display = 'block';
    }
});

// Evento para reiniciar o jogo
restartButton.addEventListener('click', () => {
    acertos = 0; // Reseta a contagem de acertos
    totalPalavras = 0; // Reseta o contador de palavras
    iniciarJogo(); // Reinicia o jogo
});

// Carregar as imagens do carro e do poste
const carroImagem = new Image();
carroImagem.src = 'car_texture.png.png'; // Caminho para a imagem do carro
const posteImagem = new Image();
posteImagem.src = 'poste_texture.png'; // Caminho para a imagem do poste
let imagemCarroCarregada = false;
let imagemPosteCarregada = false;

// Evento que verifica quando as imagens foram carregadas
carroImagem.onload = function() {
    imagemCarroCarregada = true; // A imagem do carro foi carregada
    desenharCenario(); // Redesenha o cenário
};

posteImagem.onload = function() {
    imagemPosteCarregada = true; // A imagem do poste foi carregada
    desenharCenario(); // Redesenha o cenário
};

// Função para desenhar a estrada, carro e poste
function desenharCenario() {
    ctx.clearRect(0, 0, roadCanvas.width, roadCanvas.height);
    
    // Desenhar estrada
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 170, roadCanvas.width, 30);
    
    // Desenhar carro (usando textura)
    if (imagemCarroCarregada) {
        ctx.drawImage(carroImagem, carroPosicaoX, carroPosicaoY, carroLargura, carroAltura);
    } else {
        // Se a imagem não estiver carregada, desenhe um retângulo azul
        ctx.fillStyle = 'blue';
        ctx.fillRect(carroPosicaoX, carroPosicaoY, carroLargura, carroAltura);
    }
    
    // Desenhar poste (usando textura)
    if (imagemPosteCarregada) {
        ctx.drawImage(posteImagem, posteX, posteY, posteLargura, posteAltura);
    } else {
        // Se a imagem não estiver carregada, desenhe um retângulo amarelo
        ctx.fillStyle = 'yellow';
        ctx.fillRect(posteX, posteY, posteLargura, posteAltura);
    }
}


