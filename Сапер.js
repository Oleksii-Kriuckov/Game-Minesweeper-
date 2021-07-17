const cells = document.querySelectorAll(".cell"),
    h1 = document.querySelector("h1"),
    body = document.querySelector("body"),
    flagsQuantity = document.querySelector(".flags_quantity"),
    field = document.querySelector(".field"),
    minesQuantity = 10;

let mines = [], minesAll = [], neighbours = new Array(64), counterClicks = 0, counterFlags = 0, btnStartOver, counterNeighbour = 0, counterGameOver = 0;

//Случайная расстановка мин и исключение повторяющихся клеток
const mineSettlement = () => {
    for (j = 0; j < minesQuantity; j++) {
        let mine = Math.ceil(Math.random() * 64);
        if (mines.length > 0) {
            for (i = mines.length; i > -1; i--) {
                if (mine != mines[i - 1]) {
                    mines[j] = mine;
                    cells[mine - 1].className = "mine";
                    cells[mine - 1].style.backgroundImage = "unset";
                    cells[mine - 1].style.backgroundColor = "grey";
                    minesAll[j] = cells[mine - 1];
                } else {
                    j--;
                    break;
                }
            }
        } else {
            mines[j] = mine;
            cells[mine - 1].className = "mine";
            cells[mine - 1].style.backgroundImage = "unset";
            cells[mine - 1].style.backgroundColor = "grey";
            minesAll[j] = cells[mine - 1];
        }
    }
}

mineSettlement();

// Функция вычисления мин в соседних ячейках
const neighbourMines = (i) => {
    mines.forEach((e) => {
        if ((i + 1) % 8 == 0) {
            for (y = i - 8; y < i + 9; y = y + 8) {
                for (x = y; x < y + 2; x++) {
                    if (x == e) {
                        counterNeighbour++;
                    }
                }
            }

        } else if ((i + 1) % 8 == 1) {
            for (y = i - 7; y < i + 10; y = y + 8) {
                for (x = y; x < y + 2; x++) {
                    if (x == e) {
                        counterNeighbour++;
                    }
                }
            }

        } else {
            for (y = i - 8; y < i + 9; y = y + 8) {
                for (x = y; x < y + 3; x++) {
                    if (x == e) {
                        counterNeighbour++;
                    }
                }
            }
        }
    })
    neighbours[i] = counterNeighbour;
    counterNeighbour = 0;
}
//Функция открытия ячейки без мин
const openCell = (i, elem) => {
    if (!elem.classList.contains("empty_cell") && !elem.classList.contains("open_cell")) {
        neighbourMines(i);

        if (neighbours[i] !== 0) {
            elem.className = "open_cell";
            elem.removeAttribute("style");
            switch (neighbours[i]) {
                case 1: {
                    elem.style.color = "green"
                }
                    break;
                case 2: {
                    elem.style.color = "darkorange"
                }
                    break;
                case 3: {
                    elem.style.color = "red"
                }
                    break;
                case 4: {
                    elem.style.color = "darkblue"
                }
                    break;
                case 5: {
                    elem.style.color = "darkorchid"
                }
                    break;
                case 6: {
                    elem.style.color = "firebrick"
                }
                    break;
                case 7: {
                    elem.style.color = "rgb(238, 255, 4)"
                }
                    break;
                case 8: {
                    elem.style.color = "black"
                }
            }
            elem.innerHTML = neighbours[i];
            counterClicks++;
        } else {
            elem.className = "empty_cell";
            counterClicks++;
        }
    }
    
    if (counterClicks == cells.length) {
        messageVictory();
    }
}

