const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');

const settings = document.querySelector('.settings');

const easy = settings.querySelector('.easy');
const medium = settings.querySelector('.medium');
const hard = settings.querySelector('.hard');

let score = 0;


const grid = 16;
let count = 0;
let speed = 4;

let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

let food = {
    x: 320,
    y: 320
};


const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};


easy.addEventListener('click', (evt) => {
    evt.preventDefault();
    speed = 5;
});

medium.addEventListener('click', (evt) => {
    evt.preventDefault();
    speed = 4;
});

hard.addEventListener('click', (evt) => {
    evt.preventDefault();
    speed = 2;
});


const loop = () => {
    //замедление скорости отрисовки
    requestAnimationFrame(loop);

    if (++count < speed) {
        return;
    }

    count = 0;

    //очищение поля
    context.clearRect(0, 0, canvas.width, canvas.height);

    //простое движение змеи
    snake.x += snake.dx;
    snake.y += snake.dy;

    //на случай столкновения с краями поля(проходит и появляется на другой стороне)
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    //продолжение движения вперед(появляется по направлению квадратик)
    snake.cells.unshift({
        x: snake.x,
        y: snake.y
    });

    //удаление квадратика сзади
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    //отрисовка еды
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, grid - 1, grid - 1);

    //увеличение змеи на квадратик
    context.fillStyle = 'green';

    //обрабатываю каждую ячейку змеи
    snake.cells.forEach((cell, index) => {

        //каждую ячейку змеи делаем на пиксель меньше, чтобы межлу ними была черная полосочка в один пиксель
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        //елси ячейка столкнулась(равна) с ячейкой еды
        if (cell.x === food.x && cell.y === food.y) {
            //увеличить количество ячеек змеи на один 
            snake.maxCells++;

            //счетчик очков
            score += 10;
            
            if (score < 99) {
                settings.querySelector('.score').innerHTML = `00${score}`;
            } else if (score < 999) {
                settings.querySelector('.score').innerHTML = `0${score}`;
            } else {
                settings.querySelector('.score').innerHTML = `${score}`;
            }
            
            //счетчик длины змеи
            settings.querySelector('.length').innerHTML =  snake.maxCells;

            //рисуем новую еду
            food.x = getRandomInt(0, 25) * grid;
            food.y = getRandomInt(0, 25) * grid;
        }

        //цикл размером с длину змеи
        //проверка не столкнулась ли змея с самой собой(есть ли в змее две одинаковые ячейки)
        for (let i = index + 1; i < snake.cells.length; i++) {
            
            //если есть две одинаковые(змея столкнулась сама с собой), возвращаем начальные значения
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.dx = grid;
                snake.dy = 0;
                snake.cells = [];
                snake.maxCells = 4;
                food.x = getRandomInt(0, 25) * grid;
                food.y = getRandomInt(0, 25) * grid;
                score = 0;

                settings.querySelector('.score').innerHTML = `000${score}`;
                settings.querySelector('.length').innerHTML =  snake.maxCells;
            }
        }
    });
};

//управление стрелочками
document.addEventListener('keydown', (evt) => {

    if (evt.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (evt.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (evt.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (evt.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
})

requestAnimationFrame(loop);