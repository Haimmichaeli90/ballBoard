
var gTimer = 0

 

function elapsedTime(){

   var startTime = Date.now()

    gTimeInterval = setInterval(()=> {

        var elapsedTime = (Date.now() - startTime) / 1000

        gTimer = elapsedTime.toFixed(3)

        setRenderTime()

    },79)

}

 

function createMat(ROWS, COLS) {

    const mat = []

    for (var i = 0; i < ROWS; i++) {

        const row = []

        for (var j = 0; j < COLS; j++) {

            row.push('')

        }

        mat.push(row)

    }

    return mat

}

function getRandomIntInclusive(min, max) {

    min = Math.ceil(min);

    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min)

  }

 