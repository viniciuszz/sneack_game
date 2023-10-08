const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const size = 30
const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

audio = new Audio('audio.mp3')

const incrementScore = () => {
    score.innerText = + score.innerText + 10
}

//cria um numero aleatorio
const randomNumber = (min,max) => {
    //cria um numero alertorio
    return Math.round(Math.random() * (max + min) + min)
}
//gera uma posisão aleatoria com pase no numero aleatorio
const randomPosition = () => {
      const number = randomNumber(0, canvas.width - size)
      return Math.round(number / 30) * 30
}

const  randomColor = () => {
    const red = randomNumber(0, 255)
    const blue = randomNumber(0 , 255)
    const green = randomNumber(0 , 255)
return `rgb(${red}, ${green}, ${blue})`
}

const chackEat = () => {
    const head = snake[snake.length - 1]
     //verifica se a cabeça da cobra passou por cima da comida
    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()
         //se o laço de repetição encontrar uma comida que aparesa na cobra a comida e gerada novamente em outra localização
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const chackCollsion = () => {
    const head = snake[snake.length - 1]
    const neckIndex = snake.length-2
const wallCollision = head.x < 0 || head.x > 570 || head.y<0 || head.y > 570 

const selfCollision = snake.find((position, index) => {
    return index<neckIndex && position.x == head.x && position.y == head.y
})

    if(wallCollision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}

const food = {
    x:randomPosition(),
    y:randomPosition(),
     color:randomColor()
    }

const drawfood = () => {
    //cria uma variavel para ser igual as variaveis e vitando a repetisão das palavras
    const {x,y,color,} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    
    ctx.fillStyle = color
    ctx.fillRect(x,y,size , size)
    ctx.shadowBlur = 0
}

let direction,loopid

const drawSnake = () => {
    ctx.fillStyle = "red"
    snake.forEach((position, index) => {
        if(index == snake.length - 1){
            ctx.fillStyle = "blue"
        }
        ctx.fillRect(position.x, position.y, size,size)
    })
   
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }
    //remove o ultimo array enquanto a cobra se movimenta
    snake.shift()
}


const drawGrid = () => {
    //define a largura da linha
    ctx.lineWidth = 1
    //define a cor da linha
    ctx.strokeStyle = "#191919"
    //continua executando o laço de repetisão enquanto as linhas não superarem a largura do canvas
    for (let i = 30; i < canvas.width; i += 30) {
        //cria as linhas verticais
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()
        
        //cria as linhas horizontais
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}


const gameLoop = () => {
    clearInterval(loopid)
    ctx.clearRect(0,0,600, 600)
    chackCollsion()
    moveSnake()
    chackEat()
    drawSnake()
    drawfood()
    drawGrid()
    loopid = setInterval(() =>
{
    gameLoop()
},300)
}
gameLoop()
//move a cobra de acordo com a tecla que é apertada
document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})
