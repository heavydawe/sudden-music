import Konva from "konva";
import { useRef, useEffect } from "react";
import { Rect, Transformer } from "react-konva";
import { getPositionX, getPositionY } from "../../GetPositionFunctions";
import { ShapeProps, CanvasProps } from "../../Interfaces";

interface Props {
  dataKey: number;
  shapeProps: ShapeProps;
  canvasProps: CanvasProps;
  isSelected: boolean;
  handleSelect: () => void;
  changeSize: (newSize: number) => void;
  changePos: (newPosX: number, newPosY: number) => void;
  getNoteInfo?: (posX: number, posY: number, length: number) => void;
}

function Note(props: Props) {
  const canvasWidth = props.canvasProps.canvasWidth;
  const canvasHeight = props.canvasProps.canvasHeight;
  const blockSnapSize = props.canvasProps.blockSnapSize;
  const tileHeight = props.canvasProps.trackOrTileHeight;

  const noteRef = useRef<Konva.Rect>(null);
  const trRefNote = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (props.isSelected) {
      trRefNote.current!.nodes([noteRef.current!]);
      trRefNote.current!.getLayer()!.batchDraw();
    }
  }, [props.isSelected]);

  return (
    <>
      <Rect
        dataKey={props.dataKey}
        x={props.shapeProps.posX}
        y={props.shapeProps.posY}
        width={props.shapeProps.width * blockSnapSize}
        height={tileHeight}
        fill={props.shapeProps.color}
        strokeWidth={0}
        stroke="black"
        draggable={true}
        ref={noteRef}
        onDragStart={(e) => {
          if (e.evt.button === 0) {
            props.handleSelect();
          }
        }}
        onClick={(e) => {
          if (e.evt.button === 0) {
            props.handleSelect();
          }
        }}
        onMouseOver={(e) => {
          e.target.setAttrs({ fill: "yellow" });
          e.currentTarget.draw();
        }}
        onMouseLeave={(e) => {
          e.target.setAttrs({ fill: props.shapeProps.color });
          e.currentTarget.draw();
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
            tileHeight,
            false
          );

          e.target.position({
            x: props.shapeProps.posX,
            y: props.shapeProps.posY,
          });
          props.changePos(posX, posY);
        }}
        onTransformEnd={(e) => {
          const scaleAmmount = noteRef.current!.scaleX();
          noteRef.current!.scaleX(1);
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
          key="trNote"
          ref={trRefNote}
          enabledAnchors={["middle-right"]}
          rotateEnabled={false}
          borderStroke="orange"
          anchorCornerRadius={5}
          anchorFill="orange"
          anchorStrokeWidth={0}
          resizeEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < blockSnapSize) {
              trRefNote.current!.stopTransform();
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default Note;
