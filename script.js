// Nomes das peças para tooltip
const pieceNames = {
  '♔': 'Rei Branco', '♚': 'Rei Preto',
  '♕': 'Rainha Branca', '♛': 'Rainha Preta',
  '♖': 'Torre Branca', '♜': 'Torre Preta',
  '♗': 'Bispo Branco', '♝': 'Bispo Preto',
  '♘': 'Cavalo Branco', '♞': 'Cavalo Preto',
  '♙': 'Peão Branco', '♟': 'Peão Preto'
};

// Alternar visibilidade das instruções
function toggleInfo() {
  const box = document.getElementById('info-box');
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

// Temporizador
let time1 = 60;
let time2 = 60;
let currentPlayer = 'white';
const timer1El = document.getElementById('timer1');
const timer2El = document.getElementById('timer2');

const interval = setInterval(() => {
  if (time1 <= 0 || time2 <= 0) {
    clearInterval(interval);
    alert(time1 <= 0 ? '⏱️ Tempo esgotado para Jogadora 1!' : '⏱️ Tempo esgotado para Jogador 2!');
    return;
  }
  if (currentPlayer === 'white') {
    time1--;
    timer1El.textContent = time1;
  } else {
    time2--;
    timer2El.textContent = time2;
  }
}, 1000);

function restartGame() {
  location.reload();
}

// Tabuleiro
const board = document.getElementById('board');
const whiteScore = document.getElementById('white-score');
const blackScore = document.getElementById('black-score');
let selected = null;
let whiteCaptured = 0;
let blackCaptured = 0;

const pieces = {
  0: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  1: Array(8).fill('♟'),
  6: Array(8).fill('♙'),
  7: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
};

function createCell(row, col) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  const isWhite = (row + col) % 2 === 0;
  cell.classList.add(isWhite ? 'white' : 'black');
  cell.dataset.row = row;
  cell.dataset.col = col;

  if (pieces[row] && pieces[row][col]) {
    const piece = document.createElement('span');
    piece.textContent = pieces[row][col];
    piece.title = pieceNames[pieces[row][col]] || '';
    piece.classList.add('piece');
    piece.style.transition = 'transform 0.3s ease';
    cell.appendChild(piece);
  }

  cell.addEventListener('click', () => handleClick(cell));
  return cell;
}

function handleClick(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (selected) {
    const fromRow = parseInt(selected.dataset.row);
    const fromCol = parseInt(selected.dataset.col);
    const movingPiece = selected.querySelector('.piece');
    const targetPiece = cell.querySelector('.piece');

    if (movingPiece && isValidMove(movingPiece.textContent, fromRow, fromCol, row, col)) {
      if (targetPiece) {
        const isWhiteTarget = isWhitePiece(targetPiece.textContent);
        const isWhiteMover = isWhitePiece(movingPiece.textContent);
        if (isWhiteTarget !== isWhiteMover) {
          if (isWhiteTarget) whiteCaptured++; else blackCaptured++;
          whiteScore.textContent = whiteCaptured;
          blackScore.textContent = blackCaptured;
          cell.innerHTML = '';
        } else {
          resetSelection();
          return;
        }
      }
      movingPiece.style.transform = 'scale(1.1)';
      setTimeout(() => movingPiece.style.transform = 'scale(1)', 200);
      cell.appendChild(movingPiece);
      selected.innerHTML = '';
      resetSelection();
      currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    } else {
      resetSelection();
    }
  } else if (cell.querySelector('.piece')) {
    const piece = cell.querySelector('.piece');
    if ((currentPlayer === 'white' && isWhitePiece(piece.textContent)) ||
        (currentPlayer === 'black' && !isWhitePiece(piece.textContent))) {
      selected = cell;
      cell.classList.add('selected');
    }
  }
}

function resetSelection() {
  if (selected) selected.classList.remove('selected');
  selected = null;
}

function isWhitePiece(piece) {
  return ['♙', '♖', '♘', '♗', '♕', '♔'].includes(piece);
}

function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
  const dr = toRow - fromRow;
  const dc = toCol - fromCol;

  switch (piece) {
    case '♙': return dr === -1 && dc === 0;
    case '♟': return dr === 1 && dc === 0;
    case '♖':
    case '♜': return (dr === 0 || dc === 0);
    default: return true;
  }
}

// Criar o tabuleiro
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    board.appendChild(createCell(row, col));
  }
}