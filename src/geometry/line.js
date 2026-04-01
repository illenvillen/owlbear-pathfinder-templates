import { Command } from "@owlbear-rodeo/sdk";

const COUNT_TABLES = {
  straight: {
    5: 1, 10: 2, 15: 3, 20: 4, 25: 5, 30: 6, 35: 7, 40: 8, 45: 9, 50: 10, 55: 11, 60: 12, 80: 16, 100: 20, 120: 24,
  },
  shallow: {
    5: 1, 10: 2, 15: 3, 20: 4, 25: 5, 30: 6, 35: 7, 40: 7, 45: 8, 50: 9, 55: 10, 60: 11, 80: 14, 100: 18, 120: 21,
  },
  deep: {
    5: 1, 10: 2, 15: 3, 20: 4, 25: 4, 30: 5, 35: 6, 40: 7, 45: 8, 50: 8, 55: 9, 60: 10, 80: 13, 100: 16, 120: 20,
  },
  diagonal: {
    5: 1, 10: 1, 15: 2, 20: 3, 25: 3, 30: 4, 35: 5, 40: 5, 45: 6, 50: 7, 55: 7, 60: 8, 80: 10, 100: 13, 120: 16,
  },
};

const DIRECTION_CONFIG = {
  E:   { family: "straight", mirror: false, rotation: 0 },
  EbN: { family: "shallow",  mirror: false, rotation: 0 },
  ENE: { family: "deep",     mirror: false, rotation: 0 },
  NE:  { family: "diagonal", mirror: false, rotation: 0 },
  NNE: { family: "deep",     mirror: true,  rotation: 0 },
  NbE: { family: "shallow",  mirror: true,  rotation: 0 },

  N:   { family: "straight", mirror: false, rotation: 1 },
  NbW: { family: "shallow",  mirror: false, rotation: 1 },
  NNW: { family: "deep",     mirror: false, rotation: 1 },
  NW:  { family: "diagonal", mirror: false, rotation: 1 },
  WNW: { family: "deep",     mirror: true,  rotation: 1 },
  WbN: { family: "shallow",  mirror: true,  rotation: 1 },

  W:   { family: "straight", mirror: false, rotation: 2 },
  WbS: { family: "shallow",  mirror: false, rotation: 2 },
  WSW: { family: "deep",     mirror: false, rotation: 2 },
  SW:  { family: "diagonal", mirror: false, rotation: 2 },
  SSW: { family: "deep",     mirror: true,  rotation: 2 },
  SbW: { family: "shallow",  mirror: true,  rotation: 2 },

  S:   { family: "straight", mirror: false, rotation: 3 },
  SbE: { family: "shallow",  mirror: false, rotation: 3 },
  SSE: { family: "deep",     mirror: false, rotation: 3 },
  SE:  { family: "diagonal", mirror: false, rotation: 3 },
  ESE: { family: "deep",     mirror: true,  rotation: 3 },
  EbS: { family: "shallow",  mirror: true,  rotation: 3 },
};

const SUPPORTED_DIRECTIONS = new Set(Object.keys(DIRECTION_CONFIG));

function normalizeDirection(direction) {
  return SUPPORTED_DIRECTIONS.has(direction) ? direction : "E";
}

function getCellCount(feet, family) {
  const table = COUNT_TABLES[family];
  if (!table || !(feet in table)) {
    throw new Error(`Unsupported line size for ${family}: ${feet}`);
  }
  return table[feet];
}

function mirrorAcrossNorthEast(center) {
  return [-center[1], -center[0]];
}

function rotateLeft(center) {
  return [center[1], -center[0]];
}

function rotate(center, steps) {
  let point = center;
  for (let i = 0; i < steps; i += 1) {
    point = rotateLeft(point);
  }
  return point;
}

function buildBaseCenters(feet, family) {
  const count = getCellCount(feet, family);
  const centers = [];

  for (let i = 0; i < count; i += 1) {
    let x;
    let y;

    switch (family) {
      case "straight":
        x = i;
        y = 0;
        break;

      case "shallow":
        x = i;
        y = -Math.floor(i / 3);
        break;

      case "deep":
        x = Math.floor(i / 2);
        y = -i;
        break;

      case "diagonal":
      default:
        x = i;
        y = -i;
        break;
    }

    centers.push([x, y]);
  }

  return centers;
}

function getTransformedCenters(feet, direction) {
  const normalized = normalizeDirection(direction);
  const config = DIRECTION_CONFIG[normalized];

  let centers = buildBaseCenters(feet, config.family);

  if (config.mirror) {
    centers = centers.map(mirrorAcrossNorthEast);
  }

  if (config.rotation) {
    centers = centers.map((center) => rotate(center, config.rotation));
  }

  return centers;
}

function addCellRectangle(commands, centerX, centerY, cellSize, cx, cy) {
  const left = centerX + (cx - 0.5) * cellSize;
  const right = centerX + (cx + 0.5) * cellSize;
  const top = centerY + (cy - 0.5) * cellSize;
  const bottom = centerY + (cy + 0.5) * cellSize;

  commands.push([Command.MOVE, left, top]);
  commands.push([Command.LINE, right, top]);
  commands.push([Command.LINE, right, bottom]);
  commands.push([Command.LINE, left, bottom]);
  commands.push([Command.CLOSE]);
}

export function buildLineCommands(centerX, centerY, cellSize, feet, direction) {
  const centers = getTransformedCenters(feet, direction);
  const commands = [];

  for (const [cx, cy] of centers) {
    addCellRectangle(commands, centerX, centerY, cellSize, cx, cy);
  }

  return commands;
}