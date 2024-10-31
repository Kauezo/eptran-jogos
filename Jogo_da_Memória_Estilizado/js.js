const cartas_container = document.getElementById('cartas-container');

const cartas_arquivos = {
    'Cone de trânsito'          : 'cartas/cone_de_transito.svg',
    'Faixa de segurança'        : 'cartas/faixa_de_seguranca.svg',
    'Limite de velocidade'      : 'cartas/limite_de_velocidade.svg',
    'Pare'                      : 'cartas/pare.svg',
    'Proibido estacionar'       : 'cartas/proibido_estacionar.svg',
    'Proibido ultrapassagem'    : 'cartas/proibido_ultrapassagem.svg',
    'Semáforo'                  : 'cartas/semaforo.svg',
    'Sinal verde'               : 'cartas/sinal_verde.svg',
    'Sinal vermelho'            : 'cartas/sinal_vermelho.svg',    
    'Passagem de nível'         : 'cartas/trilho_de_trem.svg',
}

const tamanho_do_deck = Object.getOwnPropertyNames(cartas_arquivos).length;

class JogoDaMemoria{
    constructor(_qtd_de_cartas){
        this.cartas_objetos = new Array();
        this.pontos = 0;
        this.iniciado = false;
        this.qtd_de_cartas = _qtd_de_cartas * 2; //Não pode ser maior que cartas_arquivos.length

        if (_qtd_de_cartas > tamanho_do_deck){
            console.log(`Aviso: mais ${this} recebeu ${_qtd_de_cartas} carta(s) mas existem apenas ${tamanho_do_deck} carta(s) registrada(s)`);
            this.qtd_de_cartas = tamanho_do_deck * 2;
        }
        
        //Definição dos botões
        document.getElementById("iniciar").addEventListener('click', () => this.iniciar());
        document.getElementById("reiniciar").addEventListener('click', () => this.embaralhar());
        
        //Execução
        this.criarCartas();
        this.selecionado = new Array();
        this.escolherDeck();
        this.embaralhar();
    }
    
    criarCartas(){
        // Cria todas as cartas no DOM
        Object.keys(cartas_arquivos).forEach(key => {
            // Para as cartas com Imagens
            var div = document.createElement("div");
            div.classList = "carta carta-baixo";  // Adiciona a classe 'carta-baixo' para começar virada
            var img = document.createElement("img");
            img.src = cartas_arquivos[key];
            img.style.display = 'none'; // Oculta o conteúdo inicialmente
            div.classList += key.replace(/\s+/g, '-').toLowerCase();
            div.appendChild(img);
            
            // Para as cartas com Textos
            var div2 = document.createElement("div");
            div2.classList = "carta carta-baixo";  // Adiciona a classe 'carta-baixo' para começar virada
            var p = document.createElement("p");
            p.textContent = key;
            p.style.display = 'none'; // Oculta o conteúdo inicialmente
            div.classList, div2.classList += key.replace(/\s+/g, '-').toLowerCase();
            div2.appendChild(p);
            
            div.addEventListener('click', (event) => this.girarCarta(event.target));
            div2.addEventListener('click', (event) => this.girarCarta(event.target));
            
            this.cartas_objetos.push(div);
            this.cartas_objetos.push(div2);
        });
    }
    

    iniciar() {
        console.log("Iniciar");
        this.iniciado = true;
        this.pontos = 0; // Reinicia os pontos ao iniciar o jogo
        this.cartas_objetos.forEach(element => this.ocultarCarta(element));
    }

