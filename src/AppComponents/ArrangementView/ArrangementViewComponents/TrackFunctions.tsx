import * as Tone from "tone";
// import { MidiClip, ModifyNote, NoteEvent } from "../../Interfaces";

export type Instrument =
  | Tone.AMSynth
  | Tone.DuoSynth
  | Tone.FMSynth
  | Tone.MembraneSynth
  | Tone.MonoSynth
  //  | Tone.NoiseSynth // NoiseSynth-nél nem működik a triggerAttackRelease a szokásos módon, mert ugye ő nem fog kapni "note"-ot
  | Tone.PluckSynth
  | Tone.PolySynth
  // | Tone.Sampler
  | Tone.Synth;

function getInstrument(instrumentName: string) {
  console.log("NEW INSTR");

  switch (instrumentName) {
    case "AMSynth":
      return new Tone.AMSynth().toDestination();
    case "DuoSynth":
      return new Tone.DuoSynth().toDestination();
    case "FMSynth":
      return new Tone.FMSynth().toDestination();
    case "MembraneSynth":
      return new Tone.MembraneSynth().toDestination();
    case "MonoSynth":
      return new Tone.MonoSynth().toDestination();
    case "PluckSynth":
      return new Tone.PluckSynth().toDestination();
    case "PolySynth":
      return new Tone.PolySynth().toDestination();
    case "Synth":
      return new Tone.Synth().toDestination();

    default:
      throw new Error("Instrument's name is unknown!");
  }
}

// function updateCurEvents(
//   modifiedNote: ModifyNote,
//   midiClips: MidiClip[],
//   instrument: Instrument,
//   curEvents: NoteEvent[],
//   setCurEvents: React.Dispatch<React.SetStateAction<NoteEvent[]>>
// ) {
//   switch (modifiedNote.type) {
//     case "ADD":
//       const eventID = Tone.Transport.schedule(() => {
//         console.log("ADDING NOTE");
//         instrument.triggerAttackRelease(
//           modifiedNote.newNoteProps!.note,
//           `${modifiedNote.newNoteProps!.length}i`,
//           `+${modifiedNote.newNoteProps!.startTime}i`
//         );
//       }, `${midiClips[modifiedNote.midiClipDataKey].startTime}i`);

//       setCurEvents([
//         ...curEvents,
//         {
//           eventID: eventID,
//           midiClipDataKey: modifiedNote.midiClipDataKey,
//           noteDataKey: modifiedNote.noteDataKey,
//         },
//       ]);
//       return;

//     case "DELETE":
//       const noteEventToDeleteIndex = curEvents.findIndex(
//         (noteEvent) => noteEvent.noteDataKey === modifiedNote.noteDataKey
//       )!;

//       Tone.Transport.clear(curEvents[noteEventToDeleteIndex].eventID);
//       setCurEvents([
//         ...curEvents.slice(0, noteEventToDeleteIndex),
//         ...curEvents.slice(noteEventToDeleteIndex + 1),
//       ]);
//       return;

//     case "UPDATE":
//       return;

//     default:
//       throw new Error("Update type unknown");
//   }
// }

export { getInstrument };
