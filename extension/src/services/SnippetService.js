import { LocalStorageProvider } from '../providers/LocalStorageProvider.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export class SnippetService {
  constructor(storageProvider = null) {
    this.storage = storageProvider || new LocalStorageProvider();
  }

  async create(snippet) {
    if (!snippet.title || !snippet.content) {
      throw new Error('Title and content are required');
    }

    return this.storage.create({
      title: snippet.title.trim(),
      category: snippet.category?.trim() || 'Other',
      content: snippet.content,
      favorite: snippet.favorite || false,
    });
  }

  async getAll() {
    return this.storage.readAll();
  }

  async getById(id) {
    return this.storage.read(id);
  }

  async update(id, changes) {
    if (changes.title !== undefined && !changes.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    const updates = {};
    if (changes.title !== undefined) updates.title = changes.title.trim();
    if (changes.category !== undefined) updates.category = changes.category.trim() || 'Other';
    if (changes.content !== undefined) updates.content = changes.content;
    if (changes.favorite !== undefined) updates.favorite = changes.favorite;

    return this.storage.update(id, updates);
  }

  async delete(id) {
    return this.storage.delete(id);
  }

  async search(query) {
    return this.storage.search(query);
  }

  async getFavorites() {
    const all = await this.storage.readAll();
    return all.filter((s) => s.favorite);
  }

  async getRecent() {
    const data = await browser.storage.local.get(STORAGE_KEYS.recentlyCopied);
    const recentIds = data[STORAGE_KEYS.recentlyCopied] || [];
    const all = await this.storage.readAll();

    return recentIds
      .map((id) => all.find((s) => s.id === id))
      .filter(Boolean)
      .slice(0, 10);
  }

  async recordCopy(id) {
    const data = await browser.storage.local.get(STORAGE_KEYS.recentlyCopied);
    let recent = data[STORAGE_KEYS.recentlyCopied] || [];

    recent = recent.filter((rid) => rid !== id);
    recent.unshift(id);
    recent = recent.slice(0, 50);

    await browser.storage.local.set({ [STORAGE_KEYS.recentlyCopied]: recent });
  }

  async exportJSON() {
    const snippets = await this.storage.readAll();
    return JSON.stringify(snippets, null, 2);
  }

  async importJSON(jsonString) {
    try {
      const snippets = JSON.parse(jsonString);

      if (!Array.isArray(snippets)) {
        throw new Error('Invalid format: expected an array');
      }

      if (snippets.length === 0) {
        return [];
      }

      const imported = [];
      for (const snippet of snippets) {
        if (snippet.title && snippet.content) {
          try {
            const created = await this.create({
              title: snippet.title,
              category: snippet.category || 'Imported',
              content: snippet.content,
              favorite: snippet.favorite || false,
            });
            imported.push(created);
          } catch (err) {
            console.error('Failed to import snippet:', err);
          }
        }
      }

      return imported;
    } catch (err) {
      throw new Error(`Failed to import: ${err.message}`);
    }
  }

  async clear() {
    await browser.storage.local.set({ [STORAGE_KEYS.snippets]: [] });
  }
}
