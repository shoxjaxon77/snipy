import { COLORS, SEARCH_DEBOUNCE_TIME } from '../utils/constants.js';
import { debounce } from '../utils/helpers.js';

export class SearchBar {
  constructor(options = {}) {
    this.onSearch = options.onSearch || null;
    this.onFilterChange = options.onFilterChange || null;
    this.categories = options.categories || [];
    this.element = null;
  }

  render() {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    `;

    const searchRow = document.createElement('div');
    searchRow.style.cssText = `
      display: flex;
      gap: 8px;
      align-items: center;
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search snippets...';
    searchInput.style.cssText = `
      flex: 1;
      padding: 10px 12px;
      background-color: ${COLORS.background};
      border: 1px solid ${COLORS.border};
      border-radius: 4px;
      color: ${COLORS.textPrimary};
      font-size: 14px;
      transition: border-color 0.2s;
    `;
    searchInput.onfocus = () => {
      searchInput.style.borderColor = COLORS.primary;
    };
    searchInput.onblur = () => {
      searchInput.style.borderColor = COLORS.border;
    };

    const debouncedSearch = debounce(() => {
      if (this.onSearch) {
        this.onSearch(searchInput.value);
      }
    }, SEARCH_DEBOUNCE_TIME);

    searchInput.oninput = () => {
      debouncedSearch();
    };

    searchRow.appendChild(searchInput);

    const filterRow = document.createElement('div');
    filterRow.style.cssText = `
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    `;

    const filters = [
      { label: 'All', value: 'all' },
      { label: 'Favorites', value: 'favorites' },
      { label: 'Recent', value: 'recent' },
    ];

    let activeFilter = 'all';
    filters.forEach(({ label, value }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.dataset.filter = value;
      btn.style.cssText = `
        padding: 6px 12px;
        background-color: ${value === 'all' ? COLORS.primary : COLORS.background};
        border: 1px solid ${value === 'all' ? COLORS.primary : COLORS.border};
        color: ${value === 'all' ? 'white' : COLORS.textSecondary};
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s;
      `;

      btn.onclick = () => {
        filters.forEach(({ value: v }) => {
          const filterBtn = filterRow.querySelector(`[data-filter="${v}"]`);
          if (filterBtn) {
            const isActive = v === value;
            filterBtn.style.backgroundColor = isActive ? COLORS.primary : COLORS.background;
            filterBtn.style.borderColor = isActive ? COLORS.primary : COLORS.border;
            filterBtn.style.color = isActive ? 'white' : COLORS.textSecondary;
          }
        });

        activeFilter = value;
        if (this.onFilterChange) {
          this.onFilterChange({
            query: searchInput.value,
            filter: value,
            category: categorySelect.value,
          });
        }
      };

      filterRow.appendChild(btn);
    });

    const categorySelect = document.createElement('select');
    categorySelect.style.cssText = `
      padding: 6px 8px;
      background-color: ${COLORS.background};
      border: 1px solid ${COLORS.border};
      border-radius: 4px;
      color: ${COLORS.textSecondary};
      font-size: 12px;
      cursor: pointer;
      transition: border-color 0.2s;
    `;

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Categories';
    categorySelect.appendChild(allOption);

    this.categories.forEach((cat) => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });

    categorySelect.onchange = () => {
      if (this.onFilterChange) {
        this.onFilterChange({
          query: searchInput.value,
          filter: activeFilter,
          category: categorySelect.value,
        });
      }
    };

    filterRow.appendChild(categorySelect);

    container.appendChild(searchRow);
    container.appendChild(filterRow);

    this.element = container;
    return container;
  }
}
