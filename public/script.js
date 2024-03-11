let firstClick = null;

function clickLetter(cell) {
  const rowIndex = cell.getAttribute('data-row');
  const colIndex = cell.getAttribute('data-col');

  // If it's the first click, mark it and highlight the cell
  if (!firstClick) {
    firstClick = { rowIndex, colIndex, letter: cell.textContent };
    cell.classList.add('highlighted');
  } else {
    // Second click: determine all cells between the first and this click
    highlightCells(firstClick, { rowIndex, colIndex });
    firstClick = null; // Reset for the next selection
  }
}

function highlightCells(start, end) {
  const startRow = Math.min(start.rowIndex, end.rowIndex);
  const endRow = Math.max(start.rowIndex, end.rowIndex);
  const startCol = Math.min(start.colIndex, end.colIndex);
  const endCol = Math.max(start.colIndex, end.colIndex);
  let selectedWord = '';

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
      cell.classList.add('highlighted');
      selectedWord += cell.textContent;
    }
  }

  // Check if the selected word is in the word list
  console.log(selectedWord);
  checkWord(selectedWord);
}

function checkWord(word) {
  console.log(wordList);
  if (wordList.includes(word)) {
    // Word found: Change highlights to green and strike through the word in the list
    document.querySelectorAll('.highlighted').forEach(cell => {
      cell.classList.remove('highlighted');
      cell.classList.add('correct');
    });

    // Find the word in the word list and apply strikethrough
    const wordElem = document.querySelector(`#wordListContainer p[data-word="${word}"]`);
    if (wordElem) {
      wordElem.style.textDecoration = 'line-through';
    }
  } else {
    // Word not found: Remove highlights
    document.querySelectorAll('.highlighted').forEach(cell => cell.classList.remove('highlighted'));
  }
}
