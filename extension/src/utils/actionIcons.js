/**
 * Professional action icons (Lucide-inspired stroke design)
 * All icons use stroke-based design for consistency and theming
 */

export const ACTION_ICONS = {
  edit: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    </svg>
  `,

  delete: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  `,
};

/**
 * Create an action icon element
 * @param {string} iconName - Name from ACTION_ICONS
 * @param {string} title - Tooltip text
 * @returns {HTMLElement}
 */
export function createActionIcon(iconName, title = '') {
  const wrapper = document.createElement('span');
  wrapper.className = 'action-icon';
  wrapper.innerHTML = ACTION_ICONS[iconName] || ACTION_ICONS.edit;
  wrapper.title = title;

  const svg = wrapper.querySelector('svg');
  if (svg) {
    svg.style.display = 'block';
    svg.style.color = 'inherit';
  }

  return wrapper;
}
