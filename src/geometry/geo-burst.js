import { Command } from "@owlbear-rodeo/sdk";

function cellKey(x, y) {
  return `${x},${y}`;
}

function pointKey(x, y) {
  return `${x},${y}`;
}

function clampBurstFeet(feet) {
  return Math.max(5, Math.floor(feet / 5) * 5);
}

function buildIncludedCells(feet) {
  const safeFeet = clampBurstFeet(feet);
  const radiusCells = safeFeet / 5;
  const cells = new Set();

  for (let row = -radiusCells; row < radiusCells; row += 1) {
    const y = row + 0.5;

    for (let col = -radiusCells * 3; col <= radiusCells * 3; col += 1) {
      const x = col + 0.5;

      const ax = Math.abs(x);
      const ay = Math.abs(y);
      const distance = Math.max(ax, ay) + Math.min(ax, ay) / 2;

      if (distance <= radiusCells) {
        cells.add(cellKey(x, y));
      }
    }
  }

  return cells;
}

function addEdge(edges, x1, y1, x2, y2) {
  edges.push({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
  });
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

    if (!cells.has(cellKey(cx, cy - 1))) {
      addEdge(edges, left, top, right, top);
    }

    if (!cells.has(cellKey(cx + 1, cy))) {
      addEdge(edges, right, top, right, bottom);
    }

    if (!cells.has(cellKey(cx, cy + 1))) {
      addEdge(edges, right, bottom, left, bottom);
    }

    if (!cells.has(cellKey(cx - 1, cy))) {
      addEdge(edges, left, bottom, left, top);
    }
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

    if (!collinear) {
      simplified.push(curr);
    }
  }

  return simplified;
}

export function buildBurstCommands(centerX, centerY, cellSize, feet) {
  const includedCells = buildIncludedCells(feet);
  const boundaryEdges = buildBoundaryEdges(
    includedCells,
    centerX,
    centerY,
    cellSize
  );
  const boundaryPoints = stitchBoundary(boundaryEdges);
  const points = simplifyPoints(boundaryPoints);

  if (points.length === 0) return [];

  const commands = points.map(([x, y], index) =>
    index === 0 ? [Command.MOVE, x, y] : [Command.LINE, x, y]
  );

  commands.push([Command.CLOSE]);
  return commands;
}
