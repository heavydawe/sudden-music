import Konva from "konva";
import { Rect, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import { getPositionX, getPositionY } from "../../GetPositionFunctions";
import { ShapeProps, CanvasProps } from "../../Interfaces";

interface Props {
  dataKey: number;
  shapeProps: ShapeProps;
  isSelected: boolean;
  canvasProps: CanvasProps;
  handleSelect: (isDragging: boolean) => void;
  changeSize: (newSize: number) => void;
  changePos: (newPosX: number, newPosY: number) => void;
}

function MidiClip(props: Props) {
  const canvasWidth = props.canvasProps.canvasWidth;
  const canvasHeight = props.canvasProps.canvasHeight;
  const blockSnapSize = props.canvasProps.blockSnapSize;
  const trackHeight = props.canvasProps.trackOrTileHeight;
  const gridPadding = props.canvasProps.gridPadding;

  const midiClipRef = useRef<Konva.Rect>(null);
  const trRefMidi = useRef<Konva.Transformer>(null);

  console.log("!!IN MIDI ", props.dataKey, " shapeProps: ", props.shapeProps);

  useEffect(() => {
    if (props.isSelected) {
      trRefMidi.current!.nodes([midiClipRef.current!]);
      trRefMidi.current!.getLayer()!.batchDraw();
    }
  }, [props.isSelected]);

  // useEffect(() => {
  //   midiClipRef.current!.position({
  //     x: props.shapeProps.posX,
  //     y: props.shapeProps.posY,
  //   });
  //   midiClipRef.current!.draw();
  //   midiClipRef.current!.getParent().draw();
  //   console.log("REDRAW MIDI", midiClipRef.current!.getPosition());
  // }, [props.shapeProps]);

  return (
    <>
      <Rect
        dataKey={props.dataKey}
        ref={midiClipRef}
        x={props.shapeProps.posX}
        y={props.shapeProps.posY}
        width={props.shapeProps.width * blockSnapSize * (gridPadding / 16)}
        height={trackHeight}
        stroke="black"
        strokeWidth={0.1}
        cornerRadius={10}
        fill={props.shapeProps.color}
        draggable={true}
        onDragStart={(e) => {
          if (e.evt.button === 0) {
            props.handleSelect(true);
          }
        }}
        onClick={(e) => {
          if (e.evt.button === 0) {
            props.handleSelect(false);
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
            x: props.shapeProps.posX,
            y: props.shapeProps.posY,
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
            if (newBox.width < blockSnapSize * (gridPadding / 16)) {
              trRefMidi.current!.stopTransform();
              return oldBox;
            }

            if (newBox.width > blockSnapSize * gridPadding) {
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
