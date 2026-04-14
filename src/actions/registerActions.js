import OBR from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";

const RADIUS_ACTION_ID = `${ID}/action/radius`;
const COLOR_ACTION_ID = `${ID}/action/color`;
const CLEAR_MY_TEMPLATES_ACTION_ID = `${ID}/action/clear-my-templates`;
const SIZE_ACTION_ID = `${ID}/action/size`;
const CONE_DIRECTION_ACTION_ID = `${ID}/action/cone-direction`;
const LINE_DIRECTION_ACTION_ID = `${ID}/action/line-direction`;

const EMANATION_MODE_ID = `${ID}/mode/emanation`;
const BURST_MODE_ID = `${ID}/mode/burst`;
const CONE_MODE_ID = `${ID}/mode/cone`;
const LINE_MODE_ID = `${ID}/mode/line`;
const CLEANUP_MODE_ID = `${ID}/mode/cleanup`;

let radiusActionVisible = false;
let colorActionVisible = false;
let sizeActionVisible = false;
let coneDirectionActionVisible = false;
let lineDirectionActionVisible = false;
let clearMyTemplatesActionVisible = false;

async function createRadiusAction() {
  await OBR.tool.createAction({
    id: RADIUS_ACTION_ID,
    icons: [
      {
        icon: "/radius.svg",
        label: "Template Radius",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],
    onClick(_, elementId) {
      OBR.popover.open({
        id: `${ID}/popover/radius`,
        url: "/radius-picker.html",
        anchorReference: "ELEMENT",
        anchorElementId: elementId,
        anchorOrigin: { horizontal: "CENTER", vertical: "BOTTOM" },
        transformOrigin: { horizontal: "CENTER", vertical: "TOP" },
        width: 260,
        height: 420,
      });
    },
  });
}

async function createColorAction() {
  await OBR.tool.createAction({
    id: COLOR_ACTION_ID,
    icons: [
      {
        icon: "/color.svg",
        label: "Template Color",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],
    onClick(_, elementId) {
      OBR.popover.open({
        id: `${ID}/popover/color`,
        url: "/color-picker.html",
        anchorReference: "ELEMENT",
        anchorElementId: elementId,
        anchorOrigin: { horizontal: "CENTER", vertical: "BOTTOM" },
        transformOrigin: { horizontal: "CENTER", vertical: "TOP" },
        width: 240,
        height: 180,
      });
    },
  });
}

async function createSizeAction() {
  await OBR.tool.createAction({
    id: SIZE_ACTION_ID,
    icons: [
      {
        icon: "/size.svg",
        label: "Creature Size",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],
    onClick(_, elementId) {
      OBR.popover.open({
        id: `${ID}/popover/size`,
        url: "/size-picker.html",
        anchorReference: "ELEMENT",
        anchorElementId: elementId,
        anchorOrigin: { horizontal: "CENTER", vertical: "BOTTOM" },
        transformOrigin: { horizontal: "CENTER", vertical: "TOP" },
        width: 240,
        height: 220,
      });
    },
  });
}

async function createConeDirectionAction() {
  await OBR.tool.createAction({
    id: CONE_DIRECTION_ACTION_ID,
    icons: [
      {
        icon: "/icon.svg",
        label: "Cone Direction",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],
    onClick(_, elementId) {
      OBR.popover.open({
        id: `${ID}/popover/cone-direction`,
        url: "/cone-direction-picker.html",
        anchorReference: "ELEMENT",
        anchorElementId: elementId,
        anchorOrigin: { horizontal: "CENTER", vertical: "BOTTOM" },
        transformOrigin: { horizontal: "CENTER", vertical: "TOP" },
        width: 344,
        height: 404,
      });
    },
  });
}

async function createLineDirectionAction() {
  await OBR.tool.createAction({
    id: LINE_DIRECTION_ACTION_ID,
    icons: [
      {
        icon: "/icon.svg",
        label: "Line Direction",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],
    onClick(_, elementId) {
      OBR.popover.open({
        id: `${ID}/popover/line-direction`,
        url: "/line-direction-picker.html",
        anchorReference: "ELEMENT",
        anchorElementId: elementId,
        anchorOrigin: { horizontal: "CENTER", vertical: "BOTTOM" },
        transformOrigin: { horizontal: "CENTER", vertical: "TOP" },
        width: 344,
        height: 404,
      });
    },
  });
}

async function createClearMyTemplatesAction() {
  await OBR.tool.createAction({
    id: CLEAR_MY_TEMPLATES_ACTION_ID,
    icons: [
      {
        icon: "/trash-2.svg",
        label: "Clear My Templates",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],
    onClick(_, elementId) {
      OBR.popover.open({
        id: `${ID}/popover/confirm-clear-my-templates`,
        url: "/confirm-clear-my-templates.html",
        anchorReference: "ELEMENT",
        anchorElementId: elementId,
        anchorOrigin: { horizontal: "CENTER", vertical: "BOTTOM" },
        transformOrigin: { horizontal: "CENTER", vertical: "TOP" },
        width: 320,
        height: 150,
      });
    },
  });
}

async function syncModeActions(modeId) {
  const isCleanupMode = modeId === CLEANUP_MODE_ID;
  const isPlacementMode =
    modeId === EMANATION_MODE_ID ||
    modeId === BURST_MODE_ID ||
    modeId === CONE_MODE_ID ||
    modeId === LINE_MODE_ID;

  const shouldShowRadius = isPlacementMode;
  const shouldShowColor = isPlacementMode;
  const shouldShowSize = modeId === EMANATION_MODE_ID;
  const shouldShowConeDirection = modeId === CONE_MODE_ID;
  const shouldShowLineDirection = modeId === LINE_MODE_ID;
  const shouldShowClearMyTemplates = isCleanupMode;

  if (shouldShowRadius !== radiusActionVisible) {
    radiusActionVisible = shouldShowRadius;
    await OBR.tool.removeAction(RADIUS_ACTION_ID);

    if (shouldShowRadius) {
      await createRadiusAction();
    }
  }

  if (shouldShowColor !== colorActionVisible) {
    colorActionVisible = shouldShowColor;
    await OBR.tool.removeAction(COLOR_ACTION_ID);

    if (shouldShowColor) {
      await createColorAction();
    }
  }

  if (shouldShowSize !== sizeActionVisible) {
    sizeActionVisible = shouldShowSize;
    await OBR.tool.removeAction(SIZE_ACTION_ID);

    if (shouldShowSize) {
      await createSizeAction();
    }
  }

  if (shouldShowConeDirection !== coneDirectionActionVisible) {
    coneDirectionActionVisible = shouldShowConeDirection;
    await OBR.tool.removeAction(CONE_DIRECTION_ACTION_ID);

    if (shouldShowConeDirection) {
      await createConeDirectionAction();
    }
  }

  if (shouldShowLineDirection !== lineDirectionActionVisible) {
    lineDirectionActionVisible = shouldShowLineDirection;
    await OBR.tool.removeAction(LINE_DIRECTION_ACTION_ID);

    if (shouldShowLineDirection) {
      await createLineDirectionAction();
    }
  }

  if (shouldShowClearMyTemplates !== clearMyTemplatesActionVisible) {
    clearMyTemplatesActionVisible = shouldShowClearMyTemplates;
    await OBR.tool.removeAction(CLEAR_MY_TEMPLATES_ACTION_ID);

    if (shouldShowClearMyTemplates) {
      await createClearMyTemplatesAction();
    }
  }
}

export async function registerToolActions() {
  const activeMode = await OBR.tool.getActiveToolMode();
  await syncModeActions(activeMode);

  OBR.tool.onToolModeChange(async (modeId) => {
    await syncModeActions(modeId);
  });
}