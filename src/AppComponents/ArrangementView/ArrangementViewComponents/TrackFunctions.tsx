import * as Tone from "tone";

export type Instrument =
  | Tone.AMSynth
  | Tone.DuoSynth
  | Tone.FMSynth
  | Tone.MembraneSynth
  | Tone.MetalSynth
  | Tone.MonoSynth
  | Tone.PluckSynth
  | Tone.PolySynth
  | Tone.Synth;

function getInstrument(instrumentName: string) {
  // console.log("NEW INSTR");

  switch (instrumentName) {
    case "AMSynth":
      return new Tone.AMSynth().toDestination();
    case "DuoSynth":
      return new Tone.DuoSynth().toDestination();
    case "FMSynth":
      return new Tone.FMSynth().toDestination();
    case "MembraneSynth":
      return new Tone.MembraneSynth().toDestination();
    case "MetalSynth":
      return new Tone.MetalSynth().toDestination();
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

export { getInstrument };
