// const tileHeight = 25 + 1; // + 1 -> margins and gaps
// const numOfMeasures = 4; // How many measures long the piano roll should be
// const gridPadding = 16; // 1 / gridPadding -> density of the grids

// // should be a hardcoded "4", so the first 4 measure will fit on the screen no porblem
// const canvasWidth = window.innerWidth - 61 - ((window.innerWidth - 61) % 4);
// // TODO: if numOfMeasures > 4 then we should use a vertical scrollbar to navigate

// const canvasHeight = tileHeight * 120; //piano tile * number of grid rows

// // TODO: blockSnapSize should be changeable, and the canvas should draw invisible lines to snap to
// const blockSnapSize = Math.round(canvasWidth / (numOfMeasures * gridPadding));


const pianoRollCanvasProps = {
  tileHeight: 25 + 1,
  canvasWidth: window.innerWidth - 61 - ((window.innerWidth - 61) % 4),
  canvasHeight: (25 + 1) * 120,
}

const arrangementViewCanvasProps = {
  trackHeight: 100 + 2,
  canvasWidth: window.innerWidth - 61 - ((window.innerWidth - 61) % 4),
}

export {
  pianoRollCanvasProps,
  arrangementViewCanvasProps
}