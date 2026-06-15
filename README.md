# Snipy

⚡ Lightning-fast Firefox Extension for managing code snippets. **One Click = Copy.**

Instantly copy API keys, tokens, passwords, SSH commands, database URLs, environment variables, and code snippets.

## Features

- 🚀 **Lightning Fast** - 5000+ snippets with instant search
- 📋 **One-Click Copy** - Entire card clickable
- 💾 **Offline First** - All data stored locally (browser.storage)
- 🔍 **Fuzzy Search** - Search by title, category, or content
- ⭐ **Favorites** - Mark and filter snippets
- ⏰ **Recent** - Quick access to recently copied
- 📤 **Import/Export** - Backup as JSON
- 🎨 **Modern UI** - Dark theme, minimalist design

## Quick Start

1. Open: `about:debugging#/runtime/this-firefox`
2. Click: "Load Temporary Add-on"
3. Select: `extension/manifest.json`

Then:
- Click "+" to create snippet
- Fill title, category, content
- Click card to copy instantly

## Tech Stack

- Firefox Extension (Manifest V3)
- Vanilla JavaScript (ES modules)
- browser.storage.local
- Zero dependencies, zero build tools

## Architecture

**Storage Layer** (Provider Pattern - future-proof for cloud sync)
```
StorageProvider (interface)
├── LocalStorageProvider (current)
└── ApiStorageProvider (future - zero UI changes)
```

**Services**
- `SnippetService` - CRUD + import/export
- `SearchService` - Fuzzy search + filtering
- `ClipboardService` - Copy to clipboard

**Components**
- `SnippetCard` - One-click copy interface
- `SearchBar` - Search + filters + categories
- `Modal` - Create/edit form
- `Toast` - Notifications

## File Structure

```
extension/
├── manifest.json
├── src/
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js (app logic)
│   │   └── popup.css (styling)
│   ├── background/
│   │   └── background.js
│   ├── components/ (SnippetCard, Modal, SearchBar, Toast)
│   ├── services/ (SnippetService, SearchService, ClipboardService)
│   ├── providers/ (StorageProvider, LocalStorageProvider)
│   ├── utils/ (constants, helpers)
│   └── assets/icons/ (16x, 48x, 128x SVG)
```

## Snippet Model

```javascript
{
  id: "1718448000000-abc123",
  title: "OpenAI API Key",
  category: "API Keys",
  content: "sk-proj-...",
  favorite: false,
  createdAt: 1718448000000,
  updatedAt: 1718448000000
}
```

## Features

- ✅ Create/Read/Update/Delete snippets
- ✅ Fuzzy search
- ✅ Favorites + Recently copied
- ✅ Category filtering
- ✅ Import/Export JSON
- ✅ Toast notifications
- ✅ Dark theme
- ✅ Supports 5000+ snippets

## Performance

- Startup: < 200ms
- Search (5000 snippets): < 200ms
- Copy: < 10ms
- Memory: < 50MB

## Security

- Data stored locally only (browser.storage.local)
- No network communication
- No external dependencies
- Offline first

## Colors

- Background: `#0B0F14`
- Surface: `#111827`
- Primary: `#6366F1`
- Text: `#F9FAFB`

## Future

Provider pattern enables seamless migration:
- Cloud sync (zero UI changes)
- Encryption (zero UI changes)
- Multi-device sync
- Desktop app

## Development

Edit files in `src/` and reload extension in Firefox DevTools.

No build tools needed. Pure ES modules, vanilla JavaScript.

## License

MIT
