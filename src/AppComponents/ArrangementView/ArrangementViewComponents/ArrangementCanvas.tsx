import { Stage, Line, Layer, Rect } from "react-konva";
import { useEffect, useRef, useState } from "react";
import MidiClip from "./MidiClip";
import { getPositionX, getPositionY } from "../../GetPositionFunctions";
import {
  MidiClip as MidiClipInterface,
  MidiClipRectProps,
  MidiNote,
  Rootstate,
} from "../../Interfaces";
import "./ArrangementCanvas.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewMidiClip,
  selectMidiClip,
  deselectMidiClip,
  deleteMidiClip,
  updateMidiClip,
  changeTransportPosition,
} from "../../Actions";
import Konva from "konva";
import * as Tone from "tone";
import React from "react";

function getMidiClipStartTime(
  posX: number,
  blockSnapSize: number,
  blockSnapSizeToTick: number
) {
  return (posX / blockSnapSize) * blockSnapSizeToTick;
}

function getMidiClipTrackKey(posY: number, trackHeight: number) {
  return posY / trackHeight;
}

function getMidiClipFromRect(
  midiClipRect: MidiClipRectProps,
  midiClipNotes: MidiNote[],
  trackHeight: number,
  blockSnapSize: number,
  blockSnapSizeToTick: number
): MidiClipInterface {
  return {
    dataKey: midiClipRect.dataKey,
    trackKey: getMidiClipTrackKey(midiClipRect.posY, trackHeight),
    startTime: getMidiClipStartTime(
      midiClipRect.posX,
      blockSnapSize,
      blockSnapSizeToTick
    ),
    length: midiClipRect.width,
    notes: midiClipNotes,
  };
}

function initMidiClipRects(
  midiClips: MidiClipPos[],
  blockSnapSize: number,
  blockSnapSizeToTick: number,
  trackHeight: number
) {
  const initedMidiClips = midiClips.map((midiClip) => {
    return {
      dataKey: midiClip.dataKey,
      posX: (midiClip.startTime / blockSnapSizeToTick) * blockSnapSize,
      posY: midiClip.trackKey * trackHeight,
      width: midiClip.length,
    };
  });

  console.log("initMidi", initedMidiClips);
  return initedMidiClips;
}

interface MidiClipPos {
  dataKey: number;
  trackKey: number;
  length: number;
  startTime: number;
}

interface Props {
  midiClipsPos: MidiClipPos[];
  numOfTracks: number;
  isImported: boolean;
}

function initMidiKeyGenerator(midiClipPos: MidiClipPos[]) {
  if (midiClipPos.length === 0) {
    return 0;
  }

  return (
    Math.max.apply(
      Math,
      midiClipPos.map((midiClip) => {
        return midiClip.dataKey;
      })
    ) + 1
  );
}

