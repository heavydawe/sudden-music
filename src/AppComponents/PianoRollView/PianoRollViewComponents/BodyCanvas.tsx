import React, { useState } from "react";
import { Layer, Stage, Rect, Line } from "react-konva";

function BodyCanvas() {
  // TODO: these values have to be responsive, if window resize event fires up, also less hardcoded
  const tileHeight = 25 + 1; // + 1 -> margins and gaps
  const numOfMeasures = 4; // How many measures long the piano roll should be
  const gridPadding = 16; // 1 / gridPadding -> density of the grids

  // should be a hardcoded "4", so the first 4 measure will fit on the screen no porblem
  const canvasWidth = (window.innerWidth - 61) - ((window.innerWidth - 61) % 4);
  // TODO: if numOfMeasures > 4 then we should use a vertical scrollbar to navigate
    
  const canvasHeight = tileHeight * 120; //piano tile * number of grid rows

  // TODO: blockSnapSize should be changeable, and the canvas should draw invisible lines to snap to
  const blockSnapSize = Math.round(canvasWidth / (numOfMeasures * gridPadding));
  const [curNotesRect, setCurNotesRect] = useState([
    <Rect
      name="draggableNote"
      x={0}
      y={0}
      height={tileHeight}
      width={50}
      fill="green"
      draggable
    ></Rect>,
  ]);

  let gridLayerComponents: JSX.Element[] = [];

  for (let i = 0; i < canvasWidth; i += blockSnapSize) {
    gridLayerComponents.push(
      <Line
        points={[i + 0.5, 0, i + 0.5, canvasHeight]}
        stroke="gray"
        strokeWidth={1}
      />
    );
  }

  for (let i = 0; i < canvasHeight; i += tileHeight) {
    gridLayerComponents.push(
      <Line points={[0, i, canvasWidth, i]} stroke="gray" strokeWidth={1} />
    );
  }

  // const shadowNote = (
  //   <Rect
  //     x={0}
  //     y={0}
  //     width={blockSnapSize * 6}
  //     height={blockSnapSize * 3}
  //     fill="#FF7B17"
  //     opacity={0.6}
  //     stroke="#CF6412"
  //     strokeWidth={3}
  //   />
  // );

  function getPositionX(curX: number, width: number) {
    if (curX < 0) {
      return 0;
    }

    if (curX + width > canvasWidth) {
      return canvasWidth - width;
    }

    return Math.round(curX / blockSnapSize) * blockSnapSize;
  }

  function getPositionY(curY: number) {
    if (curY < 0) {
      return 0;
    }

    if (curY + tileHeight > canvasHeight) {
      return canvasHeight - tileHeight;
    }

    return Math.round(curY / tileHeight) * tileHeight;
  }

  function makeNewNote(x: number, y: number, size: number) {
    let newNote = (
      <Rect
        x={x}
        y={y}
        width={size * blockSnapSize}
        height={tileHeight}
        fill="green"
        strokeWidth={1}
        stroke="gray"
        draggable={true}
        cornerRadius={10}
        // onDragStart={(e) => {
        //   shadowNote.show();
        //   shadowNote.moveToTop();
        //   e.target.moveToTop();
        // }}
        onDragEnd={(e) => {
          e.target.position({
            x: getPositionX(e.target.x(), e.target.width()),
            y: getPositionY(e.target.y()),
          });
          // shadowNote.hide();
        }}
        // onDragMove={(e) => {
        //   console.log(e.target.x() + ": " + e.target.y())
        // }}
        // onDragMove={(e) => {
        //   shadowNote.position({
        //     x:
        //       e.target.x() < 0
        //         ? e.target.x() + e.target.width() > canvasWidth
        //           ? canvasWidth - e.target.width()
        //           : Math.round(e.target.x() / blockSnapSize) * blockSnapSize
        //         : Math.round(e.target.x() / blockSnapSize) * blockSnapSize,
        //     y:
        //       e.target.y() < 0
        //         ? 0
        //         : Math.round(e.target.y() / tileHeight) * tileHeight,
        //   });

        //   shadowNote.show();
        // }}
      />
    );

    return newNote;
  }

  let darkMeasureRects: JSX.Element[] = [];

  for (let i = 1; i <= numOfMeasures / 2; i++) {
    darkMeasureRects.push(
      <Rect
        x={i * 2 * (canvasWidth / numOfMeasures) - canvasWidth / numOfMeasures}
        y={0}
        height={canvasHeight}
        width={canvasWidth / numOfMeasures}
        fill="#aaa"
      />
    );
  }

  let notes: JSX.Element[] = [];

  notes.push(makeNewNote(0, 0, 3));
  notes.push(makeNewNote(100, 100, 3));

  return (
    <Stage key="pianoRollBody" width={canvasWidth} height={canvasHeight}>
      <Layer key="measureLayer">{darkMeasureRects}</Layer>
      <Layer key="gridLayer">{gridLayerComponents}</Layer>
      <Layer key="ghosNoteLayer"></Layer>
      <Layer key="notesLayer">{notes}</Layer>
    </Stage>
  );
}

export default BodyCanvas;
