export class StorageProvider {
  async create(snippet) {
    throw new Error('create() must be implemented');
  }

  async read(id) {
    throw new Error('read() must be implemented');
  }

  async readAll() {
    throw new Error('readAll() must be implemented');
  }

  async update(id, changes) {
    throw new Error('update() must be implemented');
  }

  async delete(id) {
    throw new Error('delete() must be implemented');
  }

  async search(query) {
    throw new Error('search() must be implemented');
  }
}
