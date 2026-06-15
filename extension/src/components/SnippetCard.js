import { COLORS } from '../utils/constants.js';
import { truncateString } from '../utils/helpers.js';

export class SnippetCard {
  constructor(snippet, options = {}) {
    this.snippet = snippet;
    this.onCopy = options.onCopy || null;
    this.onToggleFavorite = options.onToggleFavorite || null;
    this.onEdit = options.onEdit || null;
    this.onDelete = options.onDelete || null;
    this.element = null;
  }

  render() {
    const card = document.createElement('button');
    card.className = 'snippet-card';
    card.style.cssText = `
      background-color: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 6px;
      padding: 16px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      width: 100%;
      position: relative;
      min-height: 100px;
      display: flex;
      flex-direction: column;
    `;

    card.onmouseover = () => {
      card.style.backgroundColor = COLORS.hover;
      card.style.borderColor = COLORS.primary;
      card.style.transform = 'scale(1.02)';
      card.style.boxShadow = `0 4px 12px rgba(99, 102, 241, 0.1)`;
    };

    card.onmouseout = () => {
      card.style.backgroundColor = COLORS.surface;
      card.style.borderColor = COLORS.border;
      card.style.transform = 'scale(1)';
      card.style.boxShadow = 'none';
    };

    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 8px;
    `;

    const titleAndCategory = document.createElement('div');
    titleAndCategory.style.cssText = `
      flex: 1;
      min-width: 0;
    `;

    const title = document.createElement('div');
    title.textContent = this.snippet.title;
    title.style.cssText = `
      color: ${COLORS.textPrimary};
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      word-break: break-word;
    `;

    const category = document.createElement('div');
    category.textContent = this.snippet.category;
    category.style.cssText = `
      color: ${COLORS.textSecondary};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.7;
    `;

    titleAndCategory.appendChild(title);
    titleAndCategory.appendChild(category);

    const actions = document.createElement('div');
    actions.style.cssText = `
      display: flex;
      gap: 4px;
      margin-left: 8px;
    `;

    const favoriteBtn = document.createElement('button');
    favoriteBtn.innerHTML = this.snippet.favorite ? '★' : '☆';
    favoriteBtn.style.cssText = `
      background: none;
      border: none;
      color: ${this.snippet.favorite ? '#FBBF24' : COLORS.textSecondary};
      cursor: pointer;
      font-size: 16px;
      padding: 4px 8px;
      transition: all 0.2s;
      flex-shrink: 0;
    `;
    favoriteBtn.title = this.snippet.favorite ? 'Remove from favorites' : 'Add to favorites';
    favoriteBtn.onclick = (e) => {
      e.stopPropagation();
      this.snippet.favorite = !this.snippet.favorite;
      favoriteBtn.innerHTML = this.snippet.favorite ? '★' : '☆';
      favoriteBtn.style.color = this.snippet.favorite ? '#FBBF24' : COLORS.textSecondary;
      if (this.onToggleFavorite) this.onToggleFavorite(this.snippet.id, this.snippet.favorite);
    };

    const menuBtn = document.createElement('button');
    menuBtn.textContent = '⋯';
    menuBtn.style.cssText = `
      background: none;
      border: none;
      color: ${COLORS.textSecondary};
      cursor: pointer;
      font-size: 16px;
      padding: 4px 8px;
      transition: all 0.2s;
      flex-shrink: 0;
    `;
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      this.showContextMenu(menuBtn);
    };

    actions.appendChild(favoriteBtn);
    actions.appendChild(menuBtn);

    header.appendChild(titleAndCategory);
    header.appendChild(actions);

    const content = document.createElement('div');
    content.textContent = truncateString(this.snippet.content, 80);
    content.style.cssText = `
      color: ${COLORS.textSecondary};
      font-size: 13px;
      line-height: 1.4;
      flex: 1;
      font-family: 'Monaco', 'Courier New', monospace;
      word-break: break-all;
      opacity: 0.8;
    `;

    const footer = document.createElement('div');
    footer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 8px;
      border-top: 1px solid ${COLORS.border};
      font-size: 11px;
      color: ${COLORS.textSecondary};
    `;

    const date = new Date(this.snippet.createdAt);
    const dateStr = date.toLocaleDateString();
    footer.textContent = `Created ${dateStr}`;

    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(footer);

    card.onclick = () => {
      if (this.onCopy) this.onCopy(this.snippet);
    };

    this.element = card;
    return card;
  }

  showContextMenu(trigger) {
    const existing = document.getElementById('context-menu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.style.cssText = `
      position: fixed;
      background-color: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 4px;
      z-index: 5001;
      min-width: 120px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.2s ease-out;
    `;

    const rect = trigger.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${rect.left}px`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      background: none;
      border: none;
      color: ${COLORS.textPrimary};
      cursor: pointer;
      text-align: left;
      font-size: 13px;
      transition: background-color 0.2s;
    `;
    editBtn.onmouseover = () => {
      editBtn.style.backgroundColor = COLORS.hover;
    };
    editBtn.onmouseout = () => {
      editBtn.style.backgroundColor = 'transparent';
    };
    editBtn.onclick = () => {
      menu.remove();
      if (this.onEdit) this.onEdit(this.snippet);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      background: none;
      border: none;
      color: '#EF4444';
      cursor: pointer;
      text-align: left;
      font-size: 13px;
      transition: background-color 0.2s;
      border-top: 1px solid ${COLORS.border};
    `;
    deleteBtn.onmouseover = () => {
      deleteBtn.style.backgroundColor = COLORS.hover;
    };
    deleteBtn.onmouseout = () => {
      deleteBtn.style.backgroundColor = 'transparent';
    };
    deleteBtn.onclick = () => {
      menu.remove();
      if (confirm(`Delete "${this.snippet.title}"?`)) {
        if (this.onDelete) this.onDelete(this.snippet.id);
      }
    };

    menu.appendChild(editBtn);
    menu.appendChild(deleteBtn);
    document.body.appendChild(menu);

    document.addEventListener('click', () => {
      if (document.contains(menu)) menu.remove();
    }, { once: true });
  }
}
