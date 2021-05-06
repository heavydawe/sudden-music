import { KonvaEventObject } from "konva/types/Node";
import { useState } from "react";
import { Layer, Stage, Rect, Line } from "react-konva";
import Note from "./Note";
import { getPositionX, getPositionY } from "../../GetPositionFunctions";
import "./PianoRollCanvas.css";
import { MidiClip, MidiNote, NoteRectProps, Rootstate } from "../../Interfaces";
import { useDispatch, useSelector } from "react-redux";
import { addNewNote, deleteNote, updateNote } from "../../Actions";

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

function getNoteName(tileID: number) {
  switch (tileID % 12) {
    case 0:
      return "C" + Math.trunc(tileID / 12);
    case 1:
      return "C#" + Math.trunc(tileID / 12);
    case 2:
      return "D" + Math.trunc(tileID / 12);
    case 3:
      return "D#" + Math.trunc(tileID / 12);
    case 4:
      return "E" + Math.trunc(tileID / 12);
    case 5:
      return "F" + Math.trunc(tileID / 12);
    case 6:
      return "F#" + Math.trunc(tileID / 12);
    case 7:
      return "G" + Math.trunc(tileID / 12);
    case 8:
      return "G#" + Math.trunc(tileID / 12);
    case 9:
      return "A" + Math.trunc(tileID / 12);
    case 10:
      return "A#" + Math.trunc(tileID / 12);
    case 11:
      return "B" + Math.trunc(tileID / 12);

    default:
      return "Unknown";
  }
}

function getNoteStartTime(offset: number, blockSnapSizeToTick: number) {
  return offset * blockSnapSizeToTick;
}

function getNoteDuration(length: number, blockSnapSizeToTick: number) {
  return length * blockSnapSizeToTick;
}

function getNoteInfo(
  posX: number,
  posY: number,
  length: number,
  tileHeight: number,
  blockSnapSize: number,
  blockSnapSizeToTick: number
) {
  // console.log(posX, posY, length);

  return {
    noteName: getNoteName(119 - posY / tileHeight),
    startTime: getNoteStartTime(posX / blockSnapSize, blockSnapSizeToTick),
    noteDuration: getNoteDuration(length, blockSnapSizeToTick),
  };
}

function getNotePosY(noteName: string, tileHeight: number) {
  let octave: number;
  let note: string;

  if (noteName.length === 3) {
    octave = +noteName[2];
    note = noteName[0] + noteName[1];
  } else {
    octave = +noteName[1];
    note = noteName[0];
  }

  const octaveOffset = (9 - octave) * (tileHeight * 12);

  switch (note) {
    case "B":
      return octaveOffset;
    case "A#":
      return octaveOffset + tileHeight;
    case "A":
      return octaveOffset + tileHeight * 2;
    case "G#":
      return octaveOffset + tileHeight * 3;
    case "G":
      return octaveOffset + tileHeight * 4;
    case "F#":
      return octaveOffset + tileHeight * 5;
    case "F":
      return octaveOffset + tileHeight * 6;
    case "E":
      return octaveOffset + tileHeight * 7;
    case "D#":
      return octaveOffset + tileHeight * 8;
    case "D":
      return octaveOffset + tileHeight * 9;
    case "C#":
      return octaveOffset + tileHeight * 10;
    case "C":
      return octaveOffset + tileHeight * 11;

    default:
      return -1;
  }
}

function getNotePosX(startTime: number, blockSnapSizeToTick: number) {
  return startTime / blockSnapSizeToTick;
}

function getNoteWidth(length: number, blockSnapSizeToTick: number) {
  return length / blockSnapSizeToTick;
}

function initNotes(
  notes: MidiNote[],
  tileHeight: number,
  blockSnapSize: number,
  blockSnapSizeToTick: number
) {
  if (notes.length === 0) {
    return [];
  }

  // Add existing notes from the MIDI clip to curNotesRect state
  let initedNotes: NoteRectProps[] = [];

  notes.forEach((note) => {
    console.log(
      getNotePosX(note.startTime, blockSnapSizeToTick) * blockSnapSize,
      getNotePosY(note.note, tileHeight),
      getNoteWidth(note.length, blockSnapSizeToTick)
    );

    initedNotes.push({
      dataKey: note.dataKey,
      posX: getNotePosX(note.startTime, blockSnapSizeToTick) * blockSnapSize,
      posY: getNotePosY(note.note, tileHeight),
      width: getNoteWidth(note.length, blockSnapSizeToTick),
    });
  });

  return initedNotes;
}

function initDataKey(notes: MidiNote[]) {
  if (notes.length === 0) {
    return 0;
  } else {
    return (
      Math.max.apply(
        Math,
        notes.map((note) => {
          return note.dataKey;
        })
      ) + 1
    );
  }
}

