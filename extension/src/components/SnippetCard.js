import { COLORS } from "../utils/constants.js";
import { getSnippetIcon, renderIcon } from "../utils/icons.js";

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
    const row = document.createElement("button");
    row.className = "snippet-row";

    const content = document.createElement("div");
    content.className = "snippet-content";

    // Get icon
    const iconName = getSnippetIcon(this.snippet.title, this.snippet.category);
    const iconEl = renderIcon(iconName, 24);
    iconEl.style.cssText = `
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 6px;
      color: #6366f1;
    `;

    // Title
    const title = document.createElement("div");
    title.className = "snippet-title";
    title.textContent = this.snippet.title;
    title.title = this.snippet.title;

    // Category
    const category = document.createElement("div");
    category.className = "snippet-category";
    category.textContent = this.snippet.category;

    // Title + Category wrapper
    const titleAndCategory = document.createElement("div");
    titleAndCategory.style.cssText = `
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    `;
    titleAndCategory.appendChild(title);
    titleAndCategory.appendChild(category);

    // Header (icon + title + category)
    const header = document.createElement("div");
    header.className = "snippet-header";
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    `;
    header.appendChild(iconEl);
    header.appendChild(titleAndCategory);

    // Favorite button
    const favorite = document.createElement("button");
    favorite.className = "snippet-favorite";
    if (this.snippet.favorite) favorite.classList.add("active");
    favorite.innerHTML = this.snippet.favorite ? "★" : "☆";
    favorite.title = this.snippet.favorite
      ? "Remove from favorites"
      : "Add to favorites";

    favorite.onclick = (e) => {
      e.stopPropagation();
      this.snippet.favorite = !this.snippet.favorite;
      favorite.innerHTML = this.snippet.favorite ? "★" : "☆";
      favorite.classList.toggle("active");
      if (this.onToggleFavorite)
        this.onToggleFavorite(this.snippet.id, this.snippet.favorite);
    };

    content.appendChild(header);
    content.appendChild(favorite);

    // Preview
    const preview = document.createElement("div");
    preview.className = "snippet-preview";
    const previewText =
      this.snippet.content.length > 60
        ? this.snippet.content.substring(0, 60) + "..."
        : this.snippet.content;
    preview.textContent = previewText;
    preview.title = this.snippet.content;

    row.appendChild(content);
    row.appendChild(preview);

    row.onclick = () => {
      if (this.onCopy) this.onCopy(this.snippet);
    };

    row.oncontextmenu = (e) => {
      e.preventDefault();
      this.showContextMenu(e.pageX, e.pageY);
    };

    this.element = row;
    return row;
  }

  showContextMenu(x, y) {
    const existing = document.getElementById("context-menu");
    if (existing) existing.remove();

    const menu = document.createElement("div");
    menu.id = "context-menu";
    menu.style.cssText = `
      position: fixed;
      background: rgba(17, 24, 39, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 6px;
      z-index: 5001;
      min-width: 100px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      top: ${y}px;
      left: ${x}px;
      animation: slideIn 0.15s ease-out;
    `;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      background: none;
      border: none;
      color: #e5e7eb;
      cursor: pointer;
      text-align: left;
      font-size: 12px;
      transition: background 0.15s;
      font-family: inherit;
      border-bottom: 1px solid rgba(99, 102, 241, 0.1);
    `;
    editBtn.onmouseover = () => {
      editBtn.style.backgroundColor = "rgba(99, 102, 241, 0.1)";
    };
    editBtn.onmouseout = () => {
      editBtn.style.backgroundColor = "transparent";
    };
    editBtn.onclick = () => {
      menu.remove();
      if (this.onEdit) this.onEdit(this.snippet);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      text-align: left;
      font-size: 12px;
      transition: background 0.15s;
      font-family: inherit;
    `;
    deleteBtn.onmouseover = () => {
      deleteBtn.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
    };
    deleteBtn.onmouseout = () => {
      deleteBtn.style.backgroundColor = "transparent";
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

    setTimeout(() => {
      document.addEventListener(
        "click",
        () => {
          if (document.contains(menu)) menu.remove();
        },
        { once: true },
      );
    }, 0);
  }
}
