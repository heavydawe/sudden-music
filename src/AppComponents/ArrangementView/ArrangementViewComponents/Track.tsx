import React from 'react';
import * as Tone from 'tone';
import { MidiClip, ModifyNote } from '../../Interfaces';

function getInstrument(instrumentName: string) {
  switch (instrumentName) {
    case "polySynth":
      return new Tone.PolySynth(Tone.Synth, {
        volume: -8,
        oscillator: {
          partials: [1, 2, 1],
        },
      }).toDestination();

    //TODO: rest of the instruments

    default:
      throw new Error("Instrument's name is unknown!");
  }
}

interface Props {
  dataKey: number;
  trackName: string;
  trackColor: string;
  instrumentName: string;
  midiClips: MidiClip[];
  curNoteToModify: ModifyNote | null;
}

const Track = React.memo((props: Props) => {

  const instrument = getInstrument(props.instrumentName);

  console.log("RENDERING IN TRACK, KEY:", props.dataKey);

  const chord1 = ["D3", "G3"];
  const chord2 = ["F3", "Bb3"];
  const chord3 = ["G3", "C4"];
  const chord4 = ["G#3", "C#4"];

  const pianoPart = new Tone.Part(
    (time, chord) => {
      instrument.triggerAttackRelease(chord, "6n", time);
    },
    [
      ["0:0", chord1],
      ["0:1", chord2],
      ["0:2", chord3],
      ["0:3:2", chord1],
      ["1:0:2", chord2],
      ["1:1:2", chord4],
      ["1:2:0", chord3],
      ["2:0", chord1],
      ["2:1", chord2],
      ["2:2", chord3],
      ["2:3:2", chord2],
      ["3:0:2", chord1],
    ]
  ).start(0);

  pianoPart.loop = true;
  pianoPart.loopEnd = "4m";

  return(
    <div className="trackHeader">
      {props.trackName}
    </div>
  );
});

export default Track;