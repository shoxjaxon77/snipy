import { COLORS, DEFAULT_CATEGORIES } from '../utils/constants.js';

export class Modal {
  constructor(options = {}) {
    this.title = options.title || 'Create Snippet';
    this.onSave = options.onSave || null;
    this.onCancel = options.onCancel || null;
    this.initialData = options.initialData || null;
    this.modal = null;
  }

  open() {
    this.createModal();
    this.attachEventListeners();
  }

  createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      animation: fadeIn 0.2s ease-out;
    `;

    this.modal = document.createElement('div');
    this.modal.style.cssText = `
      background-color: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 8px;
      padding: 24px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      animation: slideIn 0.3s ease-out;
    `;

    const titleEl = document.createElement('h2');
    titleEl.textContent = this.title;
    titleEl.style.cssText = `
      color: ${COLORS.textPrimary};
      font-size: 18px;
      margin: 0 0 20px 0;
      font-weight: 600;
    `;

    const form = document.createElement('form');
    form.id = 'snippet-form';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title';
    titleLabel.style.cssText = `
      display: block;
      color: ${COLORS.textSecondary};
      font-size: 12px;
      margin-bottom: 4px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    const titleInput = document.createElement('input');
    titleInput.id = 'snippet-title';
    titleInput.type = 'text';
    titleInput.placeholder = 'e.g., OpenAI API Key';
    titleInput.value = this.initialData?.title || '';
    titleInput.style.cssText = `
      width: 100%;
      padding: 10px 12px;
      background-color: ${COLORS.background};
      border: 1px solid ${COLORS.border};
      border-radius: 4px;
      color: ${COLORS.textPrimary};
      font-size: 14px;
      margin-bottom: 16px;
      box-sizing: border-box;
      transition: border-color 0.2s;
    `;
    titleInput.onchange = titleInput.onfocus = (e) => {
      e.target.style.borderColor = COLORS.primary;
    };
    titleInput.onblur = (e) => {
      e.target.style.borderColor = COLORS.border;
    };

    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Category';
    categoryLabel.style.cssText = `
      display: block;
      color: ${COLORS.textSecondary};
      font-size: 12px;
      margin-bottom: 4px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    const categorySelect = document.createElement('select');
    categorySelect.id = 'snippet-category';
    categorySelect.style.cssText = `
      width: 100%;
      padding: 10px 12px;
      background-color: ${COLORS.background};
      border: 1px solid ${COLORS.border};
      border-radius: 4px;
      color: ${COLORS.textPrimary};
      font-size: 14px;
      margin-bottom: 16px;
      box-sizing: border-box;
      transition: border-color 0.2s;
    `;
    categorySelect.onchange = categorySelect.onfocus = (e) => {
      e.target.style.borderColor = COLORS.primary;
    };
    categorySelect.onblur = (e) => {
      e.target.style.borderColor = COLORS.border;
    };

    DEFAULT_CATEGORIES.forEach((cat) => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      if (this.initialData?.category === cat) {
        option.selected = true;
      }
      categorySelect.appendChild(option);
    });

    const contentLabel = document.createElement('label');
    contentLabel.textContent = 'Content';
    contentLabel.style.cssText = `
      display: block;
      color: ${COLORS.textSecondary};
      font-size: 12px;
      margin-bottom: 4px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    const contentInput = document.createElement('textarea');
    contentInput.id = 'snippet-content';
    contentInput.placeholder = 'Your snippet content here...';
    contentInput.value = this.initialData?.content || '';
    contentInput.style.cssText = `
      width: 100%;
      padding: 10px 12px;
      background-color: ${COLORS.background};
      border: 1px solid ${COLORS.border};
      border-radius: 4px;
      color: ${COLORS.textPrimary};
      font-size: 14px;
      margin-bottom: 16px;
      min-height: 100px;
      resize: vertical;
      box-sizing: border-box;
      font-family: 'Monaco', 'Courier New', monospace;
      transition: border-color 0.2s;
    `;
    contentInput.onchange = contentInput.onfocus = (e) => {
      e.target.style.borderColor = COLORS.primary;
    };
    contentInput.onblur = (e) => {
      e.target.style.borderColor = COLORS.border;
    };

    const favoriteContainer = document.createElement('div');
    favoriteContainer.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    `;

    const favoriteCheckbox = document.createElement('input');
    favoriteCheckbox.id = 'snippet-favorite';
    favoriteCheckbox.type = 'checkbox';
    favoriteCheckbox.checked = this.initialData?.favorite || false;
    favoriteCheckbox.style.cssText = `
      margin-right: 8px;
      cursor: pointer;
      width: 16px;
      height: 16px;
    `;

    const favoriteLabel = document.createElement('label');
    favoriteLabel.htmlFor = 'snippet-favorite';
    favoriteLabel.textContent = 'Add to Favorites';
    favoriteLabel.style.cssText = `
      color: ${COLORS.textSecondary};
      font-size: 14px;
      cursor: pointer;
    `;

    favoriteContainer.appendChild(favoriteCheckbox);
    favoriteContainer.appendChild(favoriteLabel);

    const buttons = document.createElement('div');
    buttons.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.type = 'button';
    cancelBtn.style.cssText = `
      padding: 10px 16px;
      background-color: ${COLORS.background};
      border: 1px solid ${COLORS.border};
      color: ${COLORS.textPrimary};
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    `;
    cancelBtn.onmouseover = () => {
      cancelBtn.style.backgroundColor = COLORS.border;
    };
    cancelBtn.onmouseout = () => {
      cancelBtn.style.backgroundColor = COLORS.background;
    };
    cancelBtn.onclick = () => this.close();

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.type = 'submit';
    saveBtn.style.cssText = `
      padding: 10px 16px;
      background-color: ${COLORS.primary};
      border: 1px solid ${COLORS.primary};
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    `;
    saveBtn.onmouseover = () => {
      saveBtn.style.opacity = '0.9';
    };
    saveBtn.onmouseout = () => {
      saveBtn.style.opacity = '1';
    };

    buttons.appendChild(cancelBtn);
    buttons.appendChild(saveBtn);

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(categoryLabel);
    form.appendChild(categorySelect);
    form.appendChild(contentLabel);
    form.appendChild(contentInput);
    form.appendChild(favoriteContainer);
    form.appendChild(buttons);

    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {
        title: titleInput.value,
        category: categorySelect.value,
        content: contentInput.value,
        favorite: favoriteCheckbox.checked,
      };
      if (this.onSave) this.onSave(data);
      this.close();
    };

    this.modal.appendChild(titleEl);
    this.modal.appendChild(form);
    overlay.appendChild(this.modal);
    document.body.appendChild(overlay);
  }

  attachEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  close() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.style.animation = 'fadeOut 0.2s ease-out';
      setTimeout(() => {
        overlay.remove();
        if (this.onCancel) this.onCancel();
      }, 200);
    }
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
