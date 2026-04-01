import OBR from "@owlbear-rodeo/sdk";

async function getSquareGridState() {
  const ready = await OBR.scene.isReady();
  if (!ready) return null;

  const gridType = await OBR.scene.grid.getType();
  if (gridType !== "SQUARE") return null;

  const dpi = await OBR.scene.grid.getDpi();
  const scale = await OBR.scene.grid.getScale();

  return { dpi, scale };
}

export async function getSnappedOrigin(pointerPosition, originWidth = 1, originHeight = 1) {
  const gridState = await getSquareGridState();
  if (!gridState) return null;

  const evenFootprint = originWidth % 2 === 0 || originHeight % 2 === 0;

  const snappedCenter = await OBR.scene.grid.snapPosition(
    pointerPosition,
    1,
    evenFootprint,
    !evenFootprint
  );

  return { snappedCenter, dpi: gridState.dpi, scale: gridState.scale };
}

export async function getSnappedIntersection(pointerPosition) {
  const gridState = await getSquareGridState();
  if (!gridState) return null;

  const snappedCenter = await OBR.scene.grid.snapPosition(
    pointerPosition,
    1,
    true,
    false
  );

  return { snappedCenter, dpi: gridState.dpi, scale: gridState.scale };
}
