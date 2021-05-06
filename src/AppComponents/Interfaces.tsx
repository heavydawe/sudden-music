import { Dispatch } from "react";

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

export interface MidiNoteState {
  state: MidiNote[];
  setState: Dispatch<React.SetStateAction<MidiNote[]>>;
}

export interface MidiClipState {
  state: MidiClip[];
  setState: Dispatch<React.SetStateAction<MidiClip[]>>;
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
  color: string;
  instrument: string;
  midiClips: MidiClip[];
  // Instrument props here as well (for example: attack or release)?
}

export interface Rootstate {
  curTracks: {
    tracks: TrackInterface[];
    modifiedNote: ModifyNote | null;
    modifiedMidiClip: ModifyMidiClip | null;
  };
  selectedMidiClip: MidiClip;
  modifyNote: ModifyNote;
  arrCanvasProps: ArrCanvasProps;
  pianoRollCanvasProps: PianoRollCanvasProps;
}

export interface ArrCanvasProps {
  numOfPhrases: number;
  gridPadding: number;
  midiClipColor: string;
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
}

export interface NoteEvent {
  eventID: number;
  midiClipDataKey: number;
  noteDataKey: number;
}

export interface TrackProps {
  name: string;
  instrument: string;
  color: string;
}

export interface MidiClipPosInfo {
  dataKey: number;
  startTime: number;
  trackKey: number;
  length: number;
}
