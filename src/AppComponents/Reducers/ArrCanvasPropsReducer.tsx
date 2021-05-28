import { ArrCanvasProps } from "../Interfaces";

const ArrCanvasPropsReducer = (
  state: ArrCanvasProps = {
    numOfPhrases: 4,
    gridPadding: 16,
    midiClipColor: "grey",
    prevNumOfPhrases: 4,
  },
  action: {
    type: string;
    payload: number | string;
  }
) => {
  switch (action.type) {
    case "CHANGE_ARR_VIEW_NUM_OF_PHRASES":
      const curNumOfPhrases = state.numOfPhrases;

      return {
        ...state,
        numOfPhrases: action.payload,
        prevNumOfPhrases: curNumOfPhrases,
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

    case "REVERT_ARR_VIEW_NUM_OF_PHRASES":
      (document.getElementById("numOfPhrases") as HTMLSelectElement).value =
        state.prevNumOfPhrases.toString();

      return {
        ...state,
        numOfPhrases: state.prevNumOfPhrases,
      };

    default:
      return state;
  }
};

export default ArrCanvasPropsReducer;
