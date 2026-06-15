import { DEFAULT_CATEGORIES } from '../utils/constants.js';

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
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      animation: fadeIn 0.2s ease-out;
      backdrop-filter: blur(4px);
    `;

    this.modal = document.createElement('div');
    this.modal.style.cssText = `
      background: linear-gradient(135deg, #1a1f2e 0%, #161b28 100%);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 10px;
      padding: 20px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      animation: slideIn 0.3s ease-out;
    `;

    const titleEl = document.createElement('h2');
    titleEl.textContent = this.title;
    titleEl.style.cssText = `
      color: #e5e7eb;
      font-size: 15px;
      margin: 0 0 16px 0;
      font-weight: 600;
      letter-spacing: -0.2px;
    `;

    const form = document.createElement('form');
    form.id = 'snippet-form';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Name';
    titleLabel.style.cssText = `
      display: block;
      color: #9ca3af;
      font-size: 11px;
      margin-bottom: 5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    const titleInput = document.createElement('input');
    titleInput.id = 'snippet-title';
    titleInput.type = 'text';
    titleInput.placeholder = 'e.g., GitHub Token';
    titleInput.value = this.initialData?.title || '';
    titleInput.style.cssText = `
      width: 100%;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 5px;
      color: #e5e7eb;
      font-size: 13px;
      margin-bottom: 12px;
      box-sizing: border-box;
      transition: all 0.2s;
      font-family: inherit;
    `;
    titleInput.onfocus = (e) => {
      e.target.style.borderColor = '#6366f1';
      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
    };
    titleInput.onblur = (e) => {
      e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
    };

    const contentLabel = document.createElement('label');
    contentLabel.textContent = 'Content';
    contentLabel.style.cssText = `
      display: block;
      color: #9ca3af;
      font-size: 11px;
      margin-bottom: 5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    const contentInput = document.createElement('textarea');
    contentInput.id = 'snippet-content';
    contentInput.placeholder = 'Your snippet content...';
    contentInput.value = this.initialData?.content || '';
    contentInput.style.cssText = `
      width: 100%;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 5px;
      color: #e5e7eb;
      font-size: 13px;
      margin-bottom: 12px;
      min-height: 80px;
      resize: vertical;
      box-sizing: border-box;
      font-family: 'Monaco', 'Courier New', monospace;
      transition: all 0.2s;
    `;
    contentInput.onfocus = (e) => {
      e.target.style.borderColor = '#6366f1';
      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
    };
    contentInput.onblur = (e) => {
      e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
    };


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
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(99, 102, 241, 0.2);
      color: #e5e7eb;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s;
      font-family: inherit;
    `;
    cancelBtn.onmouseover = () => {
      cancelBtn.style.background = 'rgba(99, 102, 241, 0.1)';
    };
    cancelBtn.onmouseout = () => {
      cancelBtn.style.background = 'rgba(255, 255, 255, 0.05)';
    };
    cancelBtn.onclick = () => this.close();

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.type = 'submit';
    saveBtn.style.cssText = `
      padding: 8px 14px;
      background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
      border: 1px solid #6366f1;
      color: white;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s;
      font-family: inherit;
    `;
    saveBtn.onmouseover = () => {
      saveBtn.style.opacity = '0.9';
      saveBtn.style.transform = 'translateY(-1px)';
    };
    saveBtn.onmouseout = () => {
      saveBtn.style.opacity = '1';
      saveBtn.style.transform = 'translateY(0)';
    };

    buttons.appendChild(cancelBtn);
    buttons.appendChild(saveBtn);

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(contentLabel);
    form.appendChild(contentInput);
    form.appendChild(buttons);

    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {
        title: titleInput.value,
        category: 'Snippet',
        content: contentInput.value,
        favorite: false,
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

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
