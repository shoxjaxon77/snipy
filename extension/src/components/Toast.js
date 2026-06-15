import { TOAST_DURATION, COLORS } from '../utils/constants.js';

export class Toast {
  static #container = null;
  static #queue = [];

  static #getContainer() {
    if (!this.#container) {
      this.#container = document.createElement('div');
      this.#container.id = 'toast-container';
      this.#container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 8px;
      `;
      document.body.appendChild(this.#container);
    }
    return this.#container;
  }

  static show(message, duration = TOAST_DURATION) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      background-color: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      color: ${COLORS.textPrimary};
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease-out;
      max-width: 300px;
      word-break: break-word;
    `;
    toast.textContent = message;

    const container = this.#getContainer();
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  static success(message) {
    this.show(`✓ ${message}`);
  }

  static error(message) {
    this.show(`✗ ${message}`);
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
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
