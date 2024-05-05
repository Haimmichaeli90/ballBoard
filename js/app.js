'use strict'

 

const WALL = 'WALL'

const FLOOR = 'FLOOR'

const BALL = 'BALL'

const GAMER = 'GAMER'

const PORTAL = 'PORTAL'

const GLUE = 'GLUE'

 

const GAMER_IMG = '<img src="img/gamer.png">'

const BALL_IMG = '<img src="img/ball.png">'

const GLUE_IMG = '<img src="img/candy.png">'

 

// Model:

var gBoard

var gGamerPos

var gBallsCollect

var gAddBallsInterval

var gIntervalGlue

var gIsGlue

var gTotalBall

var gTimeInterval

 

function initGame() {

    gGamerPos = { i: 2, j: 9 }

    gBoard = buildBoard()

    renderBoard(gBoard)

    gBallsCollect = 0

    gTotalBall = 2

    gAddBallsInterval = setInterval(addBalls,5000)

    gIntervalGlue = setInterval(addGlue,5000)

    renderBallCount()

    renderNegs()

    setRenderTime()

    elapsedTime()

    gIsGlue = false

    var elBtn = document.querySelector('.restart')

    elBtn.style.display = 'none'

 

}

 

function addGlue(){

    var emptyCells = getEmptyCell(gBoard)

    if(!emptyCells) return

    gBoard[emptyCells.i][emptyCells.j].gameElement = GLUE

    renderCell(emptyCells,GLUE_IMG)

 

    setTimeout(() => {

        if (gIsGlue) return

        gBoard[emptyCells.i][emptyCells.j].gameElement = GLUE

        renderCell(emptyCells, '')

    }, 3000)

}

 

function collectingBallsCount(){

    // debugger

    var soundEat = new Audio('../audio/munch.wav')

    gBallsCollect++

    gTotalBall--

    console.log('--gTotalBall',gTotalBall)

    renderBallCount()

    soundEat.play()

    gameOver()

    

}

 

function renderNegs() {

    const negs = countUpNegs()

    const elNegsCount = document.querySelector('.negs')

    elNegsCount.innerHTML = negs

}

 

function countUpNegs(){

    var negCount = 0

        var iPos = gGamerPos.i

        var jPos = gGamerPos.j

    for(var i = iPos - 1; i <= iPos + 1; i++){

        if(i === 0 || i === gBoard.length - 1) continue

        for(var j = jPos - 1; j <= jPos + 1; j++){

            if(j === 0 || j === gBoard[i] - 1) continue

            if(i === iPos && j === jPos) continue

            if (gBoard[i][j].gameElement === BALL) {

                negCount++

            }

          

            // const elCell = document.querySelector(`[data-i="${1}"][data-j="${j}"]`)

            // console.log(elCell)

        }

    }

    // console.log('negCount',negCount)

    return negCount

  

}

 

function renderBallCount() {

    const elCounter = document.querySelector('.collected')

    elCounter.innerHTML = gBallsCollect

}

 

function addBalls(){

   const addBall = getEmptyCell(gBoard)

   if (!addBall) return

   gBoard[addBall.i][addBall.j].gameElement = BALL

   renderCell(addBall,BALL_IMG)

   gTotalBall++

   renderNegs()

  

//    console.log('renderNegs',renderNegs())

}

 

function getEmptyCell(gBoard){

    var emptyCells = []

    for(var i = 0; i < gBoard.length - 1; i++){

        for(var j = 0; j < gBoard[i].length - 1; j++){

            var currCell = gBoard[i][j]

            if(currCell.gameElement === null && currCell.type === FLOOR){

                emptyCells.push({i,j})

            }

        }

    }

    if(!emptyCells.length) return null

    var randIdx = getRandomIntInclusive(0,emptyCells.length - 1)

    return emptyCells[randIdx]

}

 

function gameOver(){

    if(gTotalBall === 0){

       

       var elBtn = document.querySelector('.restart')

        elBtn.style.display = 'block'

        console.log('Victory')

        clearInterval(gAddBallsInterval)

        clearInterval(gIntervalGlue)

        clearInterval(gTimeInterval)

    }

}

 

