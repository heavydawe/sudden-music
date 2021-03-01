import React, { useRef } from "react";
import { Rect, Stage, Layer} from "react-konva";
// import { Rect } from 'konva/types/shapes/Rect';

function Note() {
  // const stage = new Konva.Stage({
  //   height: 600,
  //   width: 600,
  //   container: "gridContainer",
  // });

  const stageRef = useRef(null);

  return (
    <Stage width={500} height={500} ref={stageRef}>
      <Layer>
        <Rect
          name="draggableNote"
          x={200}
          y={200}
          height={20}
          width={50}
          fill="green"
          draggable
        ></Rect>
      </Layer>
    </Stage>
  );
}

export default Note;
