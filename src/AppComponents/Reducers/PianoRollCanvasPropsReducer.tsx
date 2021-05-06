import { PianoRollCanvasProps } from "../Interfaces";

const PianoRollCanvasPropsReducer = (
  state: PianoRollCanvasProps = {
    gridPadding: 16,
    midiNoteColor: "#6fff00",
  },
  action: {
    type: string;
    payload: number | string;
  }
) => {
  switch (action.type) {
    case "CHANGE_PIANO_ROLL_VIEW_GRID_PADDING":
      return {
        ...state,
        gridPadding: action.payload,
      };

    case "CHANGE_MIDI_NOTE_COLOR":
      return {
        ...state,
        midiNoteColor: action.payload,
      };

    default:
      return state;
  }
};

export default PianoRollCanvasPropsReducer;
