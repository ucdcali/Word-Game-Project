import Player from '../models/Player.js';

const generateWordSearch = (words, gridSize = 15) => {
  let grid = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => ' '));

  const placeWord = (word) => {
    const horizontal = Math.random() < 0.5; // Randomly choose horizontal or vertical placement
    for (let attempt = 0; attempt < 100; attempt++) { // Limit attempts to prevent infinite loops
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const endRow = horizontal ? row : row + word.length - 1;
      const endCol = horizontal ? col + word.length - 1 : col;

      // Check if the word fits within the grid bounds
      if (endRow >= gridSize || endCol >= gridSize) continue;

      let fits = true;
      // Check if the word fits in the empty cells or intersects correctly
      for (let i = 0; i < word.length; i++) {
        const currentRow = horizontal ? row : row + i;
        const currentCol = horizontal ? col + i : col;
        const cell = grid[currentRow][currentCol];
        if (cell !== ' ' && cell !== word[i]) {
          fits = false;
          break;
        }
      }

      // Place the word if it fits
      if (fits) {
        for (let i = 0; i < word.length; i++) {
          grid[horizontal ? row : row + i][horizontal ? col + i : col] = word[i];
        }
        return true; // Word placed successfully
      }
    }
    return false; // Word placement failed after attempts
  };

  words.forEach(word => {
    placeWord(word.toUpperCase()); // Convert to uppercase for consistency
  });

  // Fill in remaining spaces with random letters
  return grid.map(row => row.map(cell => cell === ' ' ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : cell));
};



export const home = async (req, res) => {
  const theme = req.query.theme || 'school';
  
  try {
    const players = await Player.find();
   
    const currentPlayer = req.session.player ? req.session.player.username : 'Guest';
    console.log(`Current player: ${currentPlayer}`);
    const player = await Player.findOne({username : currentPlayer});
    
    const apiUrl = `https://api.datamuse.com/words?rel_trg=${theme}&max=10`; // Get 10 words related to "school"
    const response = await fetch(apiUrl);
    const words = await response.json();
    
    // Extract just the words, not the entire object
    const wordList = words.map(wordObj => wordObj.word.toUpperCase().slice(0, 15)); // Ensure words fit in the grid

    const grid = generateWordSearch(wordList);

    res.render('index', { grid, wordList, players, currentPlayer });
  } catch (error) {
    console.error('Error fetching words:', error);
    res.render('index', { wordList: JSON.stringify([]) });
  }
};

export const addPlayer = async (req, res) => {
  const { username } = req.body; // Assuming the username is sent in the body of the request

  if (!username) {
    return res.status(400).send({ message: 'Username is required' });
  }

  try {
    // Check if player already exists
    const existingPlayer = await Player.findOne({ username });
    if (existingPlayer) {
      return res.status(409).send({ message: 'Player already exists' }); // 409 Conflict
    }

    // Create a new player
    const player = new Player({ username });
    await player.save();

    req.session.player = { username: player.username, id: player._id };
    res.redirect('/');
  } catch (error) {
    console.error('Failed to add player:', error);
    res.status(500).send({ message: 'Failed to add player' }); // 500 Internal Server Error
  }
};


export const selectPlayer = async (req, res) => {
  const { username } = req.body; // Assuming the username is sent in the body of the request

  if (!username) {
    return res.status(400).send({ message: 'Username is required' });
  }

  try {
    const player = await Player.findOne({ username });

    if (!player) {
      return res.status(404).send({ message: 'Player not found' }); // 404 Not Found
    }

    req.session.player = { username: player.username, id: player._id };
    res.redirect('/');
  } catch (error) {
    console.error('Failed to select player:', error);
    res.status(500).send({ message: 'Failed to select player' }); // 500 Internal Server Error
  }
};
