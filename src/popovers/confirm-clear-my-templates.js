import OBR from "@owlbear-rodeo/sdk";
import { ID } from "../tool.js";

const POPOVER_ID = `${ID}/popover/confirm-clear-my-templates`;

async function clearMyTemplates() {
  const playerId = await OBR.player.getId();

  const myTemplateItems = await OBR.scene.items.getItems((item) => {
    const metadata = item.metadata?.[ID];
    if (!metadata) return false;

    return (
      metadata.createdBy === playerId ||
      metadata.creatorId === playerId
    );
  });

  if (myTemplateItems.length === 0) {
    await OBR.popover.close(POPOVER_ID);
    return;
  }

  await OBR.scene.items.deleteItems(myTemplateItems.map((item) => item.id));
  await OBR.popover.close(POPOVER_ID);
}

OBR.onReady(async () => {
  const cancelButton = document.getElementById("cancel");
  const confirmButton = document.getElementById("confirm");

  cancelButton?.addEventListener("click", async () => {
    await OBR.popover.close(POPOVER_ID);
  });

  confirmButton?.addEventListener("click", async () => {
    await clearMyTemplates();
  });
});