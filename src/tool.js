import OBR from "@owlbear-rodeo/sdk";

export const ID = "com.onehithalfling.pathfinder-templates";
export const TOOL_ID = `${ID}/tool`;

export async function createTool() {
  const playerColor = await OBR.player.getColor();

  await OBR.tool.create({
    id: TOOL_ID,
    icons: [
      {
        icon: "/icon.svg",
        label: "Pathfinder Templates",
      },
    ],
    defaultMode: `${ID}/mode/emanation`,
    defaultMetadata: {
      creatureSize: "small-medium",
      emanationFeet: 5,
      burstFeet: 5,
      coneFeet: 15,
      coneDirection: "NE",
      lineFeet: 5,
      lineDirection: "E",
      strokeColor: playerColor,
      fillColor: playerColor,
    },
  });
}
