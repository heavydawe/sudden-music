import { KonvaEventObject } from "konva/types/Node";
import { useState } from "react";
import { Layer, Stage, Rect, Line } from "react-konva";
import Note from "./Note";

function checkDeselect(
  e: KonvaEventObject<MouseEvent | TouchEvent>,
  selectNoteId: React.Dispatch<React.SetStateAction<number>>
) {
  // deselect when clicked on empty area
  if (
    e.target === e.target.getStage() ||
    e.target.getAttr("name") === "darkMeasure" ||
    e.target.getAttr("name") === "line"
  ) {
    selectNoteId(-1);
  }
}

function getNoteInfo(posX: number, posY: number, length: number) {
  console.log(posX, posY, length);
}

function BodyCanvas() {
  // TODO: these values have to be responsive, if window resize event fires up, also less hardcoded
  const tileHeight = 25 + 1; // + 1 -> margins and gaps
  const numOfMeasures = 4; // How many measures long the piano roll should be
  const gridPadding = 16; // 1 / gridPadding -> density of the grids

  // should be a hardcoded "4", so the first 4 measure will fit on the screen no porblem
  const canvasWidth = window.innerWidth - 61 - ((window.innerWidth - 61) % 4);
  // TODO: if numOfMeasures > 4 then we should use a vertical scrollbar to navigate

  const canvasHeight = tileHeight * 120; //piano tile * number of grid rows

  // TODO: blockSnapSize should be changeable, and the canvas should draw invisible lines to snap to
  const blockSnapSize = Math.round(canvasWidth / (numOfMeasures * gridPadding));

  // only saves starting position and sizes, as the canvas will do the rerendering, no need for state change here
  // only needed for tracking existing notes' keys
  const [curNotes, setCurNotes] = useState<
    {
      dataKey: number;
      startPosX: number;
      startPosY: number;
      startSize: number;
    }[]
  >([]);

  const [keyGenerator, setKeyGenerator] = useState<number>(0);
  const [selectedNoteId, selectNoteId] = useState<number>(-1);

  let gridLayerComponents: JSX.Element[] = [];

  for (let i = 0; i <= canvasWidth; i += blockSnapSize) {
    gridLayerComponents.push(
      <Line
        key={"v_" + i}
        name="line"
        points={[i + 0.5, 0, i + 0.5, canvasHeight]}
        stroke={i % 4 ? "gray" : "black"} // TODO: If time signature can be changed, then 4 should NOT be hardcoded here
        strokeWidth={i % 4 ? 1 : 1.5}
      />
    );
  }

  for (let i = 0; i < canvasHeight; i += tileHeight) {
    gridLayerComponents.push(
      <Line
        key={"h_" + i}
        name="line"
        points={[0, i, canvasWidth, i]}
        stroke="gray"
        strokeWidth={1}
      />
    );
  }

  let darkMeasureRects: JSX.Element[] = [];

  for (let i = 1; i <= numOfMeasures / 2; i++) {
    darkMeasureRects.push(
      <Rect
        key={"d_" + i * 2}
        name="darkMeasure"
        x={i * 2 * (canvasWidth / numOfMeasures) - canvasWidth / numOfMeasures}
        y={0}
        height={canvasHeight}
        width={canvasWidth / numOfMeasures}
        fill="#aaa"
      />
    );
  }

  return (
    <div id="BodyCanvas" className="BodyCanvas" key="BodyCanvas">
      <Stage
        key="pianoRollBody"
        width={canvasWidth + 2} // + 2 is needed if a note's transform anchor is at the edge, so the user can reach it
        height={canvasHeight}
        onMouseDown={(e) => checkDeselect(e, selectNoteId)}
        //onTouchStart={checkDeselect}
        onDblClick={(e) => {
          if (e.target.getAttr("dataKey") === undefined) {
            const transform = e.currentTarget
              .getAbsoluteTransform()
              .copy()
              .invert();
            const pos = e.currentTarget.getStage()!.getPointerPosition()!;
            setCurNotes([
              ...curNotes,
              {
                dataKey: keyGenerator,
                startPosX: transform.point(pos).x,
                startPosY: transform.point(pos).y,
                startSize: 4,
              },
            ]);
            setKeyGenerator(keyGenerator + 1);
          }
        }}
        onContextMenu={(e) => {
          e.evt.preventDefault();
        }}
      >
        <Layer key="measureLayer">{darkMeasureRects}</Layer>
        <Layer key="gridLayer">{gridLayerComponents}</Layer>
        <Layer
          key="notesLayer"
          onClick={(e) => {
            if (e.evt.button === 2) {
              setCurNotes(
                curNotes.filter(
                  (item) => item.dataKey !== e.target.getAttr("dataKey")
                )
              );
            }
          }}
        >
          {curNotes.map((item, i) => {
            return (
              <Note
                key={item.dataKey}
                dataKey={item.dataKey}
                shapeProps={{
                  size: item.startSize,
                  x: item.startPosX,
                  y: item.startPosY,
                }}
                canvasProps={{
                  canvasWidth: canvasWidth,
                  canvasHeight: canvasHeight,
                  blockSnapSize: blockSnapSize,
                  tileHeight: tileHeight,
                }}
                isSelected={item.dataKey === selectedNoteId}
                handleSelect={() => {
                  selectNoteId(item.dataKey);
                }}
                changeSize={(newSize) => {
                  const newCurNotes = curNotes.slice();
                  newCurNotes[i].startSize = newSize;
                  setCurNotes(newCurNotes);
                }}
                getNoteInfo={getNoteInfo}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default BodyCanvas;
