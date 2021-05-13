import {
  ModifyMidiClip,
  ModifyNote,
  TrackInterface,
  TrackProps,
} from "../Interfaces";

export const addNewTrack = (newTrack: TrackInterface) => {
  return {
    type: "ADD_NEW_TRACK",
    modifyTrack: newTrack,
  };
};

export const deleteTrack = (trackToDeleteDataKey: number) => {
  return {
    type: "DELETE_TRACK",
    trackIndex: trackToDeleteDataKey,
  };
};

export const changeTrackProps = (
  trackKey: number,
  newTrackProps: TrackProps
) => {
  return {
    type: "CHANGE_TRACK_PROPS",
    trackIndex: trackKey,
    newTrackProps: newTrackProps,
  };
};

export const clearModifyNote = () => {
  return {
    type: "CLEAR_MODIFY_NOTE",
  };
};

export const clearModifyMidiclip = () => {
  return {
    type: "CLEAR_MODIFY_MIDICLIP",
  };
};

export const selectMidiClip = (trackKey: number, midiClipDataKey: number) => {
  return {
    type: "SELECT_MIDI_CLIP",
    payload: {
      trackKey: trackKey,
      midiClipDataKey: midiClipDataKey,
    },
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
  };
};

export const deleteNote = (modifyNote: ModifyNote) => {
  return {
    type: "DELETE_NOTE",
    trackIndex: modifyNote.trackDataKey,
    modifyNote: modifyNote,
  };
};

export const updateNote = (modifyNote: ModifyNote) => {
  return {
    type: "UPDATE_NOTE",
    trackIndex: modifyNote.trackDataKey,
    modifyNote: modifyNote,
  };
};

export const exportProject = () => {
  return {
    type: "EXPORT_PROJECT",
  };
};

export const importProject = (importedJSON: JSON) => {
  return {
    type: "IMPORT_PROJECT",
    importedJSON: importedJSON,
  };
};

export const setImportedBPM = (newBPM: number) => {
  return {
    type: "SET_IMPORTED_BPM",
    payload: newBPM,
  };
};

export const clearImportedBPM = () => {
  return {
    type: "CLEAR_IMPORTED_BPM",
  };
};

export const clearEveryTrack = () => {
  return {
    type: "CLEAR_EVERY_TRACK",
  };
};

export const tracksCleared = () => {
  return {
    type: "TRACKS_CLEARED",
  };
};

export const clearImportFlag = () => {
  return {
    type: "CLEAR_IMPORT_FLAG",
  };
};

export const changeArrViewNumOfPhrases = (newNumOfPhrases: number) => {
  return {
    type: "CHANGE_ARR_VIEW_NUM_OF_PHRASES",
    payload: newNumOfPhrases,
  };
};

export const changeArrViewGridPadding = (newNumOfGridPadding: number) => {
  return {
    type: "CHANGE_ARR_VIEW_GRID_PADDING",
    payload: newNumOfGridPadding,
  };
};

export const changeMidiClipColor = (newColor: string) => {
  return {
    type: "CHANGE_MIDI_CLIP_COLOR",
    payload: newColor,
  };
};

export const changePianoRollViewGridPadding = (newNumOfGridPadding: number) => {
  return {
    type: "CHANGE_PIANO_ROLL_VIEW_GRID_PADDING",
    payload: newNumOfGridPadding,
  };
};

export const changeMidiNoteColor = (newColor: string) => {
  return {
    type: "CHANGE_MIDI_NOTE_COLOR",
    payload: newColor,
  };
};

export const changeTransportPosition = (newPosition: number) => {
  return {
    type: "SET_CUR_TRANSPORT_POSITION",
    payload: newPosition,
  };
};
