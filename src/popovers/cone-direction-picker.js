import OBR from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../tool.js";

const VALID_DIRECTIONS = new Set([
  "N", "E", "S", "W",
  "NE", "NW", "SE", "SW",
]);

function normalizeDirection(value) {
  return VALID_DIRECTIONS.has(value) ? value : "NE";
}

OBR.onReady(async () => {
  const buttons = Array.from(
    document.querySelectorAll("button[data-direction]")
  );

  function applySelection(direction) {
    for (const button of buttons) {
      const selected = button.dataset.direction === direction;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    }
  }

  async function loadAndApply() {
    const metadata = await OBR.tool.getMetadata(TOOL_ID);
    const currentDirection = normalizeDirection(metadata.coneDirection);
    applySelection(currentDirection);
  }

  for (const button of buttons) {
    button.addEventListener("click", async () => {
      await OBR.tool.setMetadata(TOOL_ID, {
        coneDirection: normalizeDirection(button.dataset.direction),
      });

      await loadAndApply();
    });
  }

  await loadAndApply();
});
