import { Dispatch } from "react";

export interface MidiNote {
  datakey: number;
  startTime: number;
  length: number;
  note: string;
}

export interface MidiClip {
  dataKey: string;
  track: string;
  startTime: string;
  length: string;
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
}