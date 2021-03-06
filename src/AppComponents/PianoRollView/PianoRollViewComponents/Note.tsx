import Konva from "konva";
import React, { useRef } from "react";
import { Rect, Transformer } from "react-konva";

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
  id: string;
  shapeProps: ShapeProps;
  canvasProps: CanvasProps;
  isSelected: boolean;
  handleSelect: () => void;
  changeSize: (newSize: number) => void;
}

function Note(props: Props) {
  const canvasWidth = props.canvasProps.canvasWidth;
  const canvasHeight = props.canvasProps.canvasHeight;
  const blockSnapSize = props.canvasProps.blockSnapSize;
  const tileHeight = props.canvasProps.tileHeight;

  const noteRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (props.isSelected) {
      // we need to attach transformer manually
      trRef.current!.nodes([noteRef.current!]);
      trRef.current!.getLayer()!.batchDraw();
    }
  }, [props.isSelected]);

  function getPositionX(curX: number, width: number, useFloor: boolean) {
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

  function getPositionY(curY: number, useFloor: boolean) {
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

  return (
    <>
      <Rect
        data-key={props.id}
        x={getPositionX(
          props.shapeProps.x,
          props.shapeProps.size * blockSnapSize,
          true
        )}
        y={getPositionY(props.shapeProps.y, true)}
        width={props.shapeProps.size * blockSnapSize}
        height={tileHeight}
        fill="#6fff00"
        strokeWidth={0}
        stroke="gray"
        draggable={true}
        ref={noteRef}
        // onDragStart={(e) => {
        //   shadowNote.show();
        //   shadowNote.moveToTop();
        //   e.target.moveToTop();
        // }}
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
        // onMouseMove={(e) => {
        //   const transform = e.currentTarget
        //     .getAbsoluteTransform()
        //     .copy()
        //     .invert();

        //   const pos = e.currentTarget.getStage()?.getPointerPosition()!;

        //   if (transform.point(pos).x > e.target.width() - 10) {
        //     console.log(transform.point(pos));
        //     // TODO: change cursor to the bidirectional one, if possible
        //   }
        // }}
        onMouseLeave={(e) => {
          e.target.setAttrs({
            fill: "#6fff00",
          });
          e.currentTarget.draw();
        }}
        onDragEnd={(e) => {
          e.target.position({
            x: getPositionX(e.target.x(), e.target.width(), false),
            y: getPositionY(e.target.y(), false),
          });
        }}
        onTransformEnd={(e) => {
          const scaleAmmount = noteRef.current!.scaleX();
          noteRef.current!.scaleX(1);

          //TODO: need to check for extreme scenarios
          const newSize = Math.round(props.shapeProps.size * scaleAmmount);

          console.log(newSize);

          if (newSize * blockSnapSize > canvasWidth - e.target.x()) {
            props.changeSize(Math.round((canvasWidth - e.target.x()) / blockSnapSize));
          } else {
            props.changeSize(newSize);
          }

          
          // if (newSize < 1) {
          //   props.changeSize(1);
          // } else {
          //   props.changeSize(newSize);
          // }
        }}
        // onDragMove={(e) => {
        //   shadowNote.position({
        //     x:
        //       e.target.x() < 0
        //         ? e.target.x() + e.target.width() > canvasWidth
        //           ? canvasWidth - e.target.width()
        //           : Math.round(e.target.x() / blockSnapSize) * blockSnapSize
        //         : Math.round(e.target.x() / blockSnapSize) * blockSnapSize,
        //     y:
        //       e.target.y() < 0
        //         ? 0
        //         : Math.round(e.target.y() / tileHeight) * tileHeight,
        //   });

        //   shadowNote.show();
        // }}
      />
      {props.isSelected && (
        <Transformer
          key="tr"
          ref={trRef}
          enabledAnchors={["middle-right"]}
          rotateEnabled={false}
          borderStroke="orange"
          anchorCornerRadius={5}
          anchorFill="orange"
          anchorStrokeWidth={0}
          resizeEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < blockSnapSize / 2) {
              trRef.current!.stopTransform();
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
