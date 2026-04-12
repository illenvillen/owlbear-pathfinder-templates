import { Command } from "@owlbear-rodeo/sdk";

const DIAGONAL_CONE_WIDTHS = {
  5: [1],
  10: [1, 2],
  15: [1, 2, 3],
  20: [1, 2, 3, 4],
  30: [1, 3, 4, 5, 5, 6],
  40: [1, 3, 5, 6, 6, 7, 7, 8],
  50: [1, 3, 5, 6, 7, 8, 8, 9, 9, 10],
  60: [1, 3, 5, 7, 8, 9, 9, 10, 10, 11, 11, 12],
  80: [1, 3, 5, 7, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16],
};

const ORTHOGONAL_CONE_WIDTHS = {
  5: [1],
  10: [2, 2],
  15: [1, 3, 3],
  20: [1, 3, 5, 3],
  30: [2, 4, 6, 8, 6, 2],
  40: [2, 4, 6, 8, 10, 8, 6, 2],
  50: [2, 4, 6, 8, 10, 12, 10, 8, 6, 2],
  60: [2, 4, 6, 8, 10, 12, 14, 16, 14, 10, 6, 2],
  80: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 18, 16, 14, 10, 6, 2],
};

const CARDINAL_DIRECTIONS = new Set(["N", "E", "S", "W"]);
const VALID_DIRECTIONS = new Set([
  "N", "E", "S", "W",
  "NE", "NW", "SE", "SW",
]);

function cellKey(x, y) {
  return `${x},${y}`;
}

function pointKey(x, y) {
  return `${x},${y}`;
}

function normalizeDirection(direction) {
  return VALID_DIRECTIONS.has(direction) ? direction : "NE";
}

function centeredOffsets(width) {
  const offsets = [];
  const start = -(width - 1) / 2;

  for (let i = 0; i < width; i += 1) {
    offsets.push(start + i);
  }

  return offsets;
}

function getDiagonalWidths(feet) {
  const widths = DIAGONAL_CONE_WIDTHS[feet];
  if (!widths) throw new Error(`Unsupported diagonal cone size: ${feet}`);
  return widths;
}

function getOrthogonalWidths(feet) {
  const widths = ORTHOGONAL_CONE_WIDTHS[feet];
  if (!widths) throw new Error(`Unsupported orthogonal cone size: ${feet}`);
  return widths;
}

function buildDiagonalCells(feet, direction) {
  const widths = [...getDiagonalWidths(feet)].reverse();
  const normalizedDirection = normalizeDirection(direction);
  const cells = new Set();

  const xSign =
    normalizedDirection === "NW" || normalizedDirection === "SW" ? -1 : 1;
  const ySign =
    normalizedDirection === "NE" || normalizedDirection === "NW" ? -1 : 1;

  for (let row = 0; row < widths.length; row += 1) {
    const width = widths[row];

    for (let col = 0; col < width; col += 1) {
      const localX = col + 0.5;
      const localY = row + 0.5;

      const x = xSign * localX;
      const y = ySign * localY;

      cells.add(cellKey(x, y));
    }
  }

  return cells;
}

function buildOrthogonalCells(feet, direction) {
  const widths = getOrthogonalWidths(feet);
  const normalizedDirection = normalizeDirection(direction);
  const cells = new Set();

  for (let row = 0; row < widths.length; row += 1) {
    const width = widths[row];
    const offsets = centeredOffsets(width);

    switch (normalizedDirection) {
      case "N": {
        const y = -(row + 0.5);
        for (const offset of offsets) cells.add(cellKey(offset, y));
        break;
      }
      case "S": {
        const y = row + 0.5;
        for (const offset of offsets) cells.add(cellKey(offset, y));
        break;
      }
      case "E": {
        const x = row + 0.5;
        for (const offset of offsets) cells.add(cellKey(x, offset));
        break;
      }
      case "W":
      default: {
        const x = -(row + 0.5);
        for (const offset of offsets) cells.add(cellKey(x, offset));
        break;
      }
    }
  }

  return cells;
}

function addEdge(edges, x1, y1, x2, y2) {
  edges.push({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 } });
}

function buildBoundaryEdges(cells, centerX, centerY, cellSize) {
  const edges = [];

  for (const key of cells) {
    const [sx, sy] = key.split(",");
    const cx = Number(sx);
    const cy = Number(sy);

    const left = centerX + (cx - 0.5) * cellSize;
    const right = centerX + (cx + 0.5) * cellSize;
    const top = centerY + (cy - 0.5) * cellSize;
    const bottom = centerY + (cy + 0.5) * cellSize;

    if (!cells.has(cellKey(cx, cy - 1))) addEdge(edges, left, top, right, top);
    if (!cells.has(cellKey(cx + 1, cy))) addEdge(edges, right, top, right, bottom);
    if (!cells.has(cellKey(cx, cy + 1))) addEdge(edges, right, bottom, left, bottom);
    if (!cells.has(cellKey(cx - 1, cy))) addEdge(edges, left, bottom, left, top);
  }

  return edges;
}

function stitchBoundary(edges) {
  const outgoing = new Map();

  for (const edge of edges) {
    outgoing.set(pointKey(edge.start.x, edge.start.y), edge);
  }

  let startEdge = null;

  for (const edge of edges) {
    if (
      !startEdge ||
      edge.start.y < startEdge.start.y ||
      (edge.start.y === startEdge.start.y && edge.start.x < startEdge.start.x)
    ) {
      startEdge = edge;
    }
  }

  if (!startEdge) return [];

  const points = [];
  let current = startEdge;

  while (current) {
    points.push([current.start.x, current.start.y]);

    const nextKey = pointKey(current.end.x, current.end.y);
    current = outgoing.get(nextKey);

    if (
      current &&
      current.start.x === startEdge.start.x &&
      current.start.y === startEdge.start.y
    ) {
      break;
    }
  }

  return points;
}

function simplifyPoints(points) {
  if (points.length < 3) return points;

  const simplified = [];

  for (let i = 0; i < points.length; i += 1) {
    const prev = points[(i - 1 + points.length) % points.length];
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    const prevDx = curr[0] - prev[0];
    const prevDy = curr[1] - prev[1];
    const nextDx = next[0] - curr[0];
    const nextDy = next[1] - curr[1];

    const prevHorizontal = prevDy === 0;
    const nextHorizontal = nextDy === 0;
    const prevVertical = prevDx === 0;
    const nextVertical = nextDx === 0;

    const collinear =
      (prevHorizontal && nextHorizontal) ||
      (prevVertical && nextVertical);

    if (!collinear) simplified.push(curr);
  }

  return simplified;
}

export function buildConeCommands(centerX, centerY, cellSize, feet, direction) {
  const normalizedDirection = normalizeDirection(direction);

  const includedCells = CARDINAL_DIRECTIONS.has(normalizedDirection)
    ? buildOrthogonalCells(feet, normalizedDirection)
    : buildDiagonalCells(feet, normalizedDirection);

  const boundaryEdges = buildBoundaryEdges(includedCells, centerX, centerY, cellSize);
  const boundaryPoints = stitchBoundary(boundaryEdges);
  const points = simplifyPoints(boundaryPoints);

  if (points.length === 0) return [];

  const commands = points.map(([x, y], index) =>
    index === 0 ? [Command.MOVE, x, y] : [Command.LINE, x, y]
  );

  commands.push([Command.CLOSE]);
  return commands;
}

export function getConeVariant(direction) {
  const normalizedDirection = normalizeDirection(direction);
  return CARDINAL_DIRECTIONS.has(normalizedDirection) ? "orthogonal" : "diagonal";
}
