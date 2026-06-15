import { SEARCH_DEBOUNCE_TIME } from '../utils/constants.js';
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
      gap: 8px;
    `;

    // Search input
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-input-wrapper';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search snippets...';

    const debouncedSearch = debounce(() => {
      if (this.onSearch) {
        this.onSearch(searchInput.value);
      }
    }, SEARCH_DEBOUNCE_TIME);

    searchInput.oninput = () => {
      debouncedSearch();
    };

    searchWrapper.appendChild(searchInput);

    // Filters
    const filtersRow = document.createElement('div');
    filtersRow.style.cssText = `
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    `;

    const filters = [
      { label: 'All', value: 'all' },
      { label: 'Favorites', value: 'favorites' },
      { label: 'Recent', value: 'recent' },
    ];

    let activeFilter = 'all';

    const filterButtons = [];
    filters.forEach(({ label, value }) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      if (value === 'all') btn.classList.add('active');
      btn.textContent = label;
      btn.dataset.filter = value;

      btn.onclick = () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        activeFilter = value;

        if (this.onFilterChange) {
          this.onFilterChange({
            query: searchInput.value,
            filter: value,
            category: categorySelect.value,
          });
        }
      };

      filterButtons.push(btn);
      filtersRow.appendChild(btn);
    });

    // Category select
    const categorySelect = document.createElement('select');
    categorySelect.className = 'category-select';

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

    filtersRow.appendChild(categorySelect);

    container.appendChild(searchWrapper);
    container.appendChild(filtersRow);

    this.element = container;
    return container;
  }
}
