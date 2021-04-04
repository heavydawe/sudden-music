import Konva from "konva";
import { Rect, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import { getPositionX, getPositionY } from '../../GetPositionFunctions';
import { ShapeProps } from "../../Interfaces";

interface Props {
  dataKey: number;
  shapeProps: ShapeProps;
  isSelected: boolean;
  handleSelect: () => void;
  changeSize: (newSize: number) => void;
  changeView: (newView: string) => void;
  changePos: (newPosX: number, newPosY: number) => void;
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
        width={props.shapeProps.width * blockSnapSize}
        height={trackHeight}
        fill="grey"
        draggable={true}
        onClick={(e) => {
          if (e.evt.button === 0) {
            props.handleSelect();
          }
        }}
        onDragEnd={(e) => {
          const posX = getPositionX(
            e.target.x(),
            e.target.width(),
            canvasWidth,
            blockSnapSize,
            false
          );
          const posY = getPositionY(
            e.target.y(),
            canvasHeight,
            trackHeight,
            false
          );
          
          e.target.position({
            x: posX,
            y: posY,
          });
          props.changePos(posX, posY);
        }}
        onTransformEnd={(e) => {
          const scaleAmmount = midiClipRef.current!.scaleX();
          midiClipRef.current!.scaleX(1);
          const newSize = Math.round(props.shapeProps.width * scaleAmmount);

          if (newSize * blockSnapSize > canvasWidth - e.target.x()) {
            props.changeSize(
              Math.round((canvasWidth - e.target.x()) / blockSnapSize)
            );
          } else {
            props.changeSize(newSize);
          }
        }}
        onDblClick={(e) => {
          props.changeView("piano");
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