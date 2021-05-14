function getPositionX(
  curX: number,
  width: number,
  canvasWidth: number,
  blockSnapSize: number,
  useFloor: boolean
) {
  if (curX < 0) {
    return 0;
  }

  if (curX + width > canvasWidth) {
    return canvasWidth - width;
  }

  if (useFloor) {
    return Math.floor(curX / blockSnapSize) * blockSnapSize;
  } else {
    return Math.round(curX / blockSnapSize) * blockSnapSize;
  }
}

function getPositionY(
  curY: number,
  canvasHeight: number,
  trackOrTileHeight: number,
  useFloor: boolean
) {
  if (curY < 0) {
    return 0;
  }

  if (curY + trackOrTileHeight > canvasHeight) {
    return canvasHeight - trackOrTileHeight;
  }

  if (useFloor) {
    return Math.floor(curY / trackOrTileHeight) * trackOrTileHeight;
  } else {
    return Math.round(curY / trackOrTileHeight) * trackOrTileHeight;
  }
}

export { getPositionX, getPositionY };
