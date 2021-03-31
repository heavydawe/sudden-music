import Konva from "konva";
import { useRef, useEffect } from "react";
import { Rect, Transformer } from "react-konva";
import { getPositionX, getPositionY } from '../../GetPositionFunctions';

interface ShapeProps {
  x: number;
  y: number;
  size: number;
}

interface CanvasProps {
  canvasWidth: number;
  canvasHeight: number;
  blockSnapSize: number;
  tileHeight: number;
}

interface Props {
  dataKey: number;
  shapeProps: ShapeProps;
  canvasProps: CanvasProps;
  isSelected: boolean;
  handleSelect: () => void;
  changeSize: (newSize: number) => void;
  getNoteInfo?: (posX: number, posY: number, length: number) => void;
}

function Note(props: Props) {
  const canvasWidth = props.canvasProps.canvasWidth;
  const canvasHeight = props.canvasProps.canvasHeight;
  const blockSnapSize = props.canvasProps.blockSnapSize;
  const tileHeight = props.canvasProps.tileHeight;

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
        x={props.shapeProps.x}
        y={props.shapeProps.y}
        width={props.shapeProps.size * blockSnapSize}
        height={tileHeight}
        fill="#6fff00"
        strokeWidth={0}
        stroke="black"
        draggable={true}
        ref={noteRef}
        onClick={(e) => {
          if (e.evt.button === 0) {
            props.handleSelect();
          }
        }}
        // onTap={() => props.handleSelect()}
        onMouseOver={(e) => {
          e.target.setAttrs({ fill: "yellow" });
          e.currentTarget.draw();
        }}
        onMouseLeave={(e) => {
          e.target.setAttrs({
            fill: "#6fff00",
          });
          e.currentTarget.draw();
        }}
        onDragEnd={(e) => {
          e.target.position({
            x: getPositionX(
              e.target.x(),
              e.target.width(),
              canvasWidth,
              blockSnapSize,
              false
            ),
            y: getPositionY(e.target.y(), canvasHeight, tileHeight, false),
          });
        }}
        onTransformEnd={(e) => {
          const scaleAmmount = noteRef.current!.scaleX();
          noteRef.current!.scaleX(1);
          const newSize = Math.round(props.shapeProps.size * scaleAmmount);

          if (newSize * blockSnapSize > canvasWidth - e.target.x()) {
            props.changeSize(
              Math.round((canvasWidth - e.target.x()) / blockSnapSize)
            );
          } else {
            props.changeSize(newSize);
          }

          // if (newSize < 1) {
          //   props.changeSize(1);
          // } else {
          //   props.changeSize(newSize);
          // }
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
            if (newBox.width < blockSnapSize / 2) {
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
