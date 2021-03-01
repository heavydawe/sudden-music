import React, { useState } from "react";
import "./Cell.css";

interface Props {
  cellKey: number
  color: string;
  isHighlighted: boolean;
  noteDown: (cellKey: number) => void;
}

function Cell(props: Props) {

  const [curHigh, setCurHigh] = useState(props.isHighlighted);

  function getCellClassName() {
    if (curHigh) {
      return "cellHighLighted";
    } else {
      if (props.color === "w") {
        return "cellWhiteTile";
      } else {
        return "cellGrayTile";
      }
    }
  }

  return (
    <div
      className={getCellClassName()}
      onClick={() => {
        setCurHigh(!curHigh);
        props.noteDown(props.cellKey);
      }}
    >
      {props.cellKey}
    </div>
  );
}

export default Cell;
