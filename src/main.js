import OBR from "@owlbear-rodeo/sdk";
import { createTool } from "./tool.js";
import { registerEmanationMode } from "./modes/mode-emanation.js";
import { registerBurstMode } from "./modes/mode-burst.js";
import { registerConeMode } from "./modes/mode-cone.js";
import { registerLineMode } from "./modes/mode-line.js";
import { registerCleanupMode } from "./modes/mode-cleanup.js";
import { registerToolActions } from "./actions/registerActions.js";

OBR.onReady(async () => {
  await createTool();
  registerEmanationMode();
  registerBurstMode();
  registerConeMode();
  registerLineMode();
  registerCleanupMode();
  await registerToolActions();
});
