import OBR from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../tool.js";

const DIRECTIONS = [
  "N", "NbE", "NNE", "NE", "ENE", "EbN",
  "E", "EbS", "ESE", "SE", "SSE", "SbE",
  "S", "SbW", "SSW", "SW", "WSW", "WbS",
  "W", "WbN", "WNW", "NW", "NNW", "NbW",
];

const MAJOR_SET = new Set(["N", "E", "S", "W"]);
const DIAGONAL_SET = new Set(["NE", "SE", "SW", "NW"]);
const VALID_DIRECTIONS = new Set(DIRECTIONS);

function normalizeDirection(value) {
  return VALID_DIRECTIONS.has(value) ? value : "E";
}

function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}

function sectorPath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const p1 = polar(cx, cy, outerR, startAngle);
  const p2 = polar(cx, cy, outerR, endAngle);
  const p3 = polar(cx, cy, innerR, endAngle);
  const p4 = polar(cx, cy, innerR, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}

OBR.onReady(async () => {
  const svg = document.getElementById("compass");
  const centerLabel = document.getElementById("centerLabel");
  const centerSub = document.getElementById("centerSub");

  const metadata = await OBR.tool.getMetadata(TOOL_ID);
  let selected = normalizeDirection(metadata.lineDirection);

  const cx = 160;
  const cy = 160;
  const outerR = 150;
  const innerR = 64;
  const labelR = 116;
  const step = 360 / DIRECTIONS.length;

  function updateCenter(direction, sub = "selected") {
    centerLabel.textContent = direction;
    centerSub.textContent = sub;
  }

  function markSelected(direction) {
    svg.querySelectorAll(".sector.selected").forEach((el) => {
      el.classList.remove("selected");
    });

    const sector = svg.querySelector(`[data-direction="${direction}"]`);
    if (sector) {
      sector.classList.add("selected");
    }
  }

  DIRECTIONS.forEach((dir, i) => {
    const start = i * step;
    const end = start + step;
    const mid = start + step / 2;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", sectorPath(cx, cy, innerR, outerR, start, end));
    path.dataset.direction = dir;
    path.classList.add("sector");

    if (MAJOR_SET.has(dir)) {
      path.classList.add("major");
    } else if (DIAGONAL_SET.has(dir)) {
      path.classList.add("diagonal");
    } else {
      path.classList.add("minor");
    }

    if (dir === selected) {
      path.classList.add("selected");
    }

    path.addEventListener("mouseenter", () => {
      updateCenter(dir, "hover");
    });

    path.addEventListener("mouseleave", () => {
      updateCenter(selected, "selected");
    });

    path.addEventListener("click", async () => {
      selected = dir;
      markSelected(dir);
      updateCenter(dir, "selected");

      await OBR.tool.setMetadata(TOOL_ID, {
        lineDirection: dir,
      });
    });

    svg.appendChild(path);

    if (MAJOR_SET.has(dir) || DIAGONAL_SET.has(dir)) {
      const labelPos = polar(cx, cy, labelR, mid);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", labelPos.x);
      text.setAttribute("y", labelPos.y);
      text.setAttribute("class", "major-label");
      text.textContent = dir;
      svg.appendChild(text);
    }
  });

  updateCenter(selected, "selected");
});
