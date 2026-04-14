import OBR from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";

export function registerCleanupMode() {
  OBR.tool.createMode({
    id: `${ID}/mode/cleanup`,
    icons: [
      {
        icon: "/trash-2.svg",
        label: "Cleanup",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],
  });
}