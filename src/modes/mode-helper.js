import OBR, { buildPath } from "@owlbear-rodeo/sdk";
import { ID } from "../tool.js";

export const TEMPLATE_METADATA_KEY = `${ID}/template`;

export async function buildTemplateMetadata(extra = {}) {
  const player = await OBR.player.getPlayer();

  return {
    [ID]: {
      extension: ID,
      createdBy: player.id,
      creatorId: player.id,
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