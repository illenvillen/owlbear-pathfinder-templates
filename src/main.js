import OBR from "@owlbear-rodeo/sdk";
import { createTool } from "./tool.js";
import { registerEmanationMode } from "./modes/emanation.js";
import { registerBurstMode } from "./modes/burst.js";
import { registerConeMode } from "./modes/cone.js";
import { registerLineMode } from "./modes/line.js";
import { registerToolActions } from "./actions/registerActions.js";

OBR.onReady(async () => {
  await createTool();
  registerEmanationMode();
  registerBurstMode();
  registerConeMode();
  registerLineMode();
  await registerToolActions();
});
