import OBR from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";

const EMANATION_OPTIONS = [
  5, 10, 15, 20, 25, 30,
  35, 40, 45, 50, 55, 60,
  80, 90, 100, 120,
];

const BURST_OPTIONS = [
  5, 10, 15, 20, 25, 30,
  35, 40, 45, 50, 55, 60,
];

const CONE_OPTIONS = [5, 10, 15, 20, 30, 40, 50, 60, 80];
const LINE_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 80, 100, 120];

OBR.onReady(async () => {
  const container = document.getElementById("options");
  const note = document.getElementById("note");

  if (!container) {
    throw new Error("radius-picker.html is missing #options");
  }

  function makeButton(feet) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.feet = String(feet);
    button.textContent = `${feet} ft`;
    return button;
  }

  function applySelection(currentFeet) {
    const buttons = Array.from(container.querySelectorAll("button[data-feet]"));

    for (const button of buttons) {
      const selected = Number(button.dataset.feet) === currentFeet;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    }
  }

  async function render() {
    const metadata = await OBR.tool.getMetadata(TOOL_ID);
    const activeMode = await OBR.tool.getActiveToolMode();

    let options;
    let metadataKey;
    let noteText;

    if (activeMode === `${ID}/mode/burst`) {
      options = BURST_OPTIONS;
      metadataKey = "burstFeet";
      noteText = "Burst uses intersection-centered templates.";
    } else if (activeMode === `${ID}/mode/cone`) {
      options = CONE_OPTIONS;
      metadataKey = "coneFeet";
      noteText = "Cone uses intersection-centered templates.";
    } else if (activeMode === `${ID}/mode/line`) {
      options = LINE_OPTIONS;
      metadataKey = "lineFeet";
      noteText = "Line uses intersection-centered templates.";
    } else {
      options = EMANATION_OPTIONS;
      metadataKey = "emanationFeet";
      noteText = "Emanation uses creature footprint templates.";
    }

    const storedFeet = metadata[metadataKey];

    const currentFeet =
      typeof storedFeet === "number" && options.includes(storedFeet)
        ? storedFeet
        : options[0];

    container.innerHTML = "";

    for (const feet of options) {
      const button = makeButton(feet);

      button.addEventListener("click", async () => {
        await OBR.tool.setMetadata(TOOL_ID, {
          [metadataKey]: feet,
        });
        await render();
      });

      container.appendChild(button);
    }

    if (note) {
      note.textContent = noteText;
    }

    applySelection(currentFeet);
  }

  await render();
});
