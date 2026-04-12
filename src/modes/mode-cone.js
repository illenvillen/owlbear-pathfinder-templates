import OBR, { buildPath } from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";
import { buildConeCommands, getConeVariant } from "../geometry/geo-cone.js";
import { getSnappedIntersection } from "../grid.js";


const ALLOWED_FEET = [5, 10, 15, 20, 30, 40, 50, 60, 80];
const ALLOWED_DIRECTIONS = new Set([
  "N", "E", "S", "W",
  "NE", "NW", "SE", "SW",
]);

function clampConeFeet(feet) {
  return ALLOWED_FEET.includes(feet) ? feet : 15;
}

function normalizeDirection(value) {
  return ALLOWED_DIRECTIONS.has(value) ? value : "NE";
}

export function registerConeMode() {
  OBR.tool.createMode({
    id: `${ID}/mode/cone`,
    icons: [
      {
        icon: "/icon.svg",
        label: "Cone",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],

    async onToolClick(context, event) {
      const rawTemplateFeet =
        typeof context.metadata.coneFeet === "number"
          ? context.metadata.coneFeet
          : 15;

      const templateFeet = clampConeFeet(rawTemplateFeet);
      const direction = normalizeDirection(context.metadata.coneDirection);
      const variant = getConeVariant(direction);
      const creatorId = await OBR.player.getId();

      const grid = await getSnappedIntersection(event.pointerPosition);
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
          buildConeCommands(
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
            templateKind: "cone",
            creatorId,
            coneVariant: variant,
            templateFeet,
            coneFeet: templateFeet,
            coneDirection: direction,
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
