import OBR, { buildPath } from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";
import { buildBurstCommands } from "../geometry/geo-burst.js";
import { getSnappedIntersection } from "../grid.js";


function clampBurstFeet(feet) {
  const allowed = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  return allowed.includes(feet) ? feet : 5;
}

export function registerBurstMode() {
  OBR.tool.createMode({
    id: `${ID}/mode/burst`,
    icons: [
      {
        icon: "/burst.svg",
        label: "Burst",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],

    async onToolClick(context, event) {
      const rawTemplateFeet =
        typeof context.metadata.burstFeet === "number"
          ? context.metadata.burstFeet
          : 5;

      const templateFeet = clampBurstFeet(rawTemplateFeet);
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
          buildBurstCommands(
            grid.snappedCenter.x,
            grid.snappedCenter.y,
            grid.dpi,
            templateFeet
          )
        )
        .fillColor(fillColor)
        .fillOpacity(0.2)
        .strokeColor(strokeColor)
        .strokeWidth(4)
        .metadata({
          [ID]: {
            templateFeet,
            creatorId,
            burstFeet: templateFeet,
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
