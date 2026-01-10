// Game State
const board = Array.from({length: 100}, (_, i) => i + 1);

// Snakes (head -> tail)
const snakes = {
    98: 78,
    95: 56,
    88: 24,
    62: 18,
    48: 26,
    36: 6,
    32: 10
};

// Ladders (bottom -> top)
const ladders = {
    4: 25,
    13: 46,
    33: 49,
    42: 63,
    50: 69,
    62: 81,
    74: 92
};

let player1Pos = 1;
let rollCount = 0;
let gameOver = false;

// Initialize board
function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    // Create SVG overlay
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('svg-overlay');
    svg.setAttribute('viewBox', '0 0 1000 1000');

    // Create board in reverse order (100 to 1) with snake pattern
    for (let row = 9; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            let cellNum;
            if (row % 2 === 0) {
                cellNum = row * 10 + col + 1;
            } else {
                cellNum = row * 10 + (9 - col) + 1;
            }

            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${cellNum}`;
            cell.dataset.row = 9 - row;
            cell.dataset.col = (row % 2 === 0) ? col : (9 - col);
            
            const cellNumber = document.createElement('div');
            cellNumber.className = 'cell-number';
            cellNumber.textContent = cellNum;
            cell.appendChild(cellNumber);

            if (cellNum === 1) {
                cell.classList.add('start');
            } else if (cellNum === 100) {
                cell.classList.add('end');
            } else if (snakes[cellNum]) {
                cell.classList.add('snake');
            } else if (ladders[cellNum]) {
                cell.classList.add('ladder');
            }

            boardElement.appendChild(cell);
        }
    }

    // Draw snakes and ladders on SVG
    drawSnakesAndLadders(svg);
    boardElement.appendChild(svg);
    updatePlayerPositions();
}

function getCellCenter(cellNum) {
    const cell = document.getElementById(`cell-${cellNum}`);
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    return {
        x: col * 100 + 50,
        y: row * 100 + 50
    };
}

function drawSnakesAndLadders(svg) {
    // Draw all snakes
    for (const [head, tail] of Object.entries(snakes)) {
        drawSnake(svg, parseInt(head), parseInt(tail));
    }

    // Draw all ladders
    for (const [bottom, top] of Object.entries(ladders)) {
        drawLadder(svg, parseInt(bottom), parseInt(top));
    }
}

function drawSnake(svg, head, tail) {
    const start = getCellCenter(head);
    const end = getCellCenter(tail);

    // Create sinuous snake body path
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const offset = 40;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = `M ${start.x} ${start.y} Q ${midX + offset} ${midY - offset} ${end.x} ${end.y}`;
    path.setAttribute('d', d);
    path.setAttribute('stroke', '#ff4444');
    path.setAttribute('stroke-width', '12');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.8');
    svg.appendChild(path);

    // Snake pattern (dots along body)
    for (let i = 0; i <= 1; i += 0.15) {
        const t = i;
        const x = start.x * (1 - t) * (1 - t) + 2 * (midX + offset) * (1 - t) * t + end.x * t * t;
        const y = start.y * (1 - t) * (1 - t) + 2 * (midY - offset) * (1 - t) * t + end.y * t * t;
        
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        dot.setAttribute('r', '3');
        dot.setAttribute('fill', '#8b0000');
        svg.appendChild(dot);
    }

    // Snake head
    const headCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    headCircle.setAttribute('cx', start.x);
    headCircle.setAttribute('cy', start.y);
    headCircle.setAttribute('r', '10');
    headCircle.setAttribute('fill', '#cc0000');
    svg.appendChild(headCircle);

    // Snake eyes
    const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eye1.setAttribute('cx', start.x - 3);
    eye1.setAttribute('cy', start.y - 2);
    eye1.setAttribute('r', '2');
    eye1.setAttribute('fill', 'white');
    svg.appendChild(eye1);

    const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eye2.setAttribute('cx', start.x + 3);
    eye2.setAttribute('cy', start.y - 2);
    eye2.setAttribute('r', '2');
    eye2.setAttribute('fill', 'white');
    svg.appendChild(eye2);

    // Snake tail
    const tailCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    tailCircle.setAttribute('cx', end.x);
    tailCircle.setAttribute('cy', end.y);
    tailCircle.setAttribute('r', '6');
    tailCircle.setAttribute('fill', '#ff6666');
    svg.appendChild(tailCircle);
}

function drawLadder(svg, bottom, top) {
    const start = getCellCenter(bottom);
    const end = getCellCenter(top);

    const leftOffset = -8;
    const rightOffset = 8;

    // Left rail
    const leftRail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    leftRail.setAttribute('x1', start.x + leftOffset);
    leftRail.setAttribute('y1', start.y);
    leftRail.setAttribute('x2', end.x + leftOffset);
    leftRail.setAttribute('y2', end.y);
    leftRail.setAttribute('stroke', '#8B4513');
    leftRail.setAttribute('stroke-width', '6');
    leftRail.setAttribute('stroke-linecap', 'round');
    svg.appendChild(leftRail);

    // Right rail
    const rightRail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rightRail.setAttribute('x1', start.x + rightOffset);
    rightRail.setAttribute('y1', start.y);
    rightRail.setAttribute('x2', end.x + rightOffset);
    rightRail.setAttribute('y2', end.y);
    rightRail.setAttribute('stroke', '#8B4513');
    rightRail.setAttribute('stroke-width', '6');
    rightRail.setAttribute('stroke-linecap', 'round');
    svg.appendChild(rightRail);

    // Rungs
    const numRungs = Math.floor(Math.abs(end.y - start.y) / 40);
    for (let i = 0; i <= numRungs; i++) {
        const t = i / numRungs;
        const rungY = start.y + (end.y - start.y) * t;
        const rungX = start.x + (end.x - start.x) * t;

        const rung = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rung.setAttribute('x1', rungX + leftOffset);
        rung.setAttribute('y1', rungY);
        rung.setAttribute('x2', rungX + rightOffset);
        rung.setAttribute('y2', rungY);
        rung.setAttribute('stroke', '#A0522D');
        rung.setAttribute('stroke-width', '4');
        rung.setAttribute('stroke-linecap', 'round');
        svg.appendChild(rung);
    }
}

function updatePlayerPositions() {
    // Remove all existing players
    document.querySelectorAll('.player').forEach(p => p.remove());

    // Add player
    const cell1 = document.getElementById(`cell-${player1Pos}`);
    const p1 = document.createElement('div');
    p1.className = 'player';
    p1.textContent = '🎯';
    cell1.appendChild(p1);

    // Update info display
    document.getElementById('player1Pos').textContent = player1Pos;
    document.getElementById('rollCount').textContent = rollCount;
}

function rollDice() {
    if (gameOver) return;

    const dice = Math.floor(Math.random() * 6) + 1;
    rollCount++;
    document.getElementById('diceResult').textContent = `🎲 Rolled: ${dice}`;

    let newPos = player1Pos + dice;

    if (newPos > 100) {
        document.getElementById('message').textContent = `You need exact roll to win! (Need ${100 - player1Pos})`;
        document.getElementById('rollCount').textContent = rollCount;
        return;
    }

    // Check for snake
    if (snakes[newPos]) {
        document.getElementById('message').textContent = `🐍 Snake! ${newPos} → ${snakes[newPos]}`;
        newPos = snakes[newPos];
    }
    // Check for ladder
    else if (ladders[newPos]) {
        document.getElementById('message').textContent = `🪜 Ladder! ${newPos} → ${ladders[newPos]}`;
        newPos = ladders[newPos];
    } else {
        document.getElementById('message').textContent = '';
    }

    // Update position
    player1Pos = newPos;

    updatePlayerPositions();

    // Check for win
    if (newPos === 100) {
        document.getElementById('message').textContent = `🎉 You Win! Completed in ${rollCount} rolls! 🎉`;
        document.getElementById('rollDice').disabled = true;
        gameOver = true;
        return;
    }
}

function resetGame() {
    player1Pos = 1;
    rollCount = 0;
    gameOver = false;
    document.getElementById('diceResult').textContent = '';
    document.getElementById('message').textContent = '';
    document.getElementById('rollDice').disabled = false;
    updatePlayerPositions();
}

// Event listeners
document.getElementById('rollDice').addEventListener('click', rollDice);
document.getElementById('resetGame').addEventListener('click', resetGame);

// Initialize game
createBoard();
