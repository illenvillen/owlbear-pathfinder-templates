import OBR from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../tool.js";

function normalizeColor(value, fallback = "#ff0000") {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

OBR.onReady(async () => {
  const input = document.getElementById("color");
  const preview = document.getElementById("preview");
  const usePlayerColorButton = document.getElementById("use-player-color");

  if (!(input instanceof HTMLInputElement)) {
    throw new Error("color-picker.html is missing #color");
  }

  function updatePreview(color) {
    if (preview) {
      preview.style.background = color;
    }
  }

  async function applyCurrentColor() {
    const metadata = await OBR.tool.getMetadata(TOOL_ID);
    const currentColor = normalizeColor(
      metadata.strokeColor ?? metadata.fillColor,
      "#ff0000"
    );

    input.value = currentColor;
    updatePreview(currentColor);
  }

  input.addEventListener("input", async () => {
    const color = normalizeColor(input.value, "#ff0000");

    await OBR.tool.setMetadata(TOOL_ID, {
      strokeColor: color,
      fillColor: color,
    });

    updatePreview(color);
  });

  usePlayerColorButton?.addEventListener("click", async () => {
    const playerColor = normalizeColor(await OBR.player.getColor(), "#ff0000");

    await OBR.tool.setMetadata(TOOL_ID, {
      strokeColor: playerColor,
      fillColor: playerColor,
    });

    input.value = playerColor;
    updatePreview(playerColor);
  });

  await applyCurrentColor();
});
