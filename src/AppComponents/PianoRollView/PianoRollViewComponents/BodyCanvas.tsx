import { KonvaEventObject } from "konva/types/Node";
import { useState } from "react";
import { Layer, Stage, Rect, Line } from "react-konva";
import Note from "./Note";

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
  const [curNotes, setCurNotes] = useState<
    { key: number; x: number; y: number; size: number }[]
  >([]);
  const [keyGenerator, setKeyGenerator] = useState<number>(0);
  const [selectedNoteId, selectNoteId] = useState<string>("");

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // deselect when clicked on empty area
    if (
      e.target === e.target.getStage() ||
      e.target.getAttr("name") === "darkMeasure" ||
      e.target.getAttr("name") === "line"
    ) {
      selectNoteId("");
    }
  };

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
    <Stage
      key="pianoRollBody"
      width={canvasWidth + 2}
      height={canvasHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      onDblClick={(e) => {
        const transform = e.currentTarget
          .getAbsoluteTransform()
          .copy()
          .invert();
        const pos = e.currentTarget.getStage()!.getPointerPosition()!;
        setCurNotes([
          ...curNotes,
          {
            key: keyGenerator,
            x: transform.point(pos).x,
            y: transform.point(pos).y,
            size: 4,
          },
        ]);
        setKeyGenerator(keyGenerator + 1);
      }}
      onContextMenu={(e) => {
        e.evt.preventDefault();
      }}
    >
      <Layer key="measureLayer">{darkMeasureRects}</Layer>
      <Layer key="gridLayer">{gridLayerComponents}</Layer>
      {/* <Layer key="ghosNoteLayer"></Layer> */}
      <Layer
        key="notesLayer"
        onClick={(e) => {
          if (e.evt.button === 2) {
            setCurNotes(
              curNotes.filter(
                (item) => item.key.toString() !== e.target.getAttr("data-key")
              )
            );
          }
        }}
      >
        {curNotes.map((item, i) => {
          return (
            <Note
              key={item.key}
              id={item.key.toString()}
              shapeProps={{
                size: item.size,
                x: item.x,
                y: item.y,
              }}
              canvasProps={{
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                blockSnapSize: blockSnapSize,
                tileHeight: tileHeight,
              }}
              isSelected={item.key.toString() === selectedNoteId}
              handleSelect={() => {
                selectNoteId(item.key.toString());
              }}
              changeSize={(newSize) => {
                const newCurNotes = curNotes.slice();
                newCurNotes[i].size = newSize;
                setCurNotes(newCurNotes);
              }}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}

export default BodyCanvas;