// Функция открытия соседних ячеек
const openNeighbour = (index, array) => {

    if ((index + 1) % 8 == 0) {
        if (index < 9) {
            for (a = index - 1, b = index; a < index + 8, b < index + 9; a += 8, b += 8) {
                openCell(a, array[a]);
                openCell(b, array[b]);
            }
        } else if (index > 60) {
            for (a = index - 9, b = index - 8; a < index, b < index + 1; a += 8, b += 8) {
                openCell(a, array[a]);
                openCell(b, array[b]);
            }
        } else {
            for (a = index - 9, b = index - 8; a < index + 8, b < index + 9; a += 8, b += 8) {
                openCell(a, array[a]);
                openCell(b, array[b]);
            }
        }

    } else if ((index + 1) % 8 == 1) {

        if (index < 2) {
            for (a = index, b = index + 1; a < index + 9, b < index + 10; a += 8, b += 8) {
                openCell(a, array[a]);
                openCell(b, array[b]);
            }
        } else if (index > 54) {
            for (a = index - 8, b = index - 7; a < index + 1, b < index + 2; a += 8, b += 8) {
                openCell(a, array[a]);
                openCell(b, array[b]);
            }
        } else {
            for (a = index - 8, b = index - 7; a < index + 9, b < index + 10; a += 8, b += 8) {
                openCell(a, array[a]);
                openCell(b, array[b]);
            }
        }

    } else {
        if (index < 9) {
            for (a = index - 1; a < index + 8; a += 8) {
                for (b = a; b < a + 3; b++) {
                    openCell(b, array[b]);
                }
            }
        } else if (index > 54) {
            for (a = index - 9; a < index; a += 8) {
                for (b = a; b < a + 3; b++) {
                    openCell(b, array[b]);
                }
            }
        } else {
            for (a = index - 9; a < index + 8; a += 8) {
                for (b = a; b < a + 3; b++) {
                    openCell(b, array[b]);
                }
            }
        }
    }
}


// Функционал правой кнопки мыши
field.addEventListener('contextmenu', (ev) => {
    if (counterGameOver == 0) {
        if (counterClicks > 0) {
            rightButton(ev.target);
            flagsQuantity.innerHTML = counterFlags;
            ev.preventDefault();
            
            if (counterClicks == cells.length) {
                messageVictory();
            }
        }
    }
})

const rightButton = (element) => {
    if (!element.classList.contains("empty_cell") && !element.classList.contains("open_cell")) {
        if (element.style.backgroundImage == 'url("./flag.png")') {
            element.style.backgroundImage = "unset";
            element.style.backgroundColor = "grey";
            counterFlags--;
            counterClicks--;
        } else if (counterFlags < minesQuantity) {
            element.style.cssText = `
            background-image: url(./flag.png);
            background-size: 100%;`
            counterFlags++;
            counterClicks++;
        }
    }
}

// Функционал левой кнопки мыши
cells.forEach((elem, index, arr) => {
    elem.addEventListener('click', (ev) => {
        if (counterGameOver == 0) {
            if (counterClicks == 0) {
                startOver();
            }

            if (ev.target.classList.contains("mine")) {
                minesAll.forEach((el) => {
                    el.removeAttribute("style");
                    el.className = "exploded_mine";
                })
                counterGameOver++;
            } else {
                openCell(index, elem);

                if (neighbours[index] == 0) {
                    while (neighbours.some((z) => { return z === 0 })) {

                        neighbours = new Array(64);
                        cells.forEach((elem, index, arr) => {
                            if (elem.classList.contains("empty_cell")) {
                                openNeighbour(index, arr)
                            }
                        })
                    }
                }
            }
        }
    })
})

// Создание и функционал кнопки "Начать заново"
const startOver = () => {
    btnStartOver = document.createElement("button");
    btnStartOver.innerHTML = "Начать заново";
    btnStartOver.classList.add("btnStartOver");
    h1.after(btnStartOver);

    btnStartOver.addEventListener('click', (e) => {
        mines = []; counterClicks = 0; counterFlags = 0;
        counterGameOver = 0, neighbours = new Array(64);

        flagsQuantity.innerHTML = "0";
        cells.forEach((el) => {
            el.className = "cell";
            el.innerHTML = "";
            el.removeAttribute("style");
        })
        mineSettlement();
        e.target.remove();

        let div = document.querySelector(".victory")
        if (div !== null) {
            div.remove();
        }
    })
}

// Функция Сообщения о победе
const messageVictory = () => {
    let div = document.createElement('div');
    div.classList.add('victory');
    div.innerHTML = `Поздравляем! <br> Вы победили!`;
    body.append(div);
    counterGameOver++
}