interface Props {
  midiClip: MidiClip;
}

function PianoRollCanvas(props: Props) {
  // TODO: these values have to be responsive, if window resize event fires up, also less hardcoded
  console.log("new MIDI IN CANV", props.midiClip);
  const tileHeight = 25 + 1; // + 1 -> margins and gaps
  
  const numOfBeats = props.midiClip.length; // How many measures long the piano roll should be
  const gridPadding = useSelector((state: Rootstate) => state.pianoRollCanvasProps.gridPadding); // 1 / gridPadding -> density of the grids in a beat
  const midiNoteColor = useSelector((state: Rootstate) => state.pianoRollCanvasProps.midiNoteColor);
  
  const blockSnapSizeToTick = 192 / (gridPadding / 4);
  const dispatch = useDispatch();

  // should be a hardcoded "4", so the first 4 measure will fit on the screen no problem
  const canvasWidth =
    numOfBeats < 4
      ? window.innerWidth -
        61 +
        (numOfBeats * gridPadding -
          ((window.innerWidth - 61) % (numOfBeats * gridPadding)))
      : (window.innerWidth -
          61 +
          (numOfBeats * gridPadding -
            ((window.innerWidth - 61) % (numOfBeats * gridPadding)))) *
        (numOfBeats / 4);
  // TODO: if numOfBeats > 4 then we should use a vertical scrollbar to navigates

  const canvasHeight = tileHeight * 120; //piano tile * number of grid rows

  // TODO: blockSnapSize should be changeable, and the canvas should draw invisible lines to snap to
  //console.log(canvasWidth / (numOfBeats * gridPadding));
  const blockSnapSize = Math.round(canvasWidth / (numOfBeats * gridPadding));

  // only saves starting position and sizes, as the canvas will do the rerendering, no need for state change here
  // only needed for tracking existing notes' keys
  const [curNotesRect, setCurNotesRect] = useState<NoteRectProps[]>(
    initNotes(
      props.midiClip.notes,
      tileHeight,
      blockSnapSize,
      blockSnapSizeToTick
    )
  );

  console.log("PIANO CANVAS RENDER", curNotesRect);

  const [keyGenerator, setKeyGenerator] = useState<number>(
    initDataKey(props.midiClip.notes)
  );
  const [selectedNoteId, selectNoteId] = useState<number>(-1);

  let gridLayerComponents: JSX.Element[] = [];

  for (let i = 0; i <= numOfBeats * gridPadding; i += 1) {
    gridLayerComponents.push(
      <Line
        key={"v_" + i}
        name="line"
        points={[
          i * blockSnapSize + 0.5,
          0,
          i * blockSnapSize + 0.5,
          canvasHeight,
        ]}
        stroke={i % (gridPadding / 4) ? "gray" : "black"} // TODO: If time signature can be changed, then 4 should NOT be hardcoded here
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

  for (let i = 1; i <= numOfBeats / 2; i++) {
    darkMeasureRects.push(
      <Rect
        key={"d_" + i * 2}
        name="darkMeasure"
        x={i * 2 * (canvasWidth / numOfBeats) - canvasWidth / numOfBeats}
        y={0}
        height={canvasHeight}
        width={canvasWidth / numOfBeats}
        fill="#aaa"
        opacity={0.5}
      />
    );
  }

  return (
    <div id="PianoRollCanvas" className="stageClass" key="PianoRollCanvas">
      <Stage
        key="pianoRollBody"
        width={canvasWidth + 2} // + 2 is needed if a note's transform anchor is at the edge, so the user can reach it
        height={canvasHeight}
        onMouseDown={(e) => {
          if (selectedNoteId !== -1) {
            checkDeselect(e, selectNoteId);
          }
        }}
        //onTouchStart={checkDeselect}
        onDblClick={(e) => {
          if (e.target.getAttr("dataKey") === undefined) {
            const transform = e.currentTarget
              .getAbsoluteTransform()
              .copy()
              .invert();
            const pos = e.currentTarget.getStage()!.getPointerPosition()!;

            const posX = getPositionX(
              transform.point(pos).x,
              4 * blockSnapSize,
              canvasWidth,
              blockSnapSize,
              true
            );

            const posY = getPositionY(
              transform.point(pos).y,
              canvasHeight,
              tileHeight,
              true
            );

            setCurNotesRect([
              ...curNotesRect,
              {
                dataKey: keyGenerator,
                posX: posX,
                posY: posY,
                width: 4,
              },
            ]);
            // getNoteInfo(
            //   getPositionX(
            //     transform.point(pos).x,
            //     4 * blockSnapSize,
            //     canvasWidth,
            //     blockSnapSize,
            //     true
            //   ),
            //   getPositionY(
            //     transform.point(pos).y,
            //     canvasHeight,
            //     tileHeight,
            //     true
            //   ),
            //   4,
            //   tileHeight,
            //   blockSnapSize,
            //   blockSnapSizeToTick
            // );

            const newNoteInfo = getNoteInfo(
              posX,
              posY,
              4,
              tileHeight,
              blockSnapSize,
              blockSnapSizeToTick
            );
            dispatch(
              addNewNote({
                midiClipDataKey: props.midiClip.dataKey,
                noteDataKey: keyGenerator,
                trackDataKey: props.midiClip.trackKey,
                type: "ADD",
                newNoteProps: {
                  dataKey: keyGenerator,
                  length: newNoteInfo.noteDuration,
                  note: newNoteInfo.noteName,
                  startTime: newNoteInfo.startTime,
                },
              })
            );
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

              const curDataKey = e.target.getAttr("dataKey");

              const noteToDeleteInfo = getNoteInfo(
                e.target.x(),
                e.target.y(),
                4,
                tileHeight,
                blockSnapSize,
                blockSnapSizeToTick
              );

              dispatch(
                deleteNote({
                  midiClipDataKey: props.midiClip.dataKey,
                  noteDataKey: curDataKey,
                  trackDataKey: props.midiClip.trackKey,
                  type: "DELETE",
                  newNoteProps: {
                    dataKey: curDataKey,
                    length: noteToDeleteInfo.noteDuration,
                    note: noteToDeleteInfo.noteName,
                    startTime: noteToDeleteInfo.startTime,
                  },
                })
              );

              setCurNotesRect(
                curNotesRect.filter(
                  (item) => item.dataKey !== curDataKey
                )
              );
            }
          }}
        >
          {curNotesRect.map((item, i) => {
            return (
              <Note
                key={item.dataKey}
                dataKey={item.dataKey}
                shapeProps={{
                  width: item.width,
                  posX: item.posX,
                  posY: item.posY,
                  color: midiNoteColor,
                }}
                canvasProps={{
                  canvasWidth: canvasWidth,
                  canvasHeight: canvasHeight,
                  blockSnapSize: blockSnapSize,
                  trackOrTileHeight: tileHeight,
                }}
                isSelected={item.dataKey === selectedNoteId}
                handleSelect={() => {
                  if (selectedNoteId !== item.dataKey) {
                    selectNoteId(item.dataKey);
                  }
                }}
                changeSize={(newSize) => {
                  if (newSize === curNotesRect[i].width) {
                    return;
                  }

                  const newCurNotesRect = curNotesRect.slice();
                  newCurNotesRect[i].width = newSize;
                  const noteToUpdateInfo = getNoteInfo(
                    newCurNotesRect[i].posX,
                    newCurNotesRect[i].posY,
                    newSize,
                    tileHeight,
                    blockSnapSize,
                    blockSnapSizeToTick
                  );

                  dispatch(
                    updateNote({
                      midiClipDataKey: props.midiClip.dataKey,
                      noteDataKey: newCurNotesRect[i].dataKey,
                      trackDataKey: props.midiClip.trackKey,
                      type: "UPDATE",
                      newNoteProps: {
                        dataKey: newCurNotesRect[i].dataKey,
                        length: noteToUpdateInfo.noteDuration,
                        note: noteToUpdateInfo.noteName,
                        startTime: noteToUpdateInfo.startTime,
                      },
                    })
                  );

                  setCurNotesRect(newCurNotesRect);
                }}
                changePos={(newPosX: number, newPosY: number) => {
                  if (
                    newPosX === curNotesRect[i].posX &&
                    newPosY === curNotesRect[i].posY
                  ) {
                    return;
                  }

                  const newCurNotesRect = curNotesRect.slice();
                  newCurNotesRect[i].posX = newPosX;
                  newCurNotesRect[i].posY = newPosY;

                  const noteToUpdateInfo = getNoteInfo(
                    newPosX,
                    newPosY,
                    newCurNotesRect[i].width,
                    tileHeight,
                    blockSnapSize,
                    blockSnapSizeToTick
                  );

                  dispatch(
                    updateNote({
                      midiClipDataKey: props.midiClip.dataKey,
                      noteDataKey: newCurNotesRect[i].dataKey,
                      trackDataKey: props.midiClip.trackKey,
                      type: "UPDATE",
                      newNoteProps: {
                        dataKey: newCurNotesRect[i].dataKey,
                        length: noteToUpdateInfo.noteDuration,
                        note: noteToUpdateInfo.noteName,
                        startTime: noteToUpdateInfo.startTime,
                      },
                    })
                  );

                  setCurNotesRect(newCurNotesRect);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default PianoRollCanvas;
