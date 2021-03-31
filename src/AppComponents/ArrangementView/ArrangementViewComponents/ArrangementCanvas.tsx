import { Stage, Line, Layer, Rect } from "react-konva";
import { KonvaEventObject } from "konva/types/Node";
import { useState } from "react";
import MidiClip from "./MidiClip";
import { getPositionX, getPositionY } from '../../GetPositionFunctions';
import './ArrangementCanvas.css';

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

function ArrangementCanvas() {
  // TODO: these values have to be responsive, if window resize event fires up, also less hardcoded
  const trackHeight = 100 + 2; // + 1 -> margins and gaps
  const numOfTracks = 2;
  const numOfMeasures = 4; // How many measures long the piano roll should be
  const gridPadding = 16; // 1 / gridPadding -> density of the grids

  // should be a hardcoded "4", so the first 4 measure will fit on the screen no problem
  const canvasWidth = window.innerWidth - 61 - ((window.innerWidth - 61) % 4);
  // TODO: if numOfMeasures > 4 then we should use a vertical scrollbar to navigate

  const canvasHeight = trackHeight * numOfTracks + 1; //only show the neccessary ammount of rows

  // TODO: blockSnapSize should be changeable, and the canvas should draw invisible lines to snap to
  const blockSnapSize = Math.round(canvasWidth / (numOfMeasures * gridPadding));

  const [midiKeyGenerator, setMidiKeyGenerator] = useState<number>(0);
  const [selectedMidiClipId, selectMidiClipId] = useState<number>(-1);
  const [curMidiClips, setCurMidiClips] = useState<
    {
      dataKey: number;
      midiClipName: string;
      posX: number;
      posY: number;
      size: number;
      midiNotes: {
        startTime: string;
        length: string;
        note: string;
      }[];
    }[]
  >([]);

  let gridLines: JSX.Element[] = [];

  for (let i = 0; i <= canvasWidth; i += blockSnapSize) {
    gridLines.push(
      <Line
        key={"arrangeV_" + i}
        name="line"
        points={[i + 0.5, 0, i + 0.5, canvasHeight]}
        stroke={i % 4 ? "gray" : "black"} // TODO: If time signature can be changed, then 4 should NOT be hardcoded here
        strokeWidth={i % 4 ? 1 : 1.5}
      />
    );
  }

  for (let i = 0; i < canvasHeight; i += trackHeight) {
    gridLines.push(
      <Line
        key={"arrangeH_" + i}
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
        opacity={0.5}
      />
    );
  }

  return (
    <div key="arrangementCanvas" className="stageClass">
      <Stage
        key="arrangementStage"
        width={canvasWidth + 2} // + 2 is needed if a note's transform anchor is at the edge, so the user can reach it
        height={canvasHeight}
        onMouseDown={(e) => checkDeselect(e, selectMidiClipId)}
        //onTouchStart={checkDeselect}
        onDblClick={(e) => {

          // Adding new MIDI clip
          if (e.target.getAttr("dataKey") === undefined) {
            const transform = e.currentTarget
              .getAbsoluteTransform()
              .copy()
              .invert();
            const pos = e.currentTarget.getStage()!.getPointerPosition()!;
            setCurMidiClips([
              ...curMidiClips,
              {
                dataKey: midiKeyGenerator,
                midiClipName: "midiClip_1",
                posX: getPositionX(
                  transform.point(pos).x,
                  4 * blockSnapSize,
                  canvasWidth,
                  blockSnapSize,
                  true
                ),
                posY: getPositionY(
                  transform.point(pos).y,
                  canvasHeight,
                  trackHeight,
                  true
                ),
                size: 4,
                midiNotes: [],
              },
            ]);

            setMidiKeyGenerator(midiKeyGenerator + 1);
          }
        }}
        onContextMenu={(e) => {
          e.evt.preventDefault();
        }}
      >
        <Layer key="arrangementDarkMeasures">{darkMeasureRects}</Layer>
        <Layer key="arrangementGridLines">{gridLines}</Layer>
        <Layer
          key="arrangementMidiClips"
          onClick={(e) => {
            if (e.evt.button === 2) {
              setCurMidiClips(
                curMidiClips.filter(
                  (item) => item.dataKey !== e.target.getAttr("dataKey")
                )
              );
            }
          }}
        >
          {curMidiClips.map((item, i) => {
            return (
              <MidiClip
                key={item.dataKey}
                dataKey={item.dataKey}
                midiClipName={item.midiClipName}
                midiNotes={item.midiNotes}
                shapeProps={{
                  posX: item.posX,
                  posY: item.posY,
                  size: item.size,
                }}
                isSelected={item.dataKey === selectedMidiClipId}
                handleSelect={() => {
                  selectMidiClipId(item.dataKey);
                }}
                changeSize={(newSize) => {
                  const newCurNotes = curMidiClips.slice();
                  newCurNotes[i].size = newSize;
                  setCurMidiClips(newCurNotes);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default ArrangementCanvas;
