import { ArrCanvasProps } from "../Interfaces";

const ArrCanvasPropsReducer = (
  state: ArrCanvasProps = {
    numOfPhrases: 4,
    gridPadding: 16,
    midiClipColor: "grey",
  },
  action: {
    type: string;
    payload: number | string;
  }
) => {
  switch (action.type) {
    case "CHANGE_ARR_VIEW_NUM_OF_PHRASES":
      return {
        ...state,
        numOfPhrases: action.payload,
      };

    case "CHANGE_ARR_VIEW_GRID_PADDING":
      return {
        ...state,
        gridPadding: action.payload,
      };

    case "CHANGE_MIDI_CLIP_COLOR":
      return {
        ...state,
        midiClipColor: action.payload,
      };

    default:
      return state;
  }
};

export default ArrCanvasPropsReducer;
