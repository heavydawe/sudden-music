export interface MidiNote {
  dataKey: number;
  startTime: number;
  length: number;
  note: string;
}

export interface MidiClip {
  dataKey: number;
  trackKey: number;
  startTime: number;
  length: number;
  notes: MidiNote[];
}

export interface NoteRectProps {
  dataKey: number;
  posX: number;
  posY: number;
  width: number;
}

export interface MidiClipRectProps {
  dataKey: number;
  posX: number;
  posY: number;
  width: number;
}

export interface ShapeProps {
  posX: number;
  posY: number;
  width: number;
  color: string;
}

export interface TrackInterface {
  dataKey: number;
  name: string;
  // color: string;
  instrument: string;
  midiClips: MidiClip[];
  isMuted: boolean;
  // Instrument props here as well (for example: attack or release)?
}

export interface Rootstate {
  curTracks: {
    tracks: TrackInterface[];
    modifiedNote: ModifyNote | null;
    modifiedMidiClip: ModifyMidiClip | null;
    isImported: boolean;
  };
  importedProps: {
    BPM: number;
  };
  selectedMidiClip: { trackKey: number; midiClipDataKey: number };
  arrCanvasProps: ArrCanvasProps;
  pianoRollCanvasProps: PianoRollCanvasProps;
  curTransportPosition: number;
  disposeTracks: boolean;
}

export interface ArrCanvasProps {
  numOfPhrases: number;
  gridPadding: number;
  midiClipColor: string;
  prevNumOfPhrases: number;
}

export interface PianoRollCanvasProps {
  gridPadding: number;
  midiNoteColor: string;
}

export interface CanvasProps {
  canvasWidth: number;
  canvasHeight: number;
  blockSnapSize: number;
  trackOrTileHeight: number;
  gridPadding: number;
}

export interface ModifyNote {
  trackDataKey: number;
  midiClipDataKey: number;
  noteDataKey: number;
  type: "ADD" | "DELETE" | "UPDATE";
  newNoteProps?: MidiNote;
}

export interface ModifyMidiClip {
  trackDataKey: number;
  midiClipDataKey: number;
  type: "ADD" | "DELETE" | "UPDATE";
  newMidiClipProps?: MidiClip;
  oldTrackInstrumentName?: string;
}

export interface TrackProps {
  name: string;
  instrument: string;
  // color: string;
}

export interface MidiClipPosInfo {
  dataKey: number;
  startTime: number;
  trackKey: number;
  length: number;
}

export interface SampleProps {
  sampleName: string;
  samplePath: string;
  sampleStartTime: number;
  sampleRepeatTime: number;
}
