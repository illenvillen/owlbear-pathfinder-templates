import OBR from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../tool.js";

const VALID_SIZES = new Set(["small-medium", "large", "huge", "gargantuan"]);

function normalizeCreatureSize(value) {
  return VALID_SIZES.has(value) ? value : "small-medium";
}

OBR.onReady(async () => {
  const buttons = Array.from(document.querySelectorAll("button[data-size]"));

  function applySelection(creatureSize) {
    for (const button of buttons) {
      const selected = button.dataset.size === creatureSize;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    }
  }

  async function loadAndApply() {
    const metadata = await OBR.tool.getMetadata(TOOL_ID);
    const currentSize = normalizeCreatureSize(metadata.creatureSize);
    applySelection(currentSize);
  }

  for (const button of buttons) {
    button.addEventListener("click", async () => {
      await OBR.tool.setMetadata(TOOL_ID, {
        creatureSize: normalizeCreatureSize(button.dataset.size),
      });

      await loadAndApply();
    });
  }

  await loadAndApply();
});
