import { MidiClip } from "../Interfaces";

const SelectedMidiClipReducer = (
  state: {
    trackKey: number;
    midiClipDataKey: number;
  } | null = null,
  action: {
    type: string;
    payload: { trackKey: number; midiClipDataKey: number };
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
