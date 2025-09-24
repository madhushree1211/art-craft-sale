const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage
let stories = [
  { id: 1, title: "The Dragon's Quest", genre: "Fantasy", plot: "A young knight embarks on a journey to defeat an ancient dragon threatening the kingdom.", characters: "Sir Galahad, Princess Elena, Dragon Pyroth", createdAt: new Date().toISOString() },
  { id: 2, title: "Space Odyssey", genre: "Sci-Fi", plot: "Astronauts discover a mysterious signal from deep space that changes humanity forever.", characters: "Captain Nova, Dr. Chen, AI-7", createdAt: new Date().toISOString() }
];
let nextId = 3;

// Routes
app.get('/api/stories', (req, res) => {
  const { search } = req.query;
  let filteredStories = stories;
  
  if (search) {
    filteredStories = stories.filter(story => 
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      story.genre.toLowerCase().includes(search.toLowerCase()) ||
      story.plot.toLowerCase().includes(search.toLowerCase()) ||
      story.characters.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredStories);
});

app.get('/api/stories/:id', (req, res) => {
  const story = stories.find(s => s.id === parseInt(req.params.id));
  if (!story) return res.status(404).json({ error: 'Story not found' });
  res.json(story);
});

app.post('/api/stories', (req, res) => {
  const { title, genre, plot, characters } = req.body;
  const newStory = {
    id: nextId++,
    title,
    genre,
    plot,
    characters,
    createdAt: new Date().toISOString()
  };
  stories.push(newStory);
  res.status(201).json(newStory);
});

app.put('/api/stories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const storyIndex = stories.findIndex(s => s.id === id);
  if (storyIndex === -1) return res.status(404).json({ error: 'Story not found' });
  
  stories[storyIndex] = { ...stories[storyIndex], ...req.body };
  res.json(stories[storyIndex]);
});

app.delete('/api/stories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const storyIndex = stories.findIndex(s => s.id === id);
  if (storyIndex === -1) return res.status(404).json({ error: 'Story not found' });
  
  stories.splice(storyIndex, 1);
  res.json({ message: 'Story deleted successfully' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Story Plot Agent running on http://localhost:${PORT}`);
});