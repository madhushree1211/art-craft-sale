class StoryPlotAgent {
    constructor() {
        this.stories = [];
        this.editingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStories();
    }

    bindEvents() {
        document.getElementById('addStoryBtn').addEventListener('click', () => this.openModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchStories(e.target.value));
        document.getElementById('storyForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                this.closeModal();
            }
        });
    }

    async loadStories(search = '') {
        try {
            const url = search ? `/api/stories?search=${encodeURIComponent(search)}` : '/api/stories';
            const response = await fetch(url);
            this.stories = await response.json();
            this.renderStories();
        } catch (error) {
            this.showNotification('Error loading stories', 'error');
        }
    }

    renderStories() {
        const container = document.getElementById('storiesContainer');
        
        if (this.stories.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>📖 No stories found</h3>
                    <p>Start creating your first story plot!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.stories.map(story => `
            <div class="story-card" data-id="${story.id}">
                <h3>${this.escapeHtml(story.title)}</h3>
                <span class="story-genre">${this.escapeHtml(story.genre)}</span>
                <p class="story-plot">${this.escapeHtml(story.plot)}</p>
                <p class="story-characters"><strong>Characters:</strong> ${this.escapeHtml(story.characters)}</p>
                <div class="story-actions">
                    <button class="btn btn-edit" onclick="app.editStory(${story.id})">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteStory(${story.id})">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    }

    openModal(story = null) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('storyForm');
        
        if (story) {
            modalTitle.textContent = 'Edit Story';
            document.getElementById('title').value = story.title;
            document.getElementById('genre').value = story.genre;
            document.getElementById('characters').value = story.characters;
            document.getElementById('plot').value = story.plot;
            this.editingId = story.id;
        } else {
            modalTitle.textContent = 'Add New Story';
            form.reset();
            this.editingId = null;
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.editingId = null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value.trim(),
            genre: document.getElementById('genre').value,
            characters: document.getElementById('characters').value.trim(),
            plot: document.getElementById('plot').value.trim()
        };

        try {
            let response;
            if (this.editingId) {
                response = await fetch(`/api/stories/${this.editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetch('/api/stories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            if (response.ok) {
                this.closeModal();
                this.loadStories();
                this.showNotification(
                    this.editingId ? 'Story updated successfully!' : 'Story created successfully!',
                    'success'
                );
            } else {
                throw new Error('Failed to save story');
            }
        } catch (error) {
            this.showNotification('Error saving story', 'error');
        }
    }

    async editStory(id) {
        try {
            const response = await fetch(`/api/stories/${id}`);
            const story = await response.json();
            this.openModal(story);
        } catch (error) {
            this.showNotification('Error loading story', 'error');
        }
    }

    async deleteStory(id) {
        if (!confirm('Are you sure you want to delete this story?')) return;

        try {
            const response = await fetch(`/api/stories/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.loadStories();
                this.showNotification('Story deleted successfully!', 'success');
            } else {
                throw new Error('Failed to delete story');
            }
        } catch (error) {
            this.showNotification('Error deleting story', 'error');
        }
    }

    searchStories(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.loadStories(query);
        }, 300);
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const app = new StoryPlotAgent();