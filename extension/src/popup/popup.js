import { SnippetService } from '../services/SnippetService.js';
import { SearchService } from '../services/SearchService.js';
import { ClipboardService } from '../services/ClipboardService.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';
import { getSnippetIcon, renderIcon } from '../utils/icons.js';

class SnippyApp {
  constructor() {
    this.snippetService = new SnippetService();
    this.searchService = new SearchService(this.snippetService);
    this.currentFilter = 'all';
    this.currentQuery = '';
    this.allSnippets = [];
    this.filteredSnippets = [];
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.init();
  }

  async init() {
    this.attachEventListeners();
    await this.loadAndRender();
  }

  attachEventListeners() {
    document.getElementById('btn-new').onclick = () => this.openCreateModal();
    document.getElementById('btn-settings').onclick = () => this.showSettings();

    // Search
    document.getElementById('search-input').oninput = (e) => {
      this.currentQuery = e.target.value;
      this.currentPage = 1;
      this.applyFilters();
    };

    // Filters
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.currentPage = 1;
        this.applyFilters();
      };
    });

    // Pagination
    document.getElementById('btn-prev').onclick = () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
      }
    };

    document.getElementById('btn-next').onclick = () => {
      const maxPages = Math.ceil(this.filteredSnippets.length / this.itemsPerPage);
      if (this.currentPage < maxPages) {
        this.currentPage++;
        this.renderTable();
      }
    };
  }

  async loadAndRender() {
    this.allSnippets = await this.snippetService.getAll();
    await this.applyFilters();
  }

  async applyFilters() {
    let results = this.allSnippets;

    // Filter by type
    if (this.currentFilter === 'favorites') {
      results = results.filter((s) => s.favorite);
    } else if (this.currentFilter === 'recent') {
      results = await this.snippetService.getRecent();
    }

    // Search
    if (this.currentQuery.trim()) {
      const query = this.currentQuery.toLowerCase();
      results = results.filter((s) => {
        return (
          s.title.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.content.toLowerCase().includes(query)
        );
      });
    }

    this.filteredSnippets = results;
    this.renderTable();
  }

  renderTable() {
    const tbody = document.getElementById('snippets-tbody');
    tbody.innerHTML = '';

    if (this.filteredSnippets.length === 0) {
      document.getElementById('empty-state').style.display = 'flex';
      document.querySelector('.table-wrapper').style.justifyContent = 'center';
      return;
    }

    document.getElementById('empty-state').style.display = 'none';

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageSnippets = this.filteredSnippets.slice(start, end);

    pageSnippets.forEach((snippet) => {
      const row = document.createElement('tr');

      // Icon + Name
      const nameCell = document.createElement('td');
      nameCell.className = 'col-name';
      const iconName = getSnippetIcon(snippet.title, snippet.category);
      const iconEl = renderIcon(iconName, 18);
      const nameDiv = document.createElement('div');
      nameDiv.className = 'snippet-name-cell';
      const iconContainer = document.createElement('div');
      iconContainer.className = 'snippet-icon';
      iconContainer.appendChild(iconEl);
      const nameSpan = document.createElement('span');
      nameSpan.className = 'snippet-name';
      nameSpan.textContent = snippet.title;
      nameSpan.title = snippet.title;
      nameDiv.appendChild(iconContainer);
      nameDiv.appendChild(nameSpan);
      nameCell.appendChild(nameDiv);
      row.appendChild(nameCell);

      // Category
      const categoryCell = document.createElement('td');
      categoryCell.className = 'col-category';
      const categoryBadge = document.createElement('span');
      categoryBadge.className = 'category-badge';
      categoryBadge.textContent = snippet.category;
      categoryCell.appendChild(categoryBadge);
      row.appendChild(categoryCell);

      // Content
      const contentCell = document.createElement('td');
      contentCell.className = 'col-content';
      const contentDiv = document.createElement('div');
      contentDiv.className = 'content-preview';
      contentDiv.textContent = snippet.content;
      contentDiv.title = snippet.content;
      contentDiv.onclick = (e) => {
        e.stopPropagation();
        this.handleCopy(snippet);
      };
      contentCell.appendChild(contentDiv);
      row.appendChild(contentCell);

      // Favorite
      const favoriteCell = document.createElement('td');
      favoriteCell.className = 'col-favorite';
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'favorite-btn';
      if (snippet.favorite) favoriteBtn.classList.add('active');
      favoriteBtn.innerHTML = snippet.favorite ? '★' : '☆';
      favoriteBtn.onclick = (e) => {
        e.stopPropagation();
        this.handleToggleFavorite(snippet.id, !snippet.favorite);
      };
      favoriteCell.appendChild(favoriteBtn);
      row.appendChild(favoriteCell);

      // Actions
      const actionsCell = document.createElement('td');
      actionsCell.className = 'col-actions';
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions-cell';

      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn-action';
      btnEdit.textContent = '✏️';
      btnEdit.title = 'Edit';
      btnEdit.onclick = (e) => {
        e.stopPropagation();
        this.handleEdit(snippet);
      };

      const btnDelete = document.createElement('button');
      btnDelete.className = 'btn-action btn-delete';
      btnDelete.textContent = '🗑️';
      btnDelete.title = 'Delete';
      btnDelete.onclick = (e) => {
        e.stopPropagation();
        this.handleDelete(snippet.id, snippet.title);
      };

      actionsDiv.appendChild(btnEdit);
      actionsDiv.appendChild(btnDelete);
      actionsCell.appendChild(actionsDiv);
      row.appendChild(actionsCell);

      tbody.appendChild(row);
    });

    this.updateFooter();
  }

  updateFooter() {
    document.getElementById('snippets-count').textContent = `${this.filteredSnippets.length} snippets`;
    const maxPages = Math.ceil(this.filteredSnippets.length / this.itemsPerPage);
    document.getElementById('current-page').textContent = this.currentPage;
    document.getElementById('btn-prev').disabled = this.currentPage <= 1;
    document.getElementById('btn-next').disabled = this.currentPage >= maxPages;
  }

  async handleCopy(snippet) {
    const success = await ClipboardService.copy(snippet.content);
    if (success) {
      Toast.success(`Copied ${snippet.title}`);
      await this.snippetService.recordCopy(snippet.id);
    } else {
      Toast.error('Failed to copy');
    }
  }

  async handleToggleFavorite(id, favorite) {
    await this.snippetService.update(id, { favorite });
    const snippet = this.allSnippets.find((s) => s.id === id);
    if (snippet) snippet.favorite = favorite;
    this.renderTable();
  }

  handleEdit(snippet) {
    const modal = new Modal({
      title: 'Edit Snippet',
      initialData: snippet,
      onSave: async (data) => {
        try {
          await this.snippetService.update(snippet.id, data);
          Toast.success('Updated');
          const idx = this.allSnippets.findIndex((s) => s.id === snippet.id);
          if (idx >= 0) {
            this.allSnippets[idx] = { ...this.allSnippets[idx], ...data };
          }
          await this.applyFilters();
        } catch (err) {
          Toast.error('Failed to update');
          console.error(err);
        }
      },
    });
    modal.open();
  }

  async handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await this.snippetService.delete(id);
      this.allSnippets = this.allSnippets.filter((s) => s.id !== id);
      Toast.success('Deleted');
      await this.applyFilters();
    } catch (err) {
      Toast.error('Failed to delete');
      console.error(err);
    }
  }

  openCreateModal() {
    const modal = new Modal({
      title: 'Create Snippet',
      onSave: async (data) => {
        try {
          const created = await this.snippetService.create(data);
          this.allSnippets.push(created);
          Toast.success('Created');
          this.currentPage = 1;
          await this.applyFilters();
        } catch (err) {
          Toast.error('Failed to create');
          console.error(err);
        }
      },
    });
    modal.open();
  }

  showSettings() {
    Toast.success('Settings coming soon');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SnippyApp();
});
