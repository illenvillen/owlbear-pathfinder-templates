import OBR from "@owlbear-rodeo/sdk";
import { ID, TOOL_ID } from "../tool.js";

const SIZE_ACTION_ID = `${ID}/action/size`;
const CONE_DIRECTION_ACTION_ID = `${ID}/action/cone-direction`;
const LINE_DIRECTION_ACTION_ID = `${ID}/action/line-direction`;

let sizeActionVisible = false;
let coneDirectionActionVisible = false;
let lineDirectionActionVisible = false;

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
        width: 240,
        height: 240,
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

async function syncModeActions(modeId) {
  const shouldShowSize = modeId === `${ID}/mode/emanation`;
  const shouldShowConeDirection = modeId === `${ID}/mode/cone`;
  const shouldShowLineDirection = modeId === `${ID}/mode/line`;

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
}

export async function registerToolActions() {
  await OBR.tool.createAction({
    id: `${ID}/action/radius`,
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

  await OBR.tool.createAction({
    id: `${ID}/action/color`,
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

  const activeMode = await OBR.tool.getActiveToolMode();
  await syncModeActions(activeMode);

  OBR.tool.onToolModeChange(async (modeId) => {
    await syncModeActions(modeId);
  });
}
