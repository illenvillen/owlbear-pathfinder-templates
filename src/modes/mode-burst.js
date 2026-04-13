import OBR from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";
import { getSnappedIntersection } from "../grid.js";
import { buildBurstCommands } from "../geometry/geo-burst.js";
import { buildOwnedTemplatePath } from "./mode-helper.js";


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

      const item = await buildOwnedTemplatePath({
        commands: buildBurstCommands(
          grid.snappedCenter.x,
          grid.snappedCenter.y,
          grid.dpi,
          templateFeet
        ),
        strokeColor,
        fillColor,
        strokeWidth: 4,
        fillOpacity: 0.2,
        extraMetadata: {
          mode: "burst",
          templateFeet,
          burstFeet: templateFeet,
          gridCellPixels: grid.dpi,
          gridScaleRaw: grid.scale.raw,
          gridScaleMultiplier: grid.scale.parsed?.multiplier ?? null,
          gridScaleUnit: grid.scale.parsed?.unit ?? null,
        },
      });

      await OBR.scene.items.addItems([item]);
    },
  });
}
