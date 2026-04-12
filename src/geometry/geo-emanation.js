import { Command } from "@owlbear-rodeo/sdk";

function cellKey(x, y) {
  return `${x},${y}`;
}

function pointKey(x, y) {
  return `${x},${y}`;
}

function pathfinderCellDistance(dx, dy) {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  const major = Math.max(ax, ay);
  const minor = Math.min(ax, ay);

  return major + Math.floor(minor / 2);
}

function buildOriginCells(originWidth, originHeight) {
  const cells = [];

  for (let row = 0; row < originHeight; row += 1) {
    for (let col = 0; col < originWidth; col += 1) {
      cells.push({
        x: col - (originWidth - 1) / 2,
        y: row - (originHeight - 1) / 2,
      });
    }
  }

  return cells;
}

function minimumDistanceToOriginFootprint(targetX, targetY, originCells) {
  let best = Infinity;

  for (const origin of originCells) {
    const dx = targetX - origin.x;
    const dy = targetY - origin.y;
    const dist = pathfinderCellDistance(dx, dy);

    if (dist < best) {
      best = dist;
    }
  }

  return best;
}

function buildIncludedCells(radiusCells, originWidth, originHeight) {
  const cells = new Set();
  const originCells = buildOriginCells(originWidth, originHeight);

  const xOffset = originWidth % 2 === 0 ? 0.5 : 0;
  const yOffset = originHeight % 2 === 0 ? 0.5 : 0;

  const searchRadiusX = radiusCells + Math.ceil(originWidth / 2) + 2;
  const searchRadiusY = radiusCells + Math.ceil(originHeight / 2) + 2;

  const xMax = searchRadiusX - (xOffset !== 0 ? 1 : 0);
  const yMax = searchRadiusY - (yOffset !== 0 ? 1 : 0);

  for (let yi = -searchRadiusY; yi <= yMax; yi += 1) {
    const y = yi + yOffset;

    for (let xi = -searchRadiusX; xi <= xMax; xi += 1) {
      const x = xi + xOffset;

      if (minimumDistanceToOriginFootprint(x, y, originCells) <= radiusCells) {
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
      (prevHorizontal && nextHorizontal) || (prevVertical && nextVertical);

    if (!collinear) {
      simplified.push(curr);
    }
  }

  return simplified;
}

export function buildEmanationCommands(
  centerX,
  centerY,
  cellSize,
  radiusCells,
  originWidth,
  originHeight
) {
  const includedCells = buildIncludedCells(radiusCells, originWidth, originHeight);
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
