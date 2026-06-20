import { SnippetService } from '../services/SnippetService.js';
import { SearchService } from '../services/SearchService.js';
import { ClipboardService } from '../services/ClipboardService.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';
import { getSnippetIcon, renderIcon } from '../utils/icons.js';
import { createActionIcon } from '../utils/actionIcons.js';

class SnippyApp {
  constructor() {
    this.snippetService = new SnippetService();
    this.allSnippets = [];
    this.filteredSnippets = [];
    this.currentQuery = '';
    this.init();
  }

  async init() {
    this.attachEventListeners();
    await this.loadAndRender();
  }

  attachEventListeners() {
    document.getElementById('btn-new').onclick = () => this.openCreateModal();
    document.getElementById('search-input').oninput = (e) => {
      this.currentQuery = e.target.value;
      this.applyFilters();
    };
  }

  async loadAndRender() {
    this.allSnippets = await this.snippetService.getAll();
    await this.applyFilters();
  }

  async applyFilters() {
    let results = this.allSnippets;

    if (this.currentQuery.trim()) {
      const query = this.currentQuery.toLowerCase();
      results = results.filter((s) => {
        return (
          s.title.toLowerCase().includes(query) ||
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
      return;
    }

    document.getElementById('empty-state').style.display = 'none';

    this.filteredSnippets.forEach((snippet) => {
      const row = document.createElement('tr');

      row.onclick = (e) => {
        if (e.target.closest('.btn-action')) return;
        this.handleCopy(snippet);
      };

      // Name column
      const nameCell = document.createElement('td');
      nameCell.className = 'col-name';
      nameCell.textContent = snippet.title;
      row.appendChild(nameCell);

      // Content column
      const contentCell = document.createElement('td');
      contentCell.className = 'col-content';
      const contentDiv = document.createElement('div');
      contentDiv.className = 'content-preview';
      contentDiv.textContent = snippet.content;
      contentDiv.title = snippet.content;
      contentCell.appendChild(contentDiv);
      row.appendChild(contentCell);

      // Actions column
      const actionsCell = document.createElement('td');
      actionsCell.className = 'col-actions';
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions-cell';

      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn-action btn-action-edit';
      btnEdit.appendChild(createActionIcon('edit', 'Edit snippet'));
      btnEdit.onclick = (e) => {
        e.stopPropagation();
        this.handleEdit(snippet);
      };

      const btnDelete = document.createElement('button');
      btnDelete.className = 'btn-action btn-action-delete';
      btnDelete.appendChild(createActionIcon('delete', 'Delete snippet'));
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

    document.getElementById('snippets-count').textContent = `${this.filteredSnippets.length} snippets`;
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
          await this.applyFilters();
        } catch (err) {
          Toast.error('Failed to create');
          console.error(err);
        }
      },
    });
    modal.open();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SnippyApp();
});
