import { fuzzySearch } from '../utils/helpers.js';

export class SearchService {
  constructor(snippetService) {
    this.snippetService = snippetService;
  }

  async search(query, options = {}) {
    const { favorites = false, category = null, sortBy = 'createdAt' } = options;

    let results = await this.snippetService.search(query);

    if (favorites) {
      results = results.filter((s) => s.favorite);
    }

    if (category && category !== 'All') {
      results = results.filter((s) => s.category === category);
    }

    return this.sort(results, sortBy);
  }

  sort(snippets, sortBy) {
    const copy = [...snippets];

    switch (sortBy) {
      case 'title':
        copy.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'category':
        copy.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'updatedAt':
        copy.sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case 'createdAt':
      default:
        copy.sort((a, b) => b.createdAt - a.createdAt);
    }

    return copy;
  }

  getCategories(snippets) {
    const categories = new Set(snippets.map((s) => s.category));
    return Array.from(categories).sort();
  }
}
