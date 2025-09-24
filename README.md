# AI Story Plot Agent

A complete full-stack application for managing story plots with CRUD functionality and search features.

## Features

- ✨ Add new story plots
- 📖 View all stories in a responsive grid
- ✏️ Edit existing stories
- 🗑️ Delete stories
- 🔍 Real-time search functionality
- 📱 Responsive design with animations
- 💾 In-memory storage (easily upgradable to MongoDB/MySQL)

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: In-memory storage
- **Port**: http://localhost:3000

## Installation & Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /api/stories` - Get all stories (with optional search query)
- `GET /api/stories/:id` - Get a specific story
- `POST /api/stories` - Create a new story
- `PUT /api/stories/:id` - Update an existing story
- `DELETE /api/stories/:id` - Delete a story

## Project Structure

```
ai-story-plot-agent/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS with animations
│   └── script.js       # Frontend JavaScript
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md          # This file
```

## Usage

1. Click "✨ Add New Story" to create a new story plot
2. Fill in the title, genre, characters, and plot description
3. Use the search bar to find specific stories
4. Click "✏️ Edit" to modify existing stories
5. Click "🗑️ Delete" to remove stories (with confirmation)

The application features smooth animations and real-time updates after all operations.