const ArrangementCanvas = React.memo((props: Props) => {
  // TODO: these values have to be responsive, if window resize event fires up, also less hardcoded

  console.log("IN ARR CANVAS", props.midiClipsPos);

  const trackHeight = 100 + 2; // + 2 -> margins and gaps
  const numOfTracks = props.numOfTracks;

  // TODO: lecheckolni, hogy ha lerövidítjük a track hosszát, akkor mi lesz azokkal a midiclippekkel amik "kilógnának"
  const numOfPhrases = useSelector(
    (state: Rootstate) => state.arrCanvasProps.numOfPhrases
  ); // Phrase = 4 measures
  const gridPadding = useSelector(
    (state: Rootstate) => state.arrCanvasProps.gridPadding
  ); // 1 / gridPadding -> how many grids in a phrase
  const midiClipColor = useSelector(
    (state: Rootstate) => state.arrCanvasProps.midiClipColor
  );

  const blockSnapSizeToTick = 192 / (gridPadding / 16);
  const dispatch = useDispatch();
  const curPositionRef = useRef<Konva.Rect>(null);
  const curPositionLayer = useRef<Konva.Layer>(null);
  // const [positionEventID, setPositionEventID]= useState<number | null>(null);

  // should be a hardcoded "4", so the first 4 measure will fit on the screen no problem
  //const canvasWidth = window.innerWidth - 61 - ((window.innerWidth - 61) % 4);
  const canvasWidth =
    numOfPhrases < 4
      ? window.innerWidth -
        61 +
        (numOfPhrases * gridPadding -
          ((window.innerWidth - 61) % (numOfPhrases * gridPadding)))
      : (window.innerWidth -
          61 +
          (numOfPhrases * gridPadding -
            ((window.innerWidth - 61) % (numOfPhrases * gridPadding)))) *
        (numOfPhrases / 4);
  // TODO: if numOfPhrases > 4 then we should use a vertical scrollbar to navigate

  const canvasHeight = trackHeight * numOfTracks; //only show the neccessary ammount of rows

  // TODO: blockSnapSize should be changeable, and the canvas should draw invisible lines to snap to
  const blockSnapSize = Math.round(canvasWidth / (numOfPhrases * gridPadding));

  const [midiKeyGenerator, setMidiKeyGenerator] = useState<number>(0);
  const [selectedMidiClipId, selectMidiClipId] = useState<number>(-1);

  useEffect(() => {
    if (!props.isImported) {
      return;
    }

    setMidiKeyGenerator(initMidiKeyGenerator(props.midiClipsPos));
  }, [props.isImported, props.midiClipsPos]);

  const curMidiClipsRect: MidiClipRectProps[] = initMidiClipRects(
    props.midiClipsPos,
    blockSnapSize,
    blockSnapSizeToTick,
    trackHeight
  );

  // useEffect(() => {
  //   midiClipLayerRef.current!.draw();
  // }, [props.midiClipsPos])

  console.log("AFTER INITED MIDIS", curMidiClipsRect);

  let gridLines: JSX.Element[] = [];

  for (let i = 0; i <= numOfPhrases * gridPadding; i += 1) {
    gridLines.push(
      <Line
        key={"arrangeV_" + i}
        name="line"
        points={[
          i * blockSnapSize + 0.5,
          0,
          i * blockSnapSize + 0.5,
          canvasHeight,
        ]}
        stroke={i % (gridPadding / 4) ? "gray" : "black"} // TODO: If time signature can be changed, then 4 should NOT be hardcoded here
        strokeWidth={i % (gridPadding / 4) ? 1 : 1.5}
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

  for (let i = 1; i <= numOfPhrases / 2; i++) {
    darkMeasureRects.push(
      <Rect
        key={"d_" + i * 2}
        name="darkMeasure"
        x={i * 2 * (canvasWidth / numOfPhrases) - canvasWidth / numOfPhrases}
        y={0}
        height={canvasHeight}
        width={canvasWidth / numOfPhrases}
        fill="#aaa"
        opacity={0.5}
      />
    );
  }

  useEffect(() => {
    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = `${numOfPhrases * 4}m`;
  }, [numOfPhrases]);

  useEffect(() => {
    // console.log("!!!!!IN CURTRANSPORT USEFF", positionEventID);

    // if (positionEventID !== null) {
    //   Tone.Transport.clear(positionEventID);
    // }

    // const eventID =
    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        if (Tone.Transport.state === "stopped") {
          return;
        }

        curPositionRef.current!.position({
          x: Math.trunc(canvasWidth * Tone.Transport.progress) - 20,
          y: 0,
        });
        curPositionLayer.current!.draw();
        // console.log(Tone.Transport.progress, Math.trunc(canvasWidth * Tone.Transport.progress) - 20);
      }, time);
    }, "10i");

    // setPositionEventID(eventID);
    // console.log("NEWID",positionEventID)
  }, [canvasWidth]);

  const curPositionRect = (
    <Rect
      x={-20}
      y={0}
      width={10}
      height={canvasHeight}
      fillLinearGradientStartPoint={{ x: 0, y: 0 }}
      fillLinearGradientEndPoint={{ x: 10, y: 0 }}
      fillLinearGradientColorStops={[
        0,
        "transparent",
        0.5,
        "orange",
        1,
        "transparent",
      ]}
      opacity={0.7}
      ref={curPositionRef}
    />
  );

  return (
    <div key="arrangementCanvas">
      <Stage
        key="arrangementStage"
        className="stageClass"
        width={canvasWidth + 2}
        // + 2 is needed if a note's transform anchor is at the edge, so the user can reach it
        height={canvasHeight}
        onMouseDown={(e) => {
          e.evt.preventDefault();

          if (e.evt.button === 0) {
            // left mouse button
            if (selectedMidiClipId !== -1) {
              if (
                e.target === e.target.getStage() ||
                e.target.getAttr("name") === "darkMeasure" ||
                e.target.getAttr("name") === "line"
              ) {
                selectMidiClipId(-1);
                dispatch(deselectMidiClip());
              }
            }
          } else if (e.evt.button === 1 && Tone.Transport.state === "stopped") {
            // middle mouse button

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
              false
            );

            console.log(posX);
            dispatch(
              changeTransportPosition(
                (posX / blockSnapSize) * blockSnapSizeToTick
              )
            );
            curPositionRef.current!.position({
              x: posX - 5,
              y: 0,
            });
            curPositionRef.current!.getLayer()!.draw();
          }
        }}
        onDblClick={(e) => {
          if (e.evt.button !== 0) {
            return;
          }

          // Adding new MIDI clip
          if (e.target.getAttr("dataKey") === undefined) {
            const transform = e.currentTarget
              .getAbsoluteTransform()
              .copy()
              .invert();
            const pos = e.currentTarget.getStage()!.getPointerPosition()!;

            const newMidiClipRect = {
              dataKey: midiKeyGenerator,
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
              width: 4,
            };

            const newMidi = getMidiClipFromRect(
              newMidiClipRect,
              [],
              trackHeight,
              blockSnapSize,
              blockSnapSizeToTick
            );

            setMidiKeyGenerator(midiKeyGenerator + 1);
            dispatch(
              addNewMidiClip({
                midiClipDataKey: newMidi.dataKey,
                trackDataKey: newMidi.trackKey,
                type: "ADD",
                newMidiClipProps: newMidi,
              })
            );
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
              const midiClipToDeleteDataKey = e.target.getAttr("dataKey");

              dispatch(deselectMidiClip());

              // Only need the dataKey and trackKey to delete a midi clip
              dispatch(
                deleteMidiClip({
                  midiClipDataKey: midiClipToDeleteDataKey,
                  trackDataKey: getMidiClipTrackKey(
                    curMidiClipsRect.find(
                      (item) => item.dataKey === midiClipToDeleteDataKey
                    )!.posY,
                    trackHeight
                  ),
                  type: "DELETE",
                })
              );
            }
          }}
        >
          {curMidiClipsRect.map((item, i) => {
            return (
              <MidiClip
                key={item.dataKey}
                dataKey={item.dataKey}
                shapeProps={{
                  posX: item.posX,
                  posY: item.posY,
                  width: item.width,
                  color: midiClipColor,
                }}
                isSelected={item.dataKey === selectedMidiClipId}
                canvasProps={{
                  canvasHeight: canvasHeight,
                  blockSnapSize: blockSnapSize,
                  canvasWidth: canvasWidth,
                  trackOrTileHeight: trackHeight,
                  gridPadding: gridPadding,
                }}
                handleSelect={(isDragging: boolean) => {
                  if (selectedMidiClipId !== item.dataKey) {
                    if (selectedMidiClipId !== -1) {
                      dispatch(deselectMidiClip());
                    }

                    selectMidiClipId(item.dataKey);
                  }
                  if (!isDragging) {
                    dispatch(
                      selectMidiClip(
                        getMidiClipTrackKey(item.posY, trackHeight),
                        item.dataKey
                      )
                    );
                  }
                }}
                changeSize={(newSize) => {
                  if (newSize === curMidiClipsRect[i].width) {
                    return;
                  }

                  const newMidiClip = getMidiClipFromRect(
                    {
                      dataKey: curMidiClipsRect[i].dataKey,
                      posX: curMidiClipsRect[i].posX,
                      posY: curMidiClipsRect[i].posY,
                      width: newSize,
                    },
                    [], // no need for notes, they won't be changed
                    trackHeight,
                    blockSnapSize,
                    blockSnapSizeToTick
                  );

                  // TODO:
                  // WHEN WE MOVE MIDICLIP, WE NEED AN OTHER PROP: prevTrackKey, or stmh like that
                  // ALSO a ModifyMidiClip interface would be nice, to again, optimize the Track component
                  dispatch(
                    updateMidiClip({
                      midiClipDataKey: newMidiClip.dataKey,
                      trackDataKey: newMidiClip.trackKey,
                      type: "UPDATE",
                      newMidiClipProps: newMidiClip,
                    })
                  );
                }}
                changePos={(newPosX: number, newPosY: number) => {
                  if (
                    newPosX === curMidiClipsRect[i].posX &&
                    newPosY === curMidiClipsRect[i].posY
                  ) {
                    return;
                  }

                  const prevTrackKey = getMidiClipTrackKey(
                    curMidiClipsRect[i].posY,
                    trackHeight
                  );

                  const newMidiClip = getMidiClipFromRect(
                    {
                      dataKey: curMidiClipsRect[i].dataKey,
                      posX: newPosX,
                      posY: newPosY,
                      width: curMidiClipsRect[i].width,
                    },
                    [],
                    trackHeight,
                    blockSnapSize,
                    blockSnapSizeToTick
                  );

                  dispatch(
                    updateMidiClip({
                      midiClipDataKey: newMidiClip.dataKey,
                      trackDataKey: prevTrackKey,
                      type: "UPDATE",
                      newMidiClipProps: newMidiClip,
                    })
                  );
                }}
              />
            );
          })}
        </Layer>
        <Layer key="curPosition" ref={curPositionLayer}>
          {curPositionRect}
        </Layer>
      </Stage>
    </div>
  );
});

export default ArrangementCanvas;