function buildBoard() {

    const board = createMat(12, 13)

 

    for(var i = 0; i < board.length; i++){

        for(var j = 0; j < board[i].length; j++){

            if(i === 0 || i === board.length - 1 || j === 0 || j === board[i].length - 1){

                board[i][j] = { type: WALL, gameElement: null }

            } else {

                board[i][j] = { type: FLOOR, gameElement: null }

            }

        }

    }

 

    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER

    board[6][6].gameElement = BALL

    board[3][3].gameElement = BALL

    board[0][6].type = PORTAL

    board[11][6].type = PORTAL

    board[6][0].type = PORTAL

    board[6][12].type = PORTAL

    // board[4][7].gameElement = GLUE

    // console.log(board)

    return board

}

 

// Render the board to an HTML table

function renderBoard(board) {

 

    const elBoard = document.querySelector('.board')

    var strHTML = ''

    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>\n'

        for (var j = 0; j < board[0].length; j++) {

            const currCell = board[i][j]

 

            var cellClass = getClassName({ i, j })

 

            if (currCell.type === FLOOR) cellClass += ' floor'

            else if (currCell.type === WALL) cellClass += ' wall'

 

            // strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})">`

 

            if (currCell.gameElement === GAMER) {

                strHTML += GAMER_IMG

            } else if (currCell.gameElement === BALL) {

                strHTML += BALL_IMG

            }

 

            strHTML += '</td>\n'

        }

        strHTML += '</tr>\n'

    }

    elBoard.innerHTML = strHTML

   

}

 

// Move the player to a specific location

function moveTo(i, j) {

 

    const fromCell = gBoard[gGamerPos.i][gGamerPos.j]

    const toCell = gBoard[i][j]

    if(gIsGlue) return

    if (toCell.type === WALL) return

 

    // Calculate distance to make sure we are moving to a neighbor cell

    const iAbsDiff = Math.abs(i - gGamerPos.i)

    const jAbsDiff = Math.abs(j - gGamerPos.j)

 

    // If the clicked Cell is one of the four allowed

 

    //_$(iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

    if (iAbsDiff + jAbsDiff === 1) {

 

        if (toCell.gameElement === BALL) {

            collectingBallsCount()

            console.log('Collecting!')

        } else if (toCell.type === PORTAL){

            if(i === 0 && j === 6) {

                i = 10 , j =6

            } else if(i ===11 && j === 6){

                i = 1, j = 6

            }else if(i === 6 && j === 0){

                i = 6, j = 11

            }else if(i === 6 && j === 12){

                i = 6 , j = 1

            }

        }

    if(toCell.gameElement === GLUE){

        gIsGlue = true

        setTimeout(()=> gIsGlue = false,3000)

    }

        // TODO: Move the gamer

        fromCell.gameElement = null

 

        // DOM - origin

        renderCell(gGamerPos, '')

       

        // Model - destination

        toCell.gameElement = GAMER

       

        // DOM - destination

        renderCell({ i, j }, GAMER_IMG) // { i: i, j: j }

 

        // Model = gGamerPos

        gGamerPos = { i, j }

        renderNegs()

    

 

    } else console.log('Bad Move', iAbsDiff, jAbsDiff)

   

}

 

// Convert a location object {i, j} to a selector and render a value in that element

function renderCell(location, value) {

    const cellSelector = '.' + getClassName(location)

    const elCell = document.querySelector(cellSelector)

    elCell.innerHTML = value

}

 

// Move the player by keyboard arrows

function handleKey(event) {

    const i = gGamerPos.i

    const j = gGamerPos.j

 

    switch (event.key) {

        case 'ArrowLeft':

            moveTo(i, j - 1)

            break

        case 'ArrowRight':

            moveTo(i, j + 1)

            break

        case 'ArrowUp':

            moveTo(i - 1, j)

            break

        case 'ArrowDown':

            moveTo(i + 1, j)

            break

    }

}

 

// Returns the class name for a specific cell

function getClassName(position) {

    const cellClass = `cell-${position.i}-${position.j}`

    return cellClass

}

 

function setRenderTime(){

   

    var elTimer = document.querySelector('.timer')

    elTimer.innerHTML = `<span>playTime: ${gTimer}</span>`

   

}