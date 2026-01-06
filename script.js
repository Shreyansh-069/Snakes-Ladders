const diceRoll = () => {
    return Math.floor(Math.random() * 6) + 1
}


let isRunning = true

const gameLoop = (isRunning) => {
    let pos = 0
    
    let snakes = [[99, 10], [78, 15], [63, 17], [52, 30]]
    
    let ladders = [[8, 26], [50, 91], [21, 82], [43, 77]]
    
    while (isRunning) {
        console.log(pos, " ")

        let delta = diceRoll()

        console.log("(the die rolled to: ", delta, ") ")

        let bite = false
        let climb = false

        for (let i = 0; i < 4; i++) {
            if (pos + delta == snakes[i][0]) {
                pos = snakes[i][1]
                bite = true
                console.log(" [snake cuts you] ")
                break;
            }
        }

        for (let i = 0; i < 4; i++) {
            if (pos + delta == ladders[i][0]) {
                pos = ladders[i][1];
                climb = true;
                console.log(" [what a jump!] ")
                break;
            }
        }

        if (!bite && !climb) {
            if (pos + delta > 100) pos += 0;
            else if (pos + delta == 100) {
                console.log(" {congrats you WON !!} ")
                pos += delta;
                isRunning = false;
            } 
            else {
                pos += delta;
            }
        }

        console.log(" :", pos, "\n")
    }
}

gameLoop(isRunning)