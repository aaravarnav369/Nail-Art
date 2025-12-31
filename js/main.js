/**
 * Main JavaScript file for rendering posts from JSON
 * Created: 2025-12-31 08:00:05 UTC
 */

// Post rendering module
const PostRenderer = {
  /**
   * Initialize the post renderer
   */
  init() {
    this.loadPosts();
  },

  /**
   * Load posts from JSON and render them
   */
  async loadPosts() {
    try {
      // Fetch posts from JSON file or API
      const response = await fetch('data/posts.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const posts = await response.json();
      this.renderPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
      this.displayError('Failed to load posts. Please try again later.');
    }
  },

  /**
   * Render posts to the DOM
   * @param {Array} posts - Array of post objects
   */
  renderPosts(posts) {
    const container = document.getElementById('posts-container');
    
    if (!container) {
      console.error('Posts container not found');
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    if (posts.length === 0) {
      container.innerHTML = '<p class="no-posts">No posts available.</p>';
      return;
    }

    // Create and append post elements
    posts.forEach(post => {
      const postElement = this.createPostElement(post);
      container.appendChild(postElement);
    });
  },

  /**
   * Create a single post element
   * @param {Object} post - Post object
   * @returns {HTMLElement} Post element
   */
  createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'post';
    article.setAttribute('data-id', post.id);

    let imageHTML = '';
    if (post.image) {
      imageHTML = `<img src="${this.escapeHtml(post.image)}" alt="${this.escapeHtml(post.title)}" class="post-image">`;
    }

    let tagsHTML = '';
    if (post.tags && Array.isArray(post.tags)) {
      tagsHTML = `
        <div class="post-tags">
          ${post.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
        </div>
      `;
    }

    article.innerHTML = `
      <div class="post-content">
        ${imageHTML}
        <div class="post-text">
          <h2 class="post-title">${this.escapeHtml(post.title)}</h2>
          <p class="post-excerpt">${this.escapeHtml(post.excerpt || post.description || '')}</p>
          ${tagsHTML}
          <div class="post-meta">
            <span class="post-date">${this.formatDate(post.date)}</span>
            ${post.author ? `<span class="post-author">By ${this.escapeHtml(post.author)}</span>` : ''}
          </div>
          <a href="${this.escapeHtml(post.url || '#')}" class="post-link">Read More</a>
        </div>
      </div>
    `;

    return article;
  },

  /**
   * Format date string
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  },

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Display error message
   * @param {string} message - Error message to display
   */
  displayError(message) {
    const container = document.getElementById('posts-container');
    if (container) {
      container.innerHTML = `<div class="error-message">${this.escapeHtml(message)}</div>`;
    }
  },

  /**
   * Filter posts by tag
   * @param {string} tag - Tag to filter by
   */
  filterByTag(tag) {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
      const tags = Array.from(post.querySelectorAll('.tag')).map(t => t.textContent);
      post.style.display = tags.includes(tag) ? 'block' : 'none';
    });
  },

  /**
   * Search posts by title or excerpt
   * @param {string} query - Search query
   */
  searchPosts(query) {
    const posts = document.querySelectorAll('.post');
    const lowerQuery = query.toLowerCase();

    posts.forEach(post => {
      const title = post.querySelector('.post-title')?.textContent.toLowerCase() || '';
      const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
      
      const matches = title.includes(lowerQuery) || excerpt.includes(lowerQuery);
      post.style.display = matches ? 'block' : 'none';
    });
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  PostRenderer.init();
});

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PostRenderer;
}
