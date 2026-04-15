# Dependencies

This document describes runtime dependencies, build dependencies, development tools, and environment assumptions for the Pathfinder / Starfinder AOE Templates Tool extension.


# Versioning
|Version | Date | Author | Notes |
| v0.1.0 | 4/14/2026 | illenvilen | Initial version |


# Runtime Dependencies

The extension depends on a single runtime SDK.

## Owlbear Rodeo SDK

Package:

```
@owlbear-rodeo/sdk
```

Purpose:

Provides:

- tool registration
- scene access
- metadata storage
- popover UI integration
- action registration
- grid information
- player information

Used throughout:

```js
OBR.onReady()
OBR.tool.create()
OBR.tool.createMode()
OBR.tool.createAction()
OBR.tool.getMetadata()
OBR.scene.items.addItems()
OBR.player.getColor()
```

This SDK is required for extension execution.


# Build Dependencies

## Vite

Package:

```
vite
```

Purpose:

- development server
- manifest hosting
- ES module bundling
- production build output

Configured in:

```
vite.config.js
```

Example configuration:

```js
export default defineConfig({
  server: {
    cors: {
      origin: "https://www.owlbear.rodeo",
    },
  },
});
```

# Node.js Requirements

Recommended version:

Node.js LTS (18 or newer)

Required for:

- npm install
- npm run dev
- npm run build
- npm run preview

# NPM Scripts

Defined scripts:

```sh
npm run dev
```

Starts development server for local extension testing.

```sh
npm run build
```

Builds production output.

```sh
npm run preview
```

Serves production build locally.

# Browser Requirements

Supported browsers:

- Chrome
- Edge
- Firefox

Must support:

- ES modules
- modern DOM APIs
- Owlbear Rodeo extension loading


# Owlbear Rodeo Requirements

Requires:

- Owlbear Rodeo account
- room ownership permission
- extension installation permission

Development testing requires loading manifest.json from local dev server.

Typical development manifest URL:

```
http://localhost:5173/manifest.json
```

# Grid Requirements

Extension assumes:

- square grid enabled
- grid measurement in feet
- scene grid accessible via SDK

Unsupported:

- hex grids
- gridless scenes

Placement helpers safely abort if unsupported grid detected.

# External Assets

Static assets stored in:

```
public/
```

Includes:

- SVG icons
- popover HTML
- **extension manifest**

No external CDN dependencies are required.


# License Dependencies

See:

THIRD_PARTY_LICENSES.md

for attribution and license compatibility details.


# Current Package Manifest

Current package manifest structure:

```json
{
  "name": "owlbear-pathfinder-templates",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^8.0.1"
  },
  "dependencies": {
    "@owlbear-rodeo/sdk": "^3.1.0"
  }
}
```
