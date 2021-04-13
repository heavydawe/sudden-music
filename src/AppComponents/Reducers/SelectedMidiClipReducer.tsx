import { MidiClip } from "../Interfaces";

const SelectedMidiClipReducer = (
  state: MidiClip | null = null,
  action: {
    type: string;
    payload: MidiClip;
  }
) => {
  switch (action.type) {
    case "SELECT_MIDI_CLIP":
      return action.payload;
    case "DESELECT_MIDI_CLIP":
      return null;

    default:
      return state;
  }
};

export default SelectedMidiClipReducer;
