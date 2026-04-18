# Architecture

This document describes the runtime structure, module layout, metadata model, and geometry pipeline of the Pathfinder / Starfinder AOE Templates Tool Owlbear Rodeo extension.

It is intended for maintainers and contributors.

# Versioning
|Version | Date | Author | Notes |
| v0.1.0 | 4/14/2026 | illenvilen | Initial version |

# Overview

This extension provides grid-aligned placement tools for Pathfinder 2e and Starfinder 2e area-of-effect templates inside Owlbear Rodeo.

Supported template types:

- Emanation
- Burst
- Cone
- Line
- Cleanup mode

Templates are generated using grid-aware geometry modules and inserted as scene path items.

The extension is implemented as a single Owlbear tool with multiple placement modes and popover-driven configuration actions.

# Runtime Lifecycle

Startup sequence:

1. Owlbear loads the extension background page from manifest.json
2. src/main.js executes after OBR.onReady
3. Tool registration occurs
4. Placement modes are registered
5. Cleanup mode is registered
6. Tool actions are registered
7. Popover UI becomes available
8. User interaction generates template geometry
9. Geometry is converted into scene items

Startup flow:

```text
OBR.onReady()
 ├── createTool()
 ├── registerPlacementModes()
 ├── registerCleanupMode()
 └── registerToolActions()
```

# Repository Structure

```text
public/
    manifest.json
    *.svg
    *-picker.html

src/
    main.js
    tool.js
    grid.js

    actions/

    geometry/

    modes/

    popovers/

```

Module responsibilities:

| Directory or File | Responsibility |
|-----------|---------------|
| main.js | extension bootstrap |
| tool.js | tool identity and metadata defaults |
| grid.js | grid snapping helpers |
| geometry | shape construction algorithms |
| modes | placement logic |
| actions | toolbar actions |
| popovers | UI controllers |
| public | static HTML and icons |

# Tool Metadata Contract

Tool metadata stores persistent configuration between placements.

| Key | Type | Default | Used By |
|-----|------|---------|--------|
| creatureSize | string | small-medium | emanation |
| emanationFeet | number | 5 | emanation |
| burstFeet | number | 5 | burst |
| coneFeet | number | 15 | cone |
| lineFeet | number | 5 | line |
| coneDirection | string | NE | cone |
| lineDirection | string | E | line |
| strokeColor | string | player color | all |
| fillColor | string | player color | all |

Metadata is read using:

```js
OBR.tool.getMetadata(TOOL_ID)
```

Metadata is written using:

```js
OBR.tool.setMetadata(TOOL_ID)
```


# Item Metadata Contract

Placed templates include ownership metadata for cleanup and filtering.

| Field | Purpose |
|------|---------|
| extension | identifies extension ownership |
| createdBy | identifies creating player |
| creatorId | identifies creator instance |
| createdAt | timestamp |

Used by cleanup mode and future ownership filtering features.

# Mode System

Each template type is implemented as a tool mode.

## Emanation Mode

TODO: Anchoring: creature footprint

Uses:

- creatureSize
- emanationFeet

TODO: Placement center snaps to token footprint center.

## Burst Mode

Anchoring: grid intersection

Uses:

- burstFeet

TODO: Boundary calculated from included grid cells.

## Cone Mode

Anchoring: grid intersection

Uses:

- coneFeet
- coneDirection

Direction selected via 8-direction compass popover.

## Line Mode

Anchoring: grid intersection

Uses:

- lineFeet
- lineDirection

Direction selected via 24-direction compass selector.

## Cleanup Mode

Non-placement utility mode.

Provides action:

Clear My Templates

Deletes templates created by the current player.

# Action System

Toolbar actions expose configuration popovers.

Always available except in cleanup:

- radius picker
- color picker

Mode-dependent actions:

| Mode | Action |
|------|--------|
| emanation | creature size |
| cone | cone direction |
| line | line direction |
| cleanup | clear templates |

Actions dynamically appear when the active mode changes.

# Popover UI Architecture

Popovers are implemented as static HTML files in public.

Logic controllers are located in src/popovers.

Example mapping:

| HTML | Controller |
|------|-----------|
| color-picker.html | color-picker.js |
| radius-picker.html | radius-picker.js |
| size-picker.html | size-picker.js |
| cone-direction-picker.html | cone-direction-picker.js |
| line-direction-picker.html | line-direction-picker.js |

Each popover reads and writes tool metadata.

# Geometry Pipeline

Template placement follows this sequence:

1. User selects placement position
2. Grid snapping resolves anchor location
3. Geometry module calculates included cells
4. Boundary edges are generated
5. Edges are stitched into polygon paths
6. Path commands are simplified
7. Scene item is created

Typical flow:

```text
grid snap
→ included cells
→ boundary edges
→ stitched outline
→ simplified polygon
→ OBR path commands
```

# Grid Assumptions

This extension assumes:

- square grid scenes
- grid enabled
- grid measurement in feet

If a valid square grid is not present, placement helpers return null and template placement is skipped.

Future versions may support additional grid types.

# Cleanup Ownership Model

Cleanup mode removes templates created by the current player only.

Ownership metadata ensures:

- players cannot delete other players’ templates
- multi-user scenes remain safe
- template filtering is deterministic

# Extension Manifest

The extension manifest is located at:

public/manifest.json

Example structure:

```json
{
  "name": "Pathfinder/Starfinder AOE Templates Tool",
  "version": "0.1.3",
  "manifest_version": 1,
  "background_url": "/"
}
```
