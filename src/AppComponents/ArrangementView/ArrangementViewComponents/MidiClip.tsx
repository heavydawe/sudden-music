import Konva from "konva";
import { Rect, Transformer } from "react-konva";
import { useRef, useEffect } from "react";

interface MidiNote {
  startTime: string;
  length: string;
  note: string;
}

interface ShapeProps {
  posX: number;
  posY: number;
  size: number;
}

interface Props {
  dataKey: number;
  midiClipName: string;
  shapeProps: ShapeProps;
  midiNotes: MidiNote[];
  isSelected: boolean;
  handleSelect: () => void;
  changeSize: (newSize: number) => void;
}

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
  tileHeight: number,
  useFloor: boolean
) {
  if (curY < 0) {
    return 0;
  }

  if (curY + tileHeight > canvasHeight) {
    return canvasHeight - tileHeight;
  }

  if (useFloor) {
    return Math.floor(curY / tileHeight) * tileHeight;
  } else {
    return Math.round(curY / tileHeight) * tileHeight;
  }
}

function MidiClip(props: Props) {
  // TODO: these values have to be responsive, if window resize event fires up, also less hardcoded
  const trackHeight = 100 + 2; // + 1 -> margins and gaps
  const numOfTracks = 2;
  const numOfMeasures = 4; // How many measures long the piano roll should be
  const gridPadding = 16; // 1 / gridPadding -> density of the grids

  // should be a hardcoded "4", so the first 4 measure will fit on the screen no porblem
  const canvasWidth = window.innerWidth - 61 - ((window.innerWidth - 61) % 4);
  // TODO: if numOfMeasures > 4 then we should use a vertical scrollbar to navigate

  const canvasHeight = trackHeight * numOfTracks + 1; //only show the neccessary ammount of rows

  // TODO: blockSnapSize should be changeable, and the canvas should draw invisible lines to snap to
  const blockSnapSize = Math.round(canvasWidth / (numOfMeasures * gridPadding));

  const midiClipRef = useRef<Konva.Rect>(null);
  const trRefMidi = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (props.isSelected) {
      trRefMidi.current!.nodes([midiClipRef.current!]);
      trRefMidi.current!.getLayer()!.batchDraw();
    }
  }, [props.isSelected]);

  return (
    <>
      <Rect
        dataKey={props.dataKey}
        ref={midiClipRef}
        x={props.shapeProps.posX}
        y={props.shapeProps.posY}
        midiClipName={props.midiClipName}
        curTrackIndex={Math.round(props.shapeProps.posY / trackHeight)}
        width={props.shapeProps.size * blockSnapSize}
        height={trackHeight}
        fill="blue"
        draggable={true}
        onClick={(e) => {
          if (e.evt.button === 0) {
            props.handleSelect();
          }
        }}
        onDragEnd={(e) => {
          const newX = getPositionX(
            e.target.x(),
            e.target.width(),
            canvasWidth,
            blockSnapSize,
            false
          );
          const newY = getPositionY(
            e.target.y(),
            canvasHeight,
            trackHeight,
            false
          );

          e.target.setAttr("curTrackIndex", Math.round(newY / trackHeight));
          e.target.position({
            x: newX,
            y: newY,
          });
        }}
        onTransformEnd={(e) => {
          const scaleAmmount = midiClipRef.current!.scaleX();
          midiClipRef.current!.scaleX(1);
          const newSize = Math.round(props.shapeProps.size * scaleAmmount);

          if (newSize * blockSnapSize > canvasWidth - e.target.x()) {
            props.changeSize(
              Math.round((canvasWidth - e.target.x()) / blockSnapSize)
            );
          } else {
            props.changeSize(newSize);
          }
        }}
      />
      {props.isSelected && (
        <Transformer
          key="trMidi"
          ref={trRefMidi}
          enabledAnchors={["middle-right"]}
          rotateEnabled={false}
          borderStroke="orange"
          anchorCornerRadius={5}
          anchorFill="orange"
          anchorStrokeWidth={0}
          resizeEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < blockSnapSize / 2) {
              trRefMidi.current!.stopTransform();
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default MidiClip;
