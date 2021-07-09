const cells = document.querySelectorAll(".cell"),
    body = document.querySelector("body"),
    h1 = document.querySelector("h1"),
    flagsQuantity = document.querySelector(".flags_quantity"),
    minesQuantity = 10; 

let mines = [], minesAll =[], counterClicks = 0, counterFlags = 0, btnStartOver, counterNeighbour=0;

//Случайная расстановка мин и исключение повторяющихся клеток
const mineSettlement = () => {
    for (j=0; j < minesQuantity; j++) {
        let mine = Math.ceil(Math.random()*64);
        if (mines.length>0){
            for (i=mines.length; i>-1; i--) {
                if (mine != mines[i-1]) {
                    mines[j] = mine; 

                    cells[mine-1].className = "mine";
//                    cells[mine-1].style.backgroundImage = "unset";
                    cells[mine-1].style.backgroundColor = "grey";
                    //                    cells[mine-1].setAttribute("style", "background-image:unset; background-color:rgb(192, 189, 189)");
                    minesAll[j] = cells[mine-1];
                } else {
                    j--;
                    break;
                }
            }
        } else { 
            mines[j] = mine;
            cells[mine-1].className = "mine";
            //cells[mine-1].setAttribute("class", "mine");
//            cells[mine-1].style.backgroundImage = "unset";
            cells[mine-1].style.backgroundColor = "grey";
            
//                        cells[mine-1].setAttribute("style", "background-image:unset; background-color:rgb(192, 189, 189)");
            minesAll[j] = cells[mine-1];
        }
    }
    let h4 = document.querySelector("h4");
    h4.innerHTML = mines.join(", ")
    console.log(minesAll)
}

mineSettlement();

const rightButton = (element) => {
    if (element.style.backgroundImage=='url("./images/flag.png")'){
            element.style.backgroundImage = "unset";
            element.style.backgroundColor = "rgb(192, 189, 189)";
            counterFlags--;
        } else if (counterFlags < minesQuantity) {
            element.style.cssText = `
                background-image: url(./images/flag.png);
                background-size: 100%;`
            counterFlags++;
        }
        
    }

// Функция вычисления мин в соседних ячейках
const neighbourMines = (i) => {
    mines.forEach((e)=>{
        if ((i+1)%8==0) {
            for (y=i-8; y<i+9; y=y+8) {
                for (x=y; x<y+2; x++){
                    if (x == e) {
                    counterNeighbour++;
                    }
                }
            }  
/*            for (x=i-8, y=i+8; x<i-6, y<i+10; x++, y++) {
                if (x == e || y == e) {
                    counterNeighbour++;
                }
            }
            if (i == e) {
                counterNeighbour++;
            }*/

        } else if ((i+1)%8==1) {
            for (x=i-7, y=i+9; x<i-5, y<i+11; x++, y++) {
                if (x == e || y == e) {
                    counterNeighbour++;
                }
            }
               if (i+2 == e) {
                counterNeighbour++;
                } 
        } else {
            for (y=i-8; y<i+9; y=y+8) {
                for (x=y; x<y+3; x++){
                    if (x == e) {
                    counterNeighbour++;
                    }
                }
            }              
        }
    })
}   
//Функция открытия ячеек без мин
const openCell = (i, elem) => {
    neighbourMines(i);
 
    elem.style.backgroundColor = "lightgrey";
    
    if (counterNeighbour !== 0){
        switch(counterNeighbour) {
            case 1: {
                elem.style.color = "green"
            }
            break;
            case 2: {
                elem.style.color = "orange"
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
        elem.innerHTML = counterNeighbour;  
    } 
}

// Функционал правой кнопки мыши
cells.forEach((elem, index, arr)=> {
    elem.addEventListener('contextmenu', (ev) => {
        rightButton(ev.target);
        flagsQuantity.innerHTML = counterFlags;
        ev.preventDefault();
    })
}) 

// Функционал левой кнопки мыши
cells.forEach((elem, index, array)=> {
    elem.addEventListener('click', (ev) => {
        if (counterClicks == 0) {
            startOver();
            counterClicks++;
        }
        
        if (ev.target.classList.contains("mine")) {
            minesAll.forEach((el)=> {
                el.removeAttribute("style");
                el.className = "exploded_mine";
                
            })
            cells.forEach((elem) => {
                elem.removeEventListener("contextmenu", (ev) => {
                    rightButton(ev.target);
                })
                
            })
        } else {
            openCell(index, elem);
            if (counterNeighbour == 0) {
                if ((index+1)%8==0) {
                    for (i = index; counterNeighbour == 0; i--) {
                        openCell(i-1, array[i-1]);
                    }
                    counterNeighbour = 0;
                    for (a=index-7, b=index+9; counterNeighbour == 0; a-8, b+8) { 
                        for (i = a; counterNeighbour == 0; i--) {
                            openCell(i-1, array[i-1]);
                        }
                        counterNeighbour = 0;
                        for (j = b; counterNeighbour == 0; j--) {
                            openCell(j-1, array[j-1]);
                        }
                    }

                } else if ((index+1)%8==1) {
                    for (x=i-7, y=i+9; x<i-5, y<i+11; x++, y++) { }
                        for (i = index; counterNeighbour == 0; i++) {
                            openCell(i+1, array[i+1]);
                        }
                        
                } else {}
/*  */                  for (x=i-8, y=i+8, z=i; x<i-5, y<i+11, z<i+3; x++, y++, z++) {
                        if (x == e || y == e || z==e) {
                            counterNeighbour++;
                        }
                    }              
                


                
                counterNeighbour = 0;
                

            }
            counterNeighbour = 0;
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
        flagsQuantity.innerHTML = "0";
        cells.forEach((el)=>{
            el.className = "cell";
            el.innerHTML ="";
            el.removeAttribute("style");
        }) 
        mineSettlement();
        e.target.remove();
    })
}