    escolherDeck() {
        let pares = [];
        let range = this.cartas_objetos.length / 2; // Número de pares
    
        // Cria pares a partir das cartas já organizadas
        for (let i = 0; i < range; i++) {
            let imagem = this.cartas_objetos[i * 2];     // Carta de imagem
            let texto = this.cartas_objetos[i * 2 + 1];  // Carta de texto
            pares.push([imagem, texto]); // Adiciona o par
        }
    
        // Embaralha os pares
        pares.shuffle();
    
        // Limpa o array de cartas antes de preencher novamente
        this.cartas_objetos.length = new Array(); // Isso limpa o array
    
        // Adiciona os pares embaralhados de volta ao array
for (let i = 0; i < this.qtd_de_cartas / 2; i++) {
            this.cartas_objetos.push(pares[i][0]); // Adiciona a carta de imagem
            this.cartas_objetos.push(pares[i][1]); // Adiciona a carta de texto
        }
    
        // (Opcional) Atualiza a visualização no DOM
        this.atualizar(); // Se necessário
    }

    embaralhar() {
        this.iniciado = false;
        this.pontos = 0; // Reinicia os pontos ao embaralhar
        this.cartas_objetos.shuffle();
        
        this.cartas_objetos.forEach(element => {
            element.classList.remove('carta-baixo');
            element.classList.remove('carta-cima');
            element.children[0].style.display = 'block';
        });
        this.atualizar();
    }
    

    //Atualiza o container
    atualizar() {
        this.cartas_objetos.forEach(element => {
            cartas_container.append(element);
        });
    }
    
    girarCarta(element){
        if (this.selecionado.length > 1 || !this.iniciado)
            return;

        var carta_exibida = !(element.children[0].style.display == 'none');
        console.log(carta_exibida);

        if (carta_exibida){
            if (!this.selecionado.includes(element))
                return;
            this.ocultarCarta(element);
            this.selecionado = new Array();
        }
        else{
            this.mostrarCarta(element);
            this.selecionado.push(element);
        }
        if (this.selecionado.length > 1)
            this.compararSelecionado();
    }

    ocultarCarta(element){
        element.classList.remove('carta-cima');
        element.classList.add('carta-baixo');
        element.children[0].style.display = 'none';
    }
    
    mostrarCarta(element){
        element.classList.remove('carta-baixo');
        element.classList.add('carta-cima');
        element.children[0].style.display = 'block';
    }

    compararSelecionado(){
        let igual = this.selecionado[0].classList[1] == this.selecionado[1]?.classList[1];
    
        if (igual){
            this.pontos += 2;
            this.selecionado = new Array();
            console.log(`Pontos: ${this.pontos}`)
            if (this.pontos >= this.qtd_de_cartas)
                setTimeout(() => this.vitoria(), 1000);
        }
        else{
            setTimeout(() => this.restaurarSelecao(), 1000);
        }
    }

    restaurarSelecao(){
        console.log(this.selecionado);
        this.selecionado.forEach(element => this.ocultarCarta(element));
        this.selecionado = new Array();
    }

    vitoria(){
        document.getElementById('popup').style.display = 'flex'; // Mostra o pop-up
    }

    fecharPopup() {
        document.getElementById('popup').style.display = 'none'; // Esconde o pop-up
    }
}

//Adciona a função embaralhar para todos os arrays
Array.prototype.shuffle = function() {
    let indice = this.length;
    
    while(indice) {
        const indiceAleatorio = Math.floor(Math.random() * indice--);
        [this[indice], this[indiceAleatorio]] = 
            [this[indiceAleatorio], this[indice]];
    }
    return this;
}
const container = document.querySelector('#cartas-container');

// document.addEventListener("DOMContentLoaded", () => {
//     const cartas = document.querySelectorAll('.carta');

//     const observer = new ResizeObserver(entries => {
//         for (let entry of entries) {
//             const largura = entry.contentRect.width;  // Largura do contêiner
//             const altura = entry.contentRect.height;  // Altura do contêiner
//             const area = largura * altura;
//             console.log(area);
            
//             let tamanho_alvo = 40;
//             let valor = largura / tamanho_alvo;

//             container.style.gridTemplateColumns = "repeat(" + valor  ", ${tamanho_alvo})`;
//             //carta.style.width = (area / (largura * Math.pow(20))) + "px";
//         }
//     });

//     // Inicie a observação do contêiner
//     observer.observe(container);
// });
