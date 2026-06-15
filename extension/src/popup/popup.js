import { SnippetService } from '../services/SnippetService.js';
import { SearchService } from '../services/SearchService.js';
import { ClipboardService } from '../services/ClipboardService.js';
import { SnippetCard } from '../components/SnippetCard.js';
import { SearchBar } from '../components/SearchBar.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';

class SnippyApp {
  constructor() {
    this.snippetService = new SnippetService();
    this.searchService = new SearchService(this.snippetService);
    this.searchBar = null;
    this.currentFilter = {
      query: '',
      filter: 'all',
      category: '',
    };
    this.currentSnippets = [];
    this.init();
  }

  async init() {
    this.attachEventListeners();
    await this.loadAndRender();
  }

  attachEventListeners() {
    document.getElementById('btn-new').onclick = () => this.openCreateModal();
    document.getElementById('btn-export').onclick = () => this.exportSnippets();
    document.getElementById('btn-import').onclick = () => this.importSnippets();
  }

  async loadAndRender() {
    const allSnippets = await this.snippetService.getAll();
    const categories = this.searchService.getCategories(allSnippets);

    if (!this.searchBar) {
      const searchBarContainer = document.getElementById('search-bar');
      this.searchBar = new SearchBar({
        categories,
        onSearch: (query) => this.handleSearch(query),
        onFilterChange: (filter) => this.handleFilterChange(filter),
      });
      searchBarContainer.appendChild(this.searchBar.render());
    }

    await this.applyFilters();
  }

  async handleSearch(query) {
    this.currentFilter.query = query;
    await this.applyFilters();
  }

  async handleFilterChange(filter) {
    this.currentFilter = filter;
    await this.applyFilters();
  }

  async applyFilters() {
    const { query, filter, category } = this.currentFilter;

    let results;
    if (filter === 'favorites') {
      const favorites = await this.snippetService.getFavorites();
      const categories = this.searchService.getCategories(favorites);
      this.searchService = new SearchService(this.snippetService);
      results = await this.searchService.search(query, {
        favorites: true,
        category: category || null,
      });
    } else if (filter === 'recent') {
      results = await this.snippetService.getRecent();
      if (query) {
        results = results.filter((s) => {
          const lowerQuery = query.toLowerCase();
          return (
            s.title.toLowerCase().includes(lowerQuery) ||
            s.category.toLowerCase().includes(lowerQuery) ||
            s.content.toLowerCase().includes(lowerQuery)
          );
        });
      }
    } else {
      results = await this.searchService.search(query, {
        category: category || null,
      });
    }

    this.currentSnippets = results;
    this.renderSnippets(results);
  }

  renderSnippets(snippets) {
    const container = document.getElementById('snippets-container');
    const emptyState = document.getElementById('empty-state');

    container.innerHTML = '';

    if (snippets.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';

    snippets.forEach((snippet) => {
      const card = new SnippetCard(snippet, {
        onCopy: (snippet) => this.handleCopy(snippet),
        onToggleFavorite: (id, favorite) => this.handleToggleFavorite(id, favorite),
        onEdit: (snippet) => this.handleEdit(snippet),
        onDelete: (id) => this.handleDelete(id),
      });
      container.appendChild(card.render());
    });
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
  }

  handleEdit(snippet) {
    const modal = new Modal({
      title: 'Edit Snippet',
      initialData: snippet,
      onSave: async (data) => {
        try {
          await this.snippetService.update(snippet.id, data);
          Toast.success('Snippet updated');
          await this.loadAndRender();
        } catch (err) {
          Toast.error('Failed to update snippet');
          console.error(err);
        }
      },
    });
    modal.open();
  }

  async handleDelete(id) {
    try {
      await this.snippetService.delete(id);
      Toast.success('Snippet deleted');
      await this.applyFilters();
    } catch (err) {
      Toast.error('Failed to delete snippet');
      console.error(err);
    }
  }

  openCreateModal() {
    const modal = new Modal({
      title: 'Create Snippet',
      onSave: async (data) => {
        try {
          await this.snippetService.create(data);
          Toast.success('Snippet created');
          await this.loadAndRender();
        } catch (err) {
          Toast.error('Failed to create snippet');
          console.error(err);
        }
      },
    });
    modal.open();
  }

  async exportSnippets() {
    try {
      const json = await this.snippetService.exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snipy-export-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      Toast.success('Snippets exported');
    } catch (err) {
      Toast.error('Export failed');
      console.error(err);
    }
  }

  importSnippets() {
    const fileInput = document.getElementById('file-input');
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = await this.snippetService.importJSON(text);
        Toast.success(`Imported ${imported.length} snippets`);
        await this.loadAndRender();
      } catch (err) {
        Toast.error(`Import failed: ${err.message}`);
        console.error(err);
      }

      fileInput.value = '';
    };
    fileInput.click();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SnippyApp();
});
