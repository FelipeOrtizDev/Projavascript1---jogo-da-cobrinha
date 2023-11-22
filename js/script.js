const playBoard = document.querySelector(".play-board"); // puxa a classe play-board
const scoreElement = document.querySelector(".score"); // puxa a classe score
const highScoreElement = document.querySelector(".high-score"); // puxa a classe high-score
const controls =document.querySelectorAll(".controls i")

let gameOver = false;
let foodX, foodY;
let snakeBody = [];
let snakeX = 15, snakeY = 15;
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0; 
let highScore =localStorage.getItem("high-score") || 0; // pega o high score do local storage
highScoreElement.innerText = `High-Score: ${highScore}`; // mantem o maior high store no jogo


const changeFoodPosition = () => {
    // spawm aleatorio da comida da cobrinha
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Excuta um reload na pagina
    clearInterval(setIntervalId)
    alert("Game Over... Pressione OK para continuar!")
    location.reload();
    
}

const changeDirection = (e) => {
    // controle da cobrinha 
    if (e.key === "ArrowUp" && velocityX!= -2) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowDown" && velocityX!= 2) {
        velocityX = 1;
        velocityY = 0;
    } else if (e.key === "ArrowLeft" && velocityY!= -2) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowRight" && velocityY!= 2) {
        velocityX = 0;
        velocityY = 1;
    } 
    

}

controls.forEach(key => {
    //faz as setas chamarem a função de alterar direção
    key.addEventListener("click", () => changeDirection({  key: key.dataset.key  }));
})

const initGame = () => {
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;


    if(gameOver) return handleGameOver() // puxa o Reload da pagina caso perca

    if(snakeX === foodY && snakeY === foodX)/* verifica se a cobrinha passa por cima das frutas */ {
        // se passar por cima das frutas, chama a função troca de posição
        changeFoodPosition();
        
        //acrecenta o valor da fruta para a array do corpo da cobrinha
        snakeBody.push([foodX, foodY]);
        score++
        
        //Pegue a classe e troca pelo texto
        highScore = score >= highScore ? score : highScore; //verifica se o score for maior que o highscore.
        localStorage.setItem("high-score", highScore)
        scoreElement.innerText = `Score: ${score}`;  
        highScoreElement.innerText = `High-Score: ${highScore}`;//aumenta o valor total do highscore  
    }

    for(let i =snakeBody.length - 1; i>0; i--) {
        //adiciona um corpo extra para a cobra
        snakeBody[i] = snakeBody[ i -1]
    }
    
    snakeBody[0] = [snakeX, snakeY];// aloca o corpo extra para seguir a cabeça
    // Mudança da cabeça da cobrinha
    snakeX += velocityX;
    snakeY += velocityY;

    if( snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) /* verifica se a cobra bate na parede da arena */ {   
        gameOver = true
    }

    for(let i=0; i < snakeBody.length; i++){
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`; 
        if( i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) /* verifica se a cobra bate no proprio corpo */ {
            // se for verdadeiro, muda o bolean e chama a função para recarrgar a pagina
            gameOver = true;
        }
    }
    /* htmlMarkup += `<div class="head" style="grid-area: ${snakeX} / ${snakeY}"></div>`; */
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition()
setIntervalId = setInterval(initGame,125);
document.addEventListener("keydown", changeDirection); 
