import { StorageProvider } from './StorageProvider.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { generateId, fuzzySearch } from '../utils/helpers.js';

export class LocalStorageProvider extends StorageProvider {
  async create(snippet) {
    const id = generateId();
    const now = Date.now();
    const newSnippet = {
      ...snippet,
      id,
      favorite: snippet.favorite || false,
      createdAt: now,
      updatedAt: now,
    };

    const allSnippets = await this.readAll();
    allSnippets.push(newSnippet);
    await browser.storage.local.set({ [STORAGE_KEYS.snippets]: allSnippets });

    return newSnippet;
  }

  async read(id) {
    const allSnippets = await this.readAll();
    return allSnippets.find((s) => s.id === id) || null;
  }

  async readAll() {
    const data = await browser.storage.local.get(STORAGE_KEYS.snippets);
    return data[STORAGE_KEYS.snippets] || [];
  }

  async update(id, changes) {
    const allSnippets = await this.readAll();
    const index = allSnippets.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Snippet with id ${id} not found`);
    }

    const updated = {
      ...allSnippets[index],
      ...changes,
      id,
      createdAt: allSnippets[index].createdAt,
      updatedAt: Date.now(),
    };

    allSnippets[index] = updated;
    await browser.storage.local.set({ [STORAGE_KEYS.snippets]: allSnippets });

    return updated;
  }

  async delete(id) {
    const allSnippets = await this.readAll();
    const filtered = allSnippets.filter((s) => s.id !== id);
    await browser.storage.local.set({ [STORAGE_KEYS.snippets]: filtered });
  }

  async search(query) {
    const allSnippets = await this.readAll();

    if (!query.trim()) {
      return allSnippets;
    }

    return allSnippets.filter((snippet) => {
      return (
        fuzzySearch(query, snippet.title) ||
        fuzzySearch(query, snippet.category) ||
        fuzzySearch(query, snippet.content)
      );
    });
  }
}
