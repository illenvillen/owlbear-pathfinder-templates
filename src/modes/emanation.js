import OBR, { buildPath } from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";
import { getSnappedOrigin } from "../grid.js";
import { buildEmanationCommands } from "../geometry/emanation.js";

function clampRadiusBySize(creatureSize, feet) {
  const allowed = {
    "small-medium": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 80, 90, 100, 120],
    large: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 80, 90, 100, 120],
    huge: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 80, 90, 100, 120],
    gargantuan: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 80, 90, 100, 120],
  };

  if (!allowed[creatureSize]) return 5;
  if (allowed[creatureSize].includes(feet)) return feet;
  return allowed[creatureSize][0];
}

function sizeToFootprint(creatureSize) {
  switch (creatureSize) {
    case "large":
      return { originWidth: 2, originHeight: 2 };
    case "huge":
      return { originWidth: 3, originHeight: 3 };
    case "gargantuan":
      return { originWidth: 4, originHeight: 4 };
    default:
      return { originWidth: 1, originHeight: 1 };
  }
}

function feetToRadiusCells(feet) {
  return Math.max(1, Math.floor(feet / 5));
}

export function registerEmanationMode() {
  OBR.tool.createMode({
    id: `${ID}/mode/emanation`,
    icons: [
      {
        icon: "/icon.svg",
        label: "Emanation",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],

    async onToolClick(context, event) {
      const creatureSize =
        typeof context.metadata.creatureSize === "string"
          ? context.metadata.creatureSize
          : "small-medium";

      const rawTemplateFeet =
        typeof context.metadata.emanationFeet === "number"
          ? context.metadata.emanationFeet
          : 5;

      const templateFeet = clampRadiusBySize(creatureSize, rawTemplateFeet);
      const { originWidth, originHeight } = sizeToFootprint(creatureSize);
      const creatorId = await OBR.player.getId();

      const grid = await getSnappedOrigin(
        event.pointerPosition,
        originWidth,
        originHeight
      );
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
          buildEmanationCommands(
            grid.snappedCenter.x,
            grid.snappedCenter.y,
            grid.dpi,
            feetToRadiusCells(templateFeet),
            originWidth,
            originHeight
          )
        )
        .fillColor(fillColor)
        .fillOpacity(0.2)
        .strokeColor(strokeColor)
        .strokeWidth(4)
        .metadata({
          [ID]: {
            creatureSize,
            templateFeet,
            creatorId,
            emanationFeet: templateFeet,
            originWidth,
            originHeight,
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
