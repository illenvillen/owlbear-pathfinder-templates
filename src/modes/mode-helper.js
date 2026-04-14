import { buildPath } from "@owlbear-rodeo/sdk";
import OBR from "@owlbear-rodeo/sdk";
import { ID } from "../tool.js";

export async function buildTemplateMetadata(extra = {}) {
  const playerId = await OBR.player.getId();

  return {
    [ID]: {
      extension: ID,
      createdBy: playerId,
      creatorId: playerId,
      createdAt: Date.now(),
      ...extra,
    },
  };
}

export async function buildOwnedTemplatePath({
  commands,
  position,
  strokeColor,
  fillColor,
  strokeWidth = 4,
  strokeOpacity = 1,
  fillOpacity = 0.25,
  extraMetadata = {},
}) {
  const metadata = await buildTemplateMetadata(extraMetadata);

  const builder = buildPath()
    .commands(commands)
    .strokeColor(strokeColor)
    .strokeOpacity(strokeOpacity)
    .strokeWidth(strokeWidth)
    .fillColor(fillColor)
    .fillOpacity(fillOpacity)
    .metadata(metadata);

  if (position) {
    builder.position(position);
  }

  return builder.build();
}