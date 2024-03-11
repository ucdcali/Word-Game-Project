import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  found: { type: Boolean, default: false }
});

const ThemeSchema = new mongoose.Schema({
  theme: { type: String, required: true },
  words: [WordSchema]
});

const PlayerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  themes: [ThemeSchema],
  wordsFound: { type: Number, default: 0 },
  puzzlesCompleted: { type: Number, default: 0 }
});

const Player = mongoose.models.Player || mongoose.model('Player', PlayerSchema);
export default Player;
