import { MidiClip, ModifyMidiClip, ModifyNote } from "../Interfaces";

export const addNewTracks = () => {
  return {
    type: "ADD_NEW_TRACK",
    payload: "todo",
  };
};

export const renameTrack = (trackKey: number, newName: string) => {
  return {
    type: "CHANGE_TRACK_NAME",
    trackIndex: trackKey,
    payload: newName,
  };
};

export const changeInstrument = (trackKey: number, newInstrumentName: string) => {
  return {
    type: "CHANGE_INSTRUMENT",
    trackIndex: trackKey,
    payload: newInstrumentName,
  };
};

export const clearModifyNote = () => {
  return {
    type: "CLEAR_MODIFY_NOTE"
  }
}

export const clearModifyMidiclip = () => {
  return {
    type: "CLEAR_MODIFY_MIDICLIP"
  }
}

export const selectMidiClip = (selectedMidiClip: MidiClip) => {
  return {
    type: "SELECT_MIDI_CLIP",
    payload: selectedMidiClip,
  };
};

export const deselectMidiClip = () => {
  return {
    type: "DESELECT_MIDI_CLIP",
  };
};

export const addNewMidiClip = (modifyMidiClip: ModifyMidiClip) => {
  return {
    type: "ADD_MIDI_CLIP",
    trackIndex: modifyMidiClip.trackDataKey,
    modifyMidiClip: modifyMidiClip,
  };
};

export const deleteMidiClip = (modifyMidiClip: ModifyMidiClip) => {
  return {
    type: "DELETE_MIDI_CLIP",
    trackIndex: modifyMidiClip.trackDataKey,
    modifyMidiClip: modifyMidiClip,
  };
};

export const updateMidiClip = (modifyMidiClip: ModifyMidiClip) => {
  return {
    type: "UPDATE_MIDI_CLIP",
    trackIndex: modifyMidiClip.trackDataKey,
    modifyMidiClip: modifyMidiClip,
  };
};

export const addNewNote = (modifyNote: ModifyNote) => {
  return {
    type: "ADD_NOTE",
    trackIndex: modifyNote.trackDataKey,
    modifyNote: modifyNote,
  }
}

export const deleteNote = (modifyNote: ModifyNote) => {
  return {
    type: "DELETE_NOTE",
    trackIndex: modifyNote.trackDataKey,
    modifyNote: modifyNote,
  }
}

export const updateNote = (modifyNote: ModifyNote) => {
  return {
    type: "UPDATE_NOTE",
    trackIndex: modifyNote.trackDataKey,
    modifyNote: modifyNote,
  }
}