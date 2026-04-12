import OBR, { buildPath } from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";
import { getSnappedOrigin } from "../grid.js";
import { buildLineCommands } from "../geometry/line.js";

const ALLOWED_FEET = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 80, 100, 120];
const ALLOWED_DIRECTIONS = new Set([
  "N", "NbE", "NNE", "NE", "ENE", "EbN",
  "E", "EbS", "ESE", "SE", "SSE", "SbE",
  "S", "SbW", "SSW", "SW", "WSW", "WbS",
  "W", "WbN", "WNW", "NW", "NNW", "NbW",
]);

function clampLineFeet(feet) {
  return ALLOWED_FEET.includes(feet) ? feet : 5;
}

function normalizeDirection(value) {
  return ALLOWED_DIRECTIONS.has(value) ? value : "E";
}

export function registerLineMode() {
  OBR.tool.createMode({
    id: `${ID}/mode/line`,
    icons: [
      {
        icon: "/icon.svg",
        label: "Line",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],

    async onToolClick(context, event) {
      const rawTemplateFeet =
        typeof context.metadata.lineFeet === "number"
          ? context.metadata.lineFeet
          : 5;

      const templateFeet = clampLineFeet(rawTemplateFeet);
      const direction = normalizeDirection(context.metadata.lineDirection);
      const creatorId = await OBR.player.getId();

      const grid = await getSnappedOrigin(event.pointerPosition, 1, 1);
      if (!grid) return;

      const fillColor =
        typeof context.metadata.fillColor === "string"
          ? context.metadata.fillColor
          : "#ff0000";

      const strokeColor =
        typeof context.metadata.strokeColor === "string"
          ? context.metadata.strokeColor
          : "#ff0000";

      const item = buildPath()
        .commands(
          buildLineCommands(
            grid.snappedCenter.x,
            grid.snappedCenter.y,
            grid.dpi,
            templateFeet,
            direction
          )
        )
        .fillColor(fillColor)
        .fillOpacity(0.2)
        .strokeColor(strokeColor)
        .strokeWidth(4)
        .metadata({
          [ID]: {
            templateKind: "line",
            templateFeet,
            creatorId,
            lineFeet: templateFeet,
            lineDirection: direction,
            fillColor,
            strokeColor,
            gridCellPixels: grid.dpi,
            gridScaleRaw: grid.scale.raw,
            gridScaleMultiplier: grid.scale.parsed?.multiplier ?? null,
            gridScaleUnit: grid.scale.parsed?.unit ?? null,
          },
        })
        .build();

      await OBR.scene.items.addItems([item]);
    },
  